import React from 'react';
import {withRouter} from "react-router-dom";
import * as PRODUCT_API from "../api/product-api"
import * as CATEGORY_API from "../api/category-api"

import {Card, Button} from "react-bootstrap";
import {Link} from "react-router-dom";

class FavoritesPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            user: this.props.location.state.user
        }
        this.fetchCategoryAndProducts = this.fetchCategoryAndProducts.bind(this);

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
                
                console.log(category);
                PRODUCT_API.getProductsByCategoryId(category.categoryId, (result, status, err) => {
                    if (result !== null && status === 200) {
                        this.setState({
                            productList: result
                        });
                        
                        console.log(result);
                        
                    } else {
                        this.setState(({
                            errorStatus: status,
                            error: err
                        }));
                    }
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
        this.fetchCategoryAndProducts();
    }

    render() {
       
        const {categoryName} = this.state;
        const {productList} = this.state;
        var imageElems = [];
        if (productList !== "undefined" && productList.length > 0) {
            for (let i = 0; i < productList.length; ++i) {
                var buf1 = productList[i].image.data;
                var imageElem1 = document.createElement('img1');
                imageElem1.src = 'data:image/png;base64,' + buf1.toString('base64');
                imageElems[productList[i].productId] = imageElem1.src;
            }
        }

        return (
            <div>   
                <br />
                <h1>{categoryName}</h1>       
                <hr
                style={{
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 10
                }}/>
                <div className="container fluid">
                <div className=" d-flex flex-row flex-nowrap overflow-auto justify-content-center">
            {(productList !== "undefined" && imageElems.length > 0) ? productList.map((prod) => { 
                return(
            <div className="col-lg-4 d-flex align-items-stretch ">
                <Card bg="card border-danger mb-3" text="black" style={{ width: '18rem', margin: '10px'}}>
                    
                <Link style={{textDecoration:"none"}} to={{ pathname: `/product_page/${prod.productId}`, state: { product: prod }}} >
                <Card.Header className="red-card-header">{prod.name}</Card.Header></Link>
                <Card.Body>
                    
                <img
                  className="rel-img"
                  src={imageElems[prod.productId]}
                  alt="First slide"
                 />
                 <hr
                    style={{
                        color: 'rgb(255, 81, 81)',
                        backgroundColor: 'rgb(255, 81, 81)',
                        height: 3
                    }} />
                  <Card.Text>
                    <h4>${prod.price}</h4>
                    
                  </Card.Text>
                  <Button className="btn btn-danger">Add to cart</Button>
                </Card.Body>
              </Card></div> );
            }) : <div className="text-muted">No related products</div> }</div></div>
            </div>
        );
    }


}

export default withRouter(FavoritesPage);