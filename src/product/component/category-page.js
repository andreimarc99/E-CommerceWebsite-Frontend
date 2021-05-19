import React from 'react';
import {withRouter} from "react-router-dom";
import * as PRODUCT_API from "../api/product-api"
import * as CATEGORY_API from "../api/category-api"
import {HOST} from "../../commons/hosts"
import * as CUSTOMER_API from "../../user/customer-api"
import * as FAV_PRODUCTS_API from "../api/favorite-products-api"
import heart from "../../img/heart.png"


import {Card, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import ReactSpinner from 'react-bootstrap-spinner'


class CategoryPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            categoryName: this.props.location.state.categoryName,
            category: {},
            productList: [],
            errorStatus: 0,
            error: '',
            favoriteList: [],
            favDone: false,
            prodDone: false
        }
        this.fetchCategoryAndProducts = this.fetchCategoryAndProducts.bind(this);

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

    fetchFavorites() {
        const username = JSON.parse(localStorage.getItem("loggedUser")).username;
        if (JSON.parse(localStorage.getItem("loggedUser")).role === "CUSTOMER")
            FAV_PRODUCTS_API.getFavoriteProductsByUsername(username, (result, status, err) => {
                    if (result !== null && status === 200) {
                        this.setState({
                            favoriteList: result.products,
                            favDone: true
                        })
                    } else {
                        this.setState(({
                            errorStatus: status,
                            error: err,
                            favDone: true
                        }));
                    }
                })
    }

    handleAddToFavorites(product) {
        
        let prods = {};
        let customer = {};
        FAV_PRODUCTS_API.getFavoriteProductsByUsername(JSON.parse(localStorage.getItem("loggedUser")).username, (result, status, err) => {
            if (result !== null && status === 200) {
                prods = result;
                prods.products.push(product);
                
                CUSTOMER_API.getCustomerByUsername(JSON.parse(localStorage.getItem("loggedUser")).username, (res, st, err) => {
                    if (res !== null && st === 200) {
                        customer = res;
                        console.log(customer);
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

    handleRemoveFromFavorites(productId) {
        let prods = {};
        let customer = {};
        FAV_PRODUCTS_API.getFavoriteProductsByUsername(JSON.parse(localStorage.getItem("loggedUser")).username, (result, status, err) => {
            if (result !== null && status === 200) {
                prods = result;
                
                prods.products = prods.products.filter(function(item) {
                    return item.productId !== productId
                })

                console.log(prods);
                
                CUSTOMER_API.getCustomerByUsername(JSON.parse(localStorage.getItem("loggedUser")).username, (res, st, err) => {
                    if (res !== null && st === 200) {
                        customer = res;
                        console.log(customer);
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
                        console.log(putMethod.body);
                
                        fetch(HOST.backend_api + '/favorite_products', putMethod)
                            .then(response => response.json())
                            .then(data => window.location.reload())
                            .catch(err => console.log(err));
                    }
                })

                
            }
        })
    }

    fetchCategoryAndProducts() {
        const {categoryName} = this.state
        let category = {};
        CATEGORY_API.getCategoryByName(categoryName, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    category: result
                });
                category = result;
                
                PRODUCT_API.getProductsByCategoryId(category.categoryId, (result, status, err) => {
                    if (result !== null && status === 200) {
                        this.setState({
                            productList: result,
                            prodDone: true
                        });

                        
                    } else {
                        this.setState(({
                            errorStatus: status,
                            error: err,
                            prodDone: true
                        }));
                    }
                })
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err,
                    prodDone: true
                }));
            }
        })

    }

    componentDidMount() {
        this.fetchCategoryAndProducts();
        this.fetchFavorites();
    }

    render() {
       
        const {categoryName} = this.state;
        const {productList} = this.state;
        const {favoriteList, prodDone, favDone} = this.state;
        var imageElems = [];
        var isFavorite = [];
        var done = false;
        if (prodDone === true) {
            done = true;
        }
        console.log(productList);
        console.log(favoriteList);

        if (productList !== "undefined" && productList.length > 0) {
            for (let i = 0; i < productList.length; ++i) {
                var buf1 = productList[i].image.data;
                var imageElem1 = document.createElement('img1');
                imageElem1.src = 'data:image/png;base64,' + buf1.toString('base64');
                imageElems[productList[i].productId] = imageElem1.src;
            }
            
            if (favoriteList !== "undefined" && favoriteList.length > 0) {
                for (let i = 0; i < productList.length; ++i) {
                    for (let j = 0; j < favoriteList.length; ++j) {
                        if (productList[i].productId === favoriteList[j].productId) {
                            isFavorite[productList[i].productId] = 1;
                        }
                    }
                    if (isFavorite[productList[i].productId] !== undefined && isFavorite[productList[i].productId] !== 1) {
                        isFavorite[productList[i].productId] = 0;
                    }
                }
            }
        }

        return (
            <div>   

                {(done === true ? (productList.length > 0 ? 
                    <div style={{marginTop:'20px'}} className="container fluid">
                        
                    <h1>{categoryName}</h1>       
                    <hr
                    style={{
                        color: 'rgb(255, 81, 81)',
                        backgroundColor: 'rgb(255, 81, 81)',
                        height: 10
                    }}/>
                        {
                        productList.map((prod) => { 
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
                                        {(JSON.parse(localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "" && localStorage.getItem("loggedUser") !== undefined && localStorage.getItem("loggedUser")).role === "CUSTOMER" ? 
                                        <Button onClick={() => this.handleAddToCart(prod)} className="btn btn-danger">Add to cart</Button> : <div />)}
                                        {((localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "" && localStorage.getItem("loggedUser") !== undefined
                                        && JSON.parse(localStorage.getItem("loggedUser")).role === "CUSTOMER") ?
                                        ( (isFavorite[prod.productId] === 1) ?
                                        <Button onClick={() => this.handleRemoveFromFavorites(prod.productId)} style={{marginLeft:'5px', width:'100px', height:'38px'}} className="btn btn-light"><img alt="fav" src={heart} style={{width:'20px', height:'20px'}}></img></Button>
                                        :
                                        <Button onClick={() => this.handleAddToFavorites(prod)} style={{marginLeft:'5px', width:'100px', height:'38px'}} className="btn btn-danger"><img className="logo" alt="unfav" src={heart} style={{width:'20px', height:'20px'}}></img></Button>
                                        )
                                        : <div />)}
                                    </div>
                                </div>
                            </div>
                            </Card.Body>
                        </Card></div></div> );
                        })}
                    </div>
                    : <h2>No products for "{categoryName}" category.</h2>) 
                    : <div style={{marginTop:'30px', marginBottom:'30px'}}> <ReactSpinner  type="border" color="danger" size="2" /></div>)}

        </div>);
    }


}

export default withRouter(CategoryPage);