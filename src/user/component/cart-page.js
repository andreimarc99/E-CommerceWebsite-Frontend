import React from 'react';
import {withRouter, Link} from "react-router-dom";
import * as CART_API from "../cart-api"


import {Button} from "react-bootstrap";
import {HOST} from "../../commons/hosts"

import plus from "../../img/plus.png"
import minus from "../../img/minus.png"


class CartPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            username: this.props.location.state.username,
            cart: {},
            productList: [],
            errorStatus: 0,
            error: ''
        }
        this.fetchProducts = this.fetchProducts.bind(this);

    }

    fetchProducts() {
        const {username} = this.state;
        CART_API.getCartByUsername(username, (result, status, err) => {
            if (result !== null && (status === 200 || status === 201)) {
                this.setState({
                    cart: result
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

    handlePlus(product) {
        const {cart} = this.state;
        cart.products.push(product);

        var price = 0;
        cart.products.map((p) => {
            price += p.price
        })
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
                    'products': cart.products,
                    'fullPrice': price
                }
            )
        }

        fetch(HOST.backend_api + '/carts', putMethod)
            .then(response => {response.json(); window.location.reload()})
            .catch(err => console.log(err));
    }

    handleMinus(product) {
        const {cart} = this.state;
        console.log(cart.products);
        for (let i = 0; i < cart.products.length; ++i) {
            if (cart.products[i].productId === product.productId) {
                cart.products.splice(i, 1);
                break;
            }
        }
        console.log(cart.products);

        var price = 0;
        cart.products.map((p) => {
            price += p.price
        })

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
                    'products': cart.products,
                    'fullPrice': price
                }
            )
        }

        fetch(HOST.backend_api + '/carts', putMethod)
            .then(response => {response.json(); window.location.reload()})
            .catch(err => console.log(err));

    }

    componentDidMount() {
        this.fetchProducts();
    }

    render() {
        const {cart} = this.state;
        const {productList} = this.state;
        var customer;
        var imageElems = [];
        var numberOfProducts = [];
        var uniqueProductList = []

        if (productList !== "undefined" && productList.length > 0) {
            
            for (let i = 0; i < productList.length; ++i) {
                var buf1 = productList[i].image.data;
                var imageElem1 = document.createElement('img' + i);
                imageElem1.src = 'data:image/png;base64,' + buf1.toString('base64');
                imageElems[productList[i].productId] = imageElem1.src;
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
                <br />
                {
                    (customer !== undefined) ? <h2>{customer.user.firstName} {customer.user.lastName}'s cart</h2> : <div />
                }
                 <hr
                style={{
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 10
                }}/>
                
                {
                    (uniqueProductList.length > 0 ? 
                        uniqueProductList.map((prod) => { 
                            return(
                                <div style={{ marginLeft:'5px', marginRight:'5px', marginTop:'20px'}}> 
                                    
                                <h4>{prod.value.name}</h4>
                                <hr
                                style={{
                                    color: 'rgb(255, 81, 81)',
                                    backgroundColor: 'rgb(255, 81, 81)',
                                    height: 3,
                                    width:'50%'
                                }}
                                />
                                <div >

                                    <div className="container fluid">
                                        <div className="row">
                                            <div className="col">
                                                <div className="container fluid">
                                                    <div className="row">
                                                        <div className="col">
                                                            <img
                                                            style={{width:'40%'}}
                                                            src={imageElems[prod.value.productId]}
                                                            alt="First slide"
                                                            />
                                                        </div>
                                                    </div>
                                                    <br />
                                                    
                                                </div>
                                            </div>
                                            
                                            <div className="col">
                                                <h5 className="text-muted">Price</h5>
                                                <hr
                                                style={{
                                                    color: 'rgb(255, 81, 81)',
                                                    backgroundColor: 'rgb(255, 81, 81)',
                                                    height: 1,
                                                    width:'15%'
                                                }}
                                                />
                                                {
                                                    (numberOfProducts.length > 0 && prod.value !== undefined ? 
                                                    
                                                        <h5>${prod.value.price * prod.number}</h5>   
                                                        : <div />  
                                                    ) 
                                                }
                                            </div>
                                        </div>
                                        <div className="row justify-content-center">
                                                        <div className="col">
                                                            
                                                            <div className="container">
                                                                <div className="row justify-content-center">
                                                                    <Button size="sm" variant="danger" onClick={() => this.handleMinus(prod.value)}><img alt="minus" src={minus} className="logo" style={{width:'20px', height:'20px'}}></img></Button>
                                                                    <h4 style={{marginLeft:'15px', marginRight:'15px'}}>x{prod.number}</h4>
                                                                    <Button size="sm" variant="danger" onClick={() => this.handlePlus(prod.value)}><img alt="plus" src={plus} className="logo" style={{width:'20px', height:'20px'}}></img></Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                    </div>
                                </div></div>



                            )})
                                : <p className="text-muted">Cart is empty</p>)
                    
                }
                <br />
                <hr
                style={{
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 2,
                    width:'20%'
                }}/>
                {((price !== 0) ? 
                    <div><h4 className="text-muted">Final price</h4><h4> ${price}</h4></div>   : <div />)  
                }        
                <Link style={{textDecoration:"none", color:"white"}} to={{ pathname: `/order/${JSON.parse(localStorage.getItem("loggedUser")).username}/${Date.now()}`, state: { cart: cart } }}>
                    <Button disabled={productList.length === 0} style={{marginBottom:'20px'}} size="lg" variant="danger">Proceed to checkout</Button>  
                </Link>
            </div>
        );
    }

}

export default withRouter(CartPage);