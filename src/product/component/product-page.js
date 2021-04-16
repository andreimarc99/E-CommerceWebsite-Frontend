import React from 'react';
import {withRouter} from "react-router-dom";
import * as REVIEW_API from "../api/review-api"
import * as PRODUCT_API from "../api/product-api"
import StarRatings from "react-star-ratings"
import {Card, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import logo from "../../img/logo.png"
import heart from "../../img/heart.png"

class ProductPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            product: this.props.location.state.product,
            reviewList: [],
            isReviewListLoaded: false,
            errorStatus: 0,
            error: "",
            relatedProducts: [],
            isRelatedProductsLoaded: false
        }
    }

    fetchReviews() {
        const {product} = this.state
        return REVIEW_API.getReviewsByProductId(product.productId, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    reviewList: result,
                    isReviewListLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        })
    }

    fetchRelatedProducts() {
        var relatedProducts = [];
        const {product} = this.state;
        
        product.specs.categories.map((category) => {
            PRODUCT_API.getProductsByCategoryId(category.categoryId, (result, status, err) => {
                if (result !== null && status === 200) {
                    relatedProducts.push(...result);
                } else {
                    this.setState(({
                        errorStatus: status,
                        error: err
                    }));
                }
        })})
        var rel = [];
        var related = [];
        setTimeout(function() {
            
            for (let i = 0; i < relatedProducts.length; ++i) {
                if (product.productId !== relatedProducts[i].productId){
                    related.push(relatedProducts[i]);
                }
            }
            if (related !== "undefined" && related.length > 0) {
            for (let i = 0; i < related.length; ++i) {
                if (rel.length > 0) {
                    for (let j = 0; j < rel.length; ++j) {
                        if (related[i].productId === rel[j].productId) {
                            break;
                        } else {
                            if (product.productId !== related[i].productId){
                                rel.push(related[i]);
                            }
                        }
                    }
                } else {
                    if (product.productId !== related[i].productId){
                        rel.push(related[i]);
                    }
                }
            }
        }
        relatedProducts = rel;
        this.setState({relatedProducts});}.bind(this), 1000);

    }

    componentDidMount() {
        this.fetchReviews();
        this.fetchRelatedProducts();
    }

    render() {
        const {product} = this.state;
        const {reviewList} = this.state;
        let rating = 0;
        let reviewNumber = 0;
        const {relatedProducts} = this.state;
        if (reviewList !== "undefined" && reviewList.length > 0) {
            reviewList.map((review) => {
                rating += parseInt(review.rating);
                reviewNumber++;
            });
        }
        rating /= reviewNumber;

        var imageElems = [];
        if (relatedProducts !== "undefined" && relatedProducts.length > 0) {
            for (let i = 0; i < relatedProducts.length; ++i) {
                var buf1 = relatedProducts[i].image.data;
                var imageElem1 = document.createElement('img1');
                imageElem1.src = 'data:image/png;base64,' + buf1.toString('base64');
                //imageElems.push({id: relatedProducts[i].productId, img: imageElem1});
                imageElems[relatedProducts[i].productId] = imageElem1.src;
            }
        }
        var buf = product.image.data;
        var imageElem = document.createElement('img');
        imageElem.src = 'data:image/png;base64,' + buf.toString('base64');
        return (
        <div>
            <h1 >{product.name}</h1>
            {(product.stock > 10 ? (<h5 style={{color: 'green'}}>{product.stock} left</h5>) : (<h5 style={{color: 'red'}}>{product.stock} left</h5>))}
            <hr
            style={{
                color: 'rgb(255, 81, 81)',
                backgroundColor: 'rgb(255, 81, 81)',
                height: 10
            }}/>
            <br />
            <img
                  className="d-block w-100 prod-img shadowed"
                  src={imageElem.src}
                  alt="First slide"
            />
            <br />
            <h3>Price: ${product.price}</h3>

            <div className="container fluid">
            <div className=" d-flex flex-row flex-nowrap overflow-auto justify-content-center">
            <div className="d-flex align-items-stretch ">
            <Button style={{marginRight:'5px', width:'100px', height:'60px'}} className="btn btn-danger"><img className="logo" src={logo} style={{width:'50px', height:'50px'}}></img></Button>
            <Button style={{marginLeft:'5px', width:'100px', height:'60px'}} className="btn btn-danger"><img className="logo" src={heart} style={{width:'20px', height:'20px'}}></img></Button>
            </div>
            </div></div>

            <br /> <br />
           <h6>{product.description}</h6>
              
           {(isNaN(rating)) ? <div className="text-muted">No rating available</div> : <StarRatings rating={rating} starDimension="40px" starSpacing="10px" starRatedColor="red"/>}
           <hr
            style={{
                color: 'rgb(255, 81, 81)',
                backgroundColor: 'rgb(255, 81, 81)',
                height: 10
            }}
            />
           <h5><b>Technical specs</b>
           </h5>
           <p><b>Size:</b> {product.specs.size}</p>
           <p><b>Weight:</b> {product.specs.weight}g</p>
           <hr
            style={{
                color: 'rgb(255, 81, 81)',
                backgroundColor: 'rgb(255, 81, 81)',
                height: 10
            }}/>
            <h5><b>Categories</b></h5>
            <div className="container fluid">
                <div className="row justify-content-center " style={{display:'inline-block', verticalAlign:'middle'}}>
                {product.specs.categories.map((category) => 
                 <div className="col">
                <Link style={{textDecoration:"none", color:"black"}} to={{ pathname: `/category/${category.name}`, state: { categoryName: category.name } }}>

                <h4 style={{borderStyle:"solid", borderColor:'red', borderRadius:'12px', width:'100%'}}> {category.name} </h4> 
                </Link></div>
                )}

            </div>
            
            </div>
            
            <hr
            style={{
                color: 'rgb(255, 81, 81)',
                backgroundColor: 'rgb(255, 81, 81)',
                height: 25
            }}
            />
            <h5><b>Reviews</b></h5>
            {(isNaN(rating)) ? <p  className="text-muted">No reviews found</p> : <p className="font-text-light">Average: {rating}</p>}

            <div> {
            reviewList.map((review) => {return(
                <div>
                    <hr
                    style={{
                        color: 'rgb(255, 81, 81)',
                        backgroundColor: 'rgb(255, 81, 81)',
                        height: 3
                    }}
                    />
                    <p style={{float:'right', marginRight:'20px'}}>
                <StarRatings
                    rating={review.rating}
                    starDimension="25px"
                    starSpacing="5px"
                    starRatedColor="red"
                /></p> 
                <h5 style={{marginLeft:"20px"}} className="text-left"><b>Customer:</b> {review.customer.user.firstName} {review.customer.user.lastName} </h5>
                <p  style={{marginLeft:"20px"}} className="text-left font-weight-light" >@{review.customer.user.username}</p>
                <h4 style={{marginLeft:"20px"}} className="text-left">{review.message}</h4>                
                </div>)
            })

            }</div>

            <hr
            style={{
                color: 'rgb(255, 81, 81)',
                backgroundColor: 'rgb(255, 81, 81)',
                height: 10
            }}
            />
            <h5><b>Related products</b></h5>
            <div className="container fluid">
                <div className=" d-flex flex-row flex-nowrap overflow-auto justify-content-center">
            {(relatedProducts !== "undefined" && imageElems.length > 0) ? relatedProducts.map((prod) => { 
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

export default withRouter(ProductPage);