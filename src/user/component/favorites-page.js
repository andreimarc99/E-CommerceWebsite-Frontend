import React from 'react';
import {withRouter} from "react-router-dom";
import * as FAVORITE_PRODUCTS_API from "../../product/api/favorite-products-api"


import {Card, Button} from "react-bootstrap";
import {Link} from "react-router-dom";


class FavoritesPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            username: this.props.location.state.username,
            favorites: {},
            productList: [],
            errorStatus: 0,
            error: ''
        }
        this.fetchProducts = this.fetchProducts.bind(this);

    }

    fetchProducts() {
        const {username} = this.state;
        FAVORITE_PRODUCTS_API.getFavoriteProductsByUsername(username, (result, status, err) => {
                if (result !== null && status === 200) {
                    this.setState(({
                        favorites: result
                    }));
                    this.setState({
                        productList: this.state.favorites.products
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
        const {username} = this.state;
        const {productList} = this.state;
        var imageElems = [];


        if (productList !== "undefined" && productList.length > 0) {
            for (let i = 0; i < productList.length; ++i) {
                var buf1 = productList[i].image.data;
                var imageElem1 = document.createElement('img1');
                imageElem1.src = 'data:image/png;base64,' + buf1.toString('base64');
                imageElems[productList[i].productId] = imageElem1.src;

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
                    {(productList !== "undefined" && productList.length > 0) ? productList.map((prod) => { 
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
                                    <Button className="btn btn-danger">Add to cart</Button>
                                </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card></div></div> );
                    }) : <div className="text-muted">No related products</div> }</div>
                    </div>
                );
            }
        }
        return <div></div>
       
    }


}

export default withRouter(FavoritesPage);