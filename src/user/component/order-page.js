import React from 'react';
import {withRouter} from "react-router-dom";
import * as CART_API from "../cart-api"
import * as VOUCHER_API from "../voucher-api"
import * as ADDRESS_API from "../address-api"
import order from "../../img/logo.png"
import {Button} from 'react-bootstrap'
import Select from "react-select";
import {HOST} from '../../commons/hosts'
import axios from "axios"


class OrderPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            username: JSON.parse(localStorage.getItem("loggedUser")).username,
            cart: {},
            productList: [],
            errorStatus: 0,
            error: '',
            voucherList: [],
            voucher: {},
            cartPrice: 0,
            address: {},
            addressList: [],
            usedVouchers: [],
            emails: [],
            email: {}
        }
        this.fetchProducts = this.fetchProducts.bind(this);
        this.fetchEmails = this.fetchEmails.bind(this);
        this.fetchAddresses = this.fetchAddresses.bind(this);
        this.fetchUsedVouchers = this.fetchUsedVouchers.bind(this);
        this.fetchVouchers = this.fetchVouchers.bind(this);
        this.handleAddVoucher = this.handleAddVoucher.bind(this);
        this.handlePlaceOrder = this.handlePlaceOrder.bind(this);
    }

    fetchEmails() {
        const {username} = this.state;
        axios.get(HOST.backend_api + "/emails/" + username)
        .then(response => {
            this.setState({emails: response.data});
        })
    }

    fetchUsedVouchers() {
        const {username} = this.state;
        axios.get(HOST.backend_api + "/used_vouchers/" + username)
        .then(response => {
            this.setState({usedVouchers: response.data});
        })
    }

    fetchProducts() {
        const {username} = this.state;
        CART_API.getCartByUsername(username, (result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                this.setState({
                    cart: result,
                    cartPrice: result.fullPrice
                })
                this.setState({
                    productList: result.products
                })
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        })
    }

    fetchAddresses() {
        let username = JSON.parse(localStorage.getItem("loggedUser")).username;
        if (username !== undefined) 
        ADDRESS_API.getAddressByUsername(username, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState(({
                    addressList: result
                }));
                
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        })
    }

    fetchVouchers() {
        VOUCHER_API.getVouchers((result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                this.setState({
                    voucherList: result
                })
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        })
    }

    handleAddVoucher() {
        //console.log(document.getElementById('voucherInput').value)
        const {usedVouchers} = this.state;
        var uniqueAndUsed = false;
        const code = document.getElementById('voucherInput').value;
        if (usedVouchers.length > 0) {
            for (let i = 0; i < usedVouchers.length; ++i) {
                if (usedVouchers[i].code === code) {
                    if (usedVouchers[i].oneTimeOnly === true) {
                        uniqueAndUsed = true;
                        break;
                    }
                }
            }
        }
        if (uniqueAndUsed === false) {
            const {voucherList, cart} = this.state;
            var found = false;
            if (cart !== undefined) {
                var price = cart.fullPrice;
                if (voucherList.length > 0) {
                    for (let i = 0; i < voucherList.length; ++i) {
                        if (code === voucherList[i].code) {
                            const start = voucherList[i].startDate;
                            const end = voucherList[i].endDate;

                            const startDate = new Date(start.substring(0,10));
                            const endDate = new Date(end.substring(0,10));
                            const today = new Date();

                            if (startDate < today && endDate > today) {
                                price = price - (voucherList[i].discount / 100) * price;
                                this.setState({cartPrice: price, voucher: voucherList[i]});
                                var s = document.getElementById("orderPrice");
                                s.value = price;
                                found = true;
                                break;
                            } else {
                                alert("Can't apply voucher with code \"" + code + "\". It's either unusable yet, or expired.")
                            }
                        }
                    }
                }
            }
            if (!found) {
                alert("Voucher with code \"" + code + "\" not found. Try again")
            }
        } else {
            alert("You've already used voucher with code \"" + code + "\". Please note this is a one-time-only voucher.")
        }
    }

    handleAddressChange = address => 
    {
        this.setState({address})
    }

    handleEmailChange = email => 
    {
        this.setState({email})
    }

    isCartValid(cart) {
        var productsWithNumber = [];
        for (let i = 0; i < cart.products.length; ++i) {
            if (productsWithNumber[cart.products[i].productId] !== undefined) {
                productsWithNumber[cart.products[i].productId] += 1;
            } else {
                productsWithNumber[cart.products[i].productId] = 1;
            }
        }

        for (let i = 0; i < cart.products.length; ++i) {
            if (productsWithNumber[cart.products[i].productId] !== undefined) {
                if (productsWithNumber[cart.products[i].productId] > cart.products[i].stock) {
                    return false;
                }
            }
        }
        return true;
    }

    getProducts(prods) {
        let products = "";
        if (prods.length > 0) {
            for (let i = 0; i < prods.length; ++i) {
                products += prods[i].name + " - $" + prods[i].price + "; <br>";
            }
        }
        return products;
    }

    handlePlaceOrder() {
        const {voucher, voucherList, address, cartPrice, email, username} = this.state;
        var cart = this.state.cart;
        console.log(address);

        if (this.isCartValid(cart) === true) {
            console.log(cart);
            var noVoucher = {};
            if (JSON.stringify(voucher) === JSON.stringify({})) {
                var exists = false;
                for (let i = 0; i < voucherList.length; ++i) {
                    if (voucherList[i].code === "NONE") {
                        noVoucher = voucherList[i];
                        exists = true; break;
                    }
                }

                const postMethod = {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            'products': cart.products,
                            'customer': cart.customer,
                            'finalPrice': cartPrice,
                            'address': address.value,
                            'delivered': false,
                            'voucher': noVoucher
                        }
                    )
                }

                fetch(HOST.backend_api + '/orders', postMethod)
                    .then(response => {})
                    .then(data => {
                        
                        cart.products.map((product) => {
                
                            product.stock = product.stock - 1;
                            product.numberSold = product.numberSold + 1;
                            const putProductMethod = {
                                method: 'PUT',
                                headers: {
                                    'Content-type': 'application/json',
                                    'Accept': 'application/json'
                                },
                                body: JSON.stringify(
                                    {
                                        'productId': product.productId,
                                        'specs': product.specs,
                                        'name': product.name,
                                        'price': product.price,
                                        'description': product.description,
                                        'stock': product.stock,
                                        'numberSold': product.numberSold,
                                        'image': product.image
                                    }
                                )
                            }
                    
                            fetch(HOST.backend_api + '/products/update', putProductMethod)
                                .then(response => {})
                                .then(data => {
                                
                                    const postUsedVoucherMethod = {
                                        method: 'POST',
                                        headers: {
                                            'Content-type': 'application/json',
                                            'Accept': 'application/json'
                                        },
                                        body: JSON.stringify(
                                            {
                                                'voucher': noVoucher,
                                                'customer': cart.customer
                                            }
                                        )
                                    }

                                    fetch(HOST.backend_api + "/used_vouchers", postUsedVoucherMethod)
                                    .then(response => {
                                        window.Email.send({
                                            SecureToken: "b7984caf-9777-4117-a62a-300814cdd60e",
                                            Host : "smtp.elasticemail.com",
                                            Username : "proiectdaw2021@gmail.com",
                                            Password : "83429559C55A73A820EF058BB3F6B3414E8C",
                                            To : email.label,
                                            From : "me.marc.andrei@gmail.com",
                                            Subject : "Thank you for your order!",
                                            Body : "Dear " + username + ",<br> <br>This is an electronic confirmation of us receiving your order. <br><br> <strong>Order summary</strong>: <br> " + 
                                                this.getProducts(cart.products) + "<br>" + "<strong>Delivery address</strong>: <br>" + address.label + "<br> <br>"  + "<strong>PRICE</strong>: $" + cartPrice + "<br> <br>"
                                        }).then(message => {
                                            alert(message);
                                            window.location.href = "/thank_you"
                                        }
                                        )
                                    })
                                })
                                .catch(err => console.log(err));
                        })
                    })
                    .catch(err => console.log(err));
            } else {
                const postMethod = {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            'products': cart.products,
                            'customer': cart.customer,
                            'voucher': voucher,
                            'cart': cart,
                            'finalPrice': cartPrice,
                            'address': address.value,
                            'delivered': false
                        }
                    )
                }

                fetch(HOST.backend_api + '/orders', postMethod)
                    .then(response => {})
                    .then(data => {
                        const putMethod = {
                            method: 'PUT',
                            headers: {
                                'Content-type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify(
                                {
                                    'cartId': cart.cartId,
                                    'customer': cart.customer,
                                    'products': [],
                                    'fullPrice': 0
                                }
                            )
                        }
                
                        fetch(HOST.backend_api + '/carts', putMethod)
                            .then(response => {})
                            .then(data => {
                                
                                cart.products.map((product) => {
                                    product.stock = product.stock - 1;
                                    product.numberSold = product.numberSold + 1;
                                    const putProductMethod = {
                                        method: 'PUT',
                                        headers: {
                                            'Content-type': 'application/json',
                                            'Accept': 'application/json'
                                        },
                                        body: JSON.stringify(
                                            {
                                                'productId': product.productId,
                                                'specs': product.specs,
                                                'name': product.name,
                                                'price': product.price,
                                                'description': product.description,
                                                'stock': product.stock,
                                                'numberSold': product.numberSold,
                                                'image':product.image
                                            }
                                        )
                                    }
                            
                                    fetch(HOST.backend_api + '/products/update', putProductMethod)
                                        .then(response => {})
                                        .then(data => {
                                
                                            const postUsedVoucherMethod = {
                                                method: 'POST',
                                                headers: {
                                                    'Content-type': 'application/json',
                                                    'Accept': 'application/json'
                                                },
                                                body: JSON.stringify(
                                                    {
                                                        'voucher': voucher,
                                                        'customer': cart.customer
                                                    }
                                                )
                                            }
            
                                            fetch(HOST.backend_api + "/used_vouchers", postUsedVoucherMethod)
                                            .then(response => {
                                                window.Email.send({
                                                    SecureToken: "b7984caf-9777-4117-a62a-300814cdd60e",
                                                    Host : "smtp.elasticemail.com",
                                                    Username : "proiectdaw2021@gmail.com",
                                                    Password : "83429559C55A73A820EF058BB3F6B3414E8C",
                                                    To : email.label,
                                                    From : "me.marc.andrei@gmail.com",
                                                    Subject : "Thank you for your order!",
                                                    Body : "Dear " + username + ",<br> <br>This is an electronic confirmation of us receiving your order. <br><br> <strong>Order summary</strong>: <br> " + 
                                                    this.getProducts(cart.products) + "<br> <br>" + "Delivery address: <br>" + address.label + "<br> <br>"  + "PRICE: $" + cartPrice + "<br> <br>"
                                                }).then(message => {
                                                    alert(message);
                                                    window.location.href = "/thank_you"
                                                }
                                                )
                                            })
                                        })
                                        .catch(err => console.log(err));
                                })
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            }
        } else {
            alert("Stock insufficient for one of the products.");
        }
    }

    componentDidMount() {
        this.fetchProducts();
        this.fetchVouchers();
        this.fetchAddresses();
        this.fetchUsedVouchers();
        this.fetchEmails();
    }

    render() {
        const {cart, productList, voucherList, cartPrice, addressList, address, emails, email} = this.state;
        
        console.log(emails);
        var customer;
        var numberOfProducts = [];
        var uniqueProductList = [];
        
        var addressOptions = [];
        if (addressList.length > 0) {
            addressOptions = addressList.map( (addr) => ({
                value: addr,
                label: addr.alias + ": " + addr.streetNr + ", " + addr.town + ", " + addr.county + ", " + addr.country
            }));
        }

        var emailOptions = [];
        if (emails.length > 0) {
            emailOptions = emails.map( (email) => ({
                value: email,
                label: email.email
            }));
        }

        if (productList !== undefined && productList.length > 0) {
            
            for (let i = 0; i < productList.length; ++i) {
                if (numberOfProducts[productList[i].productId] !== undefined && numberOfProducts[productList[i].productId] !== 0) {
                    numberOfProducts[productList[i].productId] = numberOfProducts[productList[i].productId] + 1;
                } else {
                    numberOfProducts[productList[i].productId] = 1;
                }
                
                uniqueProductList[productList[i].productId] = {value : productList[i], number : numberOfProducts[productList[i].productId]};
            }

        }

        if (cart !== undefined) {
            customer = cart.customer;
        }

        var price = 0;
        if (cart !== "undefined") {
            price = cart.fullPrice;
        }

        return (
            <div>   
                {
                    (customer !== undefined) ?  <h1 style={{backgroundColor:'rgb(220,53,69)', color:'white'}}>{customer.user.firstName} {customer.user.lastName}'s order</h1> : <div />
                }
                <div className="text-muted">Disclaimer: only cash on delivery payment method available at the moment.</div>
                <div className="container fluid">
                    <div style={{display:'flex', alignItems:'center'}} className="row">
                        <div className="col">
                        {
                            (uniqueProductList.length > 0 ? 
                            <div style={{marginTop:'20px'}}>{
                                uniqueProductList.map((prod) => { 
                                    return(
                                        
                                        <div className="container fluid">
                                            <div className="row">
                                                <div style={{textAlign:'left'}} className="col">
                                                    <h4 style={{color:'red'}}>{prod.value.name} </h4>
                                                </div>
                                                <div>
                                                    <h5 className="text-muted"> x{prod.number}</h5>
                                                </div>
                                            </div>
                                            <div className="row">
                                                
                                                <div style={{textAlign:'left'}} className="col">
                                                    <h5 className="text-muted">Price</h5>
                                                </div>
                                                <div style={{textAlign:'right'}} className="col">
                                                    {
                                                        (numberOfProducts.length > 0 && prod.value !== undefined ? 
                                                        
                                                            <h5>${prod.value.price * prod.number}</h5>   
                                                            : <h5 />  
                                                        ) 
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )})}</div>
                            : <div className="text-muted">Order is empty</div>)
                    
                        }
                        </div>
                        <div className="col">
                            <img className="order-img" alt="order" style={{marginLeft:'150px', width:'90%'}} src={order}></img>
                        </div>
                    </div>
                </div>
                
                <hr
                style={{
                    color: 'rgb(220,53,69)',
                    backgroundColor: 'rgb(220,53,69)',
                    height: 2,
                    width:'20%'
                }}/>
                {((price !== 0) ? 
                    <div><h4 id="orderPrice" className="text-muted">Final price</h4><h4> ${cartPrice}</h4></div>   : <div />)  
                }    
                {
                (voucherList.length > 0 ? <div style={{marginBottom:'30px'}} className="container fluid">
                    <div className="row">
                        <div style={{textAlign:'right'}} className="col">
                            <input style={{width:'80px'}} id="voucherInput"></input>
                        </div>    
                        <div style={{textAlign:'left'}} className="col">
                            <Button disabled={productList.length === 0} onClick={this.handleAddVoucher} size="sm" variant="danger">Apply voucher</Button>
                        </div> 
                    </div>    
                </div>  : <div className="text-muted">No vouchers at the moment</div>)
                }
                <div style={{marginLeft:'400px', marginRight:'400px', marginBottom:'40px'}}>
                    <h5>Choose your address</h5>
                    <Select options={addressOptions} value={address} onChange={this.handleAddressChange}/>
                </div>

                <div style={{marginLeft:'400px', marginRight:'400px', marginBottom:'40px'}}>
                    <h5>Choose your email address</h5>
                    <Select options={emailOptions} value={email} onChange={this.handleEmailChange}/>
                </div>

                <Button onClick={this.handlePlaceOrder} style={{marginBottom:"30px"}} variant="danger" disabled={JSON.stringify(address) === JSON.stringify({}) || JSON.stringify(email) === JSON.stringify({})}>Place order</Button>
            </div>
        );
    }

}

export default withRouter(OrderPage);