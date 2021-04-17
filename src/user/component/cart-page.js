import React from 'react';
import {withRouter} from "react-router-dom";
import * as CART_API from "../cart-api"


import {Card, Button} from "react-bootstrap";
import {Link} from "react-router-dom";

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

    componentDidMount() {
        this.fetchProducts();
    }

    render() {
        const {cart} = this.state;
        const {productList} = this.state;
        var customer;
        var imageElems = [];
        console.log(cart);

        var numberOfProducts = [];

        if (productList !== "undefined" && productList.length > 0) {
            
            console.log(productList);
            for (let i = 0; i < productList.length; ++i) {
                var buf1 = productList[i].image.data;
                var imageElem1 = document.createElement('img' + i);
                imageElem1.src = 'data:image/png;base64,' + buf1.toString('base64');
                imageElems[productList[i].productId] = imageElem1.src;
                if (numberOfProducts[productList[i].productId] !== undefined && numberOfProducts[productList[i].productId] !== 1) {
                    numberOfProducts[productList[i].productId] = numberOfProducts[productList[i].productId] + 1;
                } else {
                    numberOfProducts[productList[i].productId] = 1;
                }
            }
        }

        if (cart !== undefined) {
            customer = cart.customer;
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
                    (productList.length > 0 ? 
                        productList.map((prod) => { 
                            return(
                                <div style={{ marginLeft:'5px', marginRight:'5px'}}> 
                                    
                                <h4>{prod.name}</h4>
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
                                                            src={imageElems[prod.productId]}
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
                                                    (numberOfProducts.length > 0 && prod !== undefined ? 
                                                    
                                                        <h5>${prod.price * numberOfProducts[prod.productId]}</h5>   
                                                        : <div />  
                                                    ) 
                                                }
                                            </div>
                                        </div>
                                        <div className="row justify-content-center">
                                                        <div className="col">
                                                            
                                                            <div className="container">
                                                                <div className="row justify-content-center">
                                                                    <img src={minus} style={{width:'30px', height:'30px'}}></img>
                                                                    <h5 style={{marginLeft:'15px', marginRight:'15px'}}>x{numberOfProducts[prod.productId]}</h5>
                                                                    <img src={plus} style={{width:'30px', height:'30px'}}></img>
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
            </div>
        );
    }

}

export default withRouter(CartPage);