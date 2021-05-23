import React from 'react';
import {withRouter} from "react-router-dom";
import * as FAVORITE_PRODUCTS_API from "../../product/api/favorite-products-api"
import {HOST} from "../../commons/hosts"
import * as CUSTOMER_API from "../customer-api"


import {Card, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import heart from "../../img/heart.png"
import ReactSpinner from 'react-bootstrap-spinner'


class FavoritesPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            username: this.props.location.state.username,
            favorites: {},
            productList: [],
            errorStatus: 0,
            error: '',
            done: false
        }
        this.fetchProducts = this.fetchProducts.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
    }

    handleRemoveFromFavorites(productId) {
        let prods = {};
        let customer = {};
        FAVORITE_PRODUCTS_API.getFavoriteProductsByUsername(JSON.parse(localStorage.getItem("loggedUser")).username, (result, status, err) => {
            if (result !== null && status === 200) {
                prods = result;
                
                prods.products = prods.products.filter(function(item) {
                    return item.productId !== productId
                })

                
                CUSTOMER_API.getCustomerByUsername(JSON.parse(localStorage.getItem("loggedUser")).username, (res, st, err) => {
                    if (res !== null && st === 200) {
                        customer = res;
                        const putMethod = {
                            method: 'PUT',
                            headers: {
                                'Content-type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify(
                                {
                                    'favoriteProductsId': prods.favoriteProductsId,
                                    'customer': customer,
                                    'products': prods.products
                                }
                            )
                        }
                
                        fetch(HOST.backend_api + '/favorite_products', putMethod)
                            .then(response => response.json())
                            .then(data => window.location.reload())
                            .catch(err => console.log(err));
                    }
                })

                
            }
        })
    }

    fetchProducts() {
        const {username} = this.state;
        FAVORITE_PRODUCTS_API.getFavoriteProductsByUsername(username, (result, status, err) => {
                if (result !== null && status === 200) {
                    this.setState(({
                        favorites: result,
                        done: true
                    }));
                    this.setState({
                        productList: this.state.favorites.products,
                        done: true
                    })
                } else {
                    this.setState(({
                        errorStatus: status,
                        error: err,
                        done: true
                    }));
                }
            })
    }

    handleAddToCart(product) {
        console.log(product);
        if (product.stock > 0) {
            fetch(HOST.backend_api + "/carts/" + JSON.parse(localStorage.getItem("loggedUser")).username)
            .then(response => response.json())
            .then(data => {
                data.products.push(product);

                var price = 0;
                data.products.map((p) => {
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
                            'cartId': data.cartId,
                            'customer': data.customer,
                            'products': data.products,
                            'fullPrice': price
                        }
                    )
                }

                fetch(HOST.backend_api + '/carts', putMethod)
                    .then(response => {alert(product.name + " added to cart.")})
                    .catch(err => console.log(err));
            })
            .catch(error => console.log(error));
        } else {
            alert("Stock insufficient for " + product.name);
        }
    }

    componentDidMount() {
        this.fetchProducts();
    }

    render() {
        const {productList, done} = this.state;
        var imageElems = [];


        if (productList !== "undefined" && productList.length > 0) {
            for (let i = 0; i < productList.length; ++i) {
                var buf1 = productList[i].image.data;
                var imageElem1 = document.createElement('img' + i);
                imageElem1.src = 'data:image/png;base64,' + buf1.toString('base64');
                imageElems[productList[i].productId] = imageElem1.src;
            }
        }
        return (
            <div>   
                <br />
                <h1>Favorite products</h1>
                <hr
                style={{
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 5
                }}/>
                <div className="container fluid">
            {
            (done === true ? 
                ((productList !== "undefined" && productList.length > 0) ? productList.map((prod) => { 
                    return(
                        <div className="row">
                    <div className="col">
    
                    <Card bg="card border-danger" text="black" style={{margin: '10px'}}>
                        
                    <Link style={{textDecoration:"none"}} to={{ pathname: `/product_page/${prod.productId}`, state: { product: prod }}} >
                    <Card.Header className="red-card-header"><h4>{prod.name}</h4></Card.Header></Link>
                    <Card.Body>
                        <div className="container fluid">
                        <div className="row">
                            <div className="col">
    
                                <img
                                style={{width:'60%'}}
                                src={imageElems[prod.productId]}
                                alt="First slide"
                                />
                            </div>
                                <hr
                                    style={{
                                        color: 'rgb(255, 81, 81)',
                                        backgroundColor: 'rgb(255, 81, 81)',
                                        height: 3
                                    }} />
                            <div className="col">
                                <Card.Text>
                                    <p className="text-muted">{prod.description}</p>
                                    <hr
                                    style={{
                                        color: 'rgb(255, 81, 81)',
                                        backgroundColor: 'rgb(255, 81, 81)',
                                        height: 3
                                    }}/>
                                    <h4>${prod.price}</h4>
                                    
                                </Card.Text>
                                <Button onClick={() => this.handleAddToCart(prod)} variant="outline-danger">Add to cart</Button>
                                <Button onClick={() => this.handleRemoveFromFavorites(prod.productId)} style={{marginLeft:'5px', width:'100px', height:'38px'}} className="btn btn-light"><img alt="unfav" src={heart} style={{width:'20px', height:'20px'}}></img></Button>
                            </div>
                        </div>
                        </div>
                    </Card.Body>
                    </Card></div></div> );
                }) : <div className="text-muted">No favorite products found.</div> )
                : <div style={{marginTop:'30px', marginBottom:'30px'}}> <ReactSpinner  type="border" color="danger" size="2" /></div>)
            }</div>
            </div>
        );
    }

}

export default withRouter(FavoritesPage);