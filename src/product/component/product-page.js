import React from 'react';
import {withRouter} from "react-router-dom";
import * as REVIEW_API from "../api/review-api"
import * as PRODUCT_API from "../api/product-api"
import * as FAV_PRODUCTS_API from "../api/favorite-products-api"
import * as CUSTOMER_API from "../../user/customer-api"
import StarRatings from "react-star-ratings"
import {Card, Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import logo from "../../img/logo.png"
import heart from "../../img/heart.png"
import {HOST} from "../../commons/hosts"
import ReviewUpdateForm from '../../review/review-update-form'
import ReviewCreationForm from '../../review/review-creation-form'
import {
    Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap';

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
            isRelatedProductsLoaded: false,
            isFavorite: false,
            selected_update_review: false,
            selected_create_review: false
        }
        this.handleAddToFavorites = this.handleAddToFavorites.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);

        this.handleRemoveFromFavorites = this.handleRemoveFromFavorites.bind(this);
        this.isAFavorite = this.isAFavorite.bind(this);

        this.toggleUpdateReview = this.toggleUpdateReview.bind(this);
        this.reloadReviews = this.reloadReviews.bind(this);
        this.toggleCreateReview = this.toggleCreateReview.bind(this);
        this.reloadReviewsAfterCreation = this.reloadReviewsAfterCreation.bind(this);
    }

    isAFavorite() {
        let prods = {};
        if (JSON.parse(localStorage.getItem("loggedUser")).role === "CUSTOMER") {
            FAV_PRODUCTS_API.getFavoriteProductsByUsername(JSON.parse(localStorage.getItem("loggedUser")).username, (result, status, err) => {
                if (result !== null && status === 200) {
                    prods = result;
                    const {product} = this.state;
                    for (let i = 0; i < prods.products.length; ++i) {
                        if (product.productId === prods.products[i].productId) {
                            this.setState({isFavorite: true});
                        }
                    }
                }
            })
        }
    }

    handleAddToFavorites() {
        
        let prods = {};
        let customer = {};
        FAV_PRODUCTS_API.getFavoriteProductsByUsername(JSON.parse(localStorage.getItem("loggedUser")).username, (result, status, err) => {
            if (result !== null && status === 200) {
                prods = result;
                const {product} = this.state;
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
                        
                        this.setState({isAFavorite: true});
                
                        fetch(HOST.backend_api + '/favorite_products', putMethod)
                            .then(response => {window.location.reload()})
                            .then(data => data ? JSON.parse(JSON.stringify(data)) : {})
                            .catch(err => console.log(err));
                    }
                })

                
            }
        })
    }

    handleRemoveFromFavorites() {
        let prods = {};
        let customer = {};
        FAV_PRODUCTS_API.getFavoriteProductsByUsername(JSON.parse(localStorage.getItem("loggedUser")).username, (result, status, err) => {
            if (result !== null && status === 200) {
                prods = result;
                const {product} = this.state;
                
                prods.products = prods.products.filter(function(item) {
                    return item.productId !== product.productId
                })

                console.log(prods);
                
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
                        this.setState({isAFavorite: true});

                        fetch(HOST.backend_api + '/favorite_products', putMethod)
                            .then(response => {window.location.reload()})
                            .then(data => data ? JSON.parse(JSON.stringify(data)) : {})
                            .catch(err => console.log(err));
                    }
                })

                
            }
        })

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
        const {product} = this.state;

        product.specs.categories.map((category) => {
            PRODUCT_API.getProductsByCategoryId(category.categoryId, (result, status, err) => {
                if (result !== null && status === 200) {
                    
                    this.setState({relatedProducts : result});
                } else {
                    this.setState(({
                        errorStatus: status,
                        error: err
                    }));
                }
        })})

    }

    handleAddToCart() {
        const {product} = this.state;

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
            alert("Stock insufficient");
        }
    }

    componentDidMount() {
        this.fetchReviews();
        this.fetchRelatedProducts();
        this.isAFavorite();
    }

    handleDeleteReview(reviewId) { 
        fetch(HOST.backend_api + '/reviews/' + reviewId, {
        method: 'DELETE',
        })
        .then(res => res.text()) 
        .then(res => window.location.reload());
    }

    toggleUpdateReview() {
        this.setState({selected_update_review: !this.state.selected_update_review});
    }

    toggleCreateReview() {
        this.setState({selected_create_review: !this.state.selected_create_review});
    }
    
    reloadReviewsAfterCreation() {
        this.setState({
            isReviewListLoaded: false
        });
        this.toggleCreateReview();
        this.fetchReviews();
    }

    reloadReviews() {
        this.setState({
            isReviewListLoaded: false
        });
        this.toggleUpdateReview();
        this.fetchReviews();
    }

    render() {
        const {product} = this.state;
        const {reviewList} = this.state;
        const {isFavorite} = this.state;
        var reviewedAlready = false;
        let rating = 0;
        let reviewNumber = 0;
        var {relatedProducts} = this.state;
        if (reviewList !== "undefined" && reviewList.length > 0) {
            reviewList.map((review) => {
                rating += parseInt(review.rating);
                reviewNumber++;
                if (review.customer.user.username === JSON.parse(localStorage.getItem("loggedUser")).username) {
                    reviewedAlready = true;
                }
            });
        }
        rating /= reviewNumber;
        var imageElems = [];
        if (relatedProducts !== "undefined" && relatedProducts.length > 0) {
            relatedProducts = relatedProducts.filter(function(item) {
                return item.productId !== product.productId
              });
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
            <br />
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
            {(localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "" && localStorage.getItem("loggedUser") !== undefined && JSON.parse(localStorage.getItem("loggedUser")).role === "CUSTOMER" ? 
                <Button onClick={this.handleAddToCart} style={{marginRight:'5px', width:'100px', height:'60px'}} className="btn btn-danger"><img className="logo" alt="logo" src={logo} style={{width:'50px', height:'50px'}}></img></Button>
                :<div/>)}
            {((localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "" && localStorage.getItem("loggedUser") !== undefined
            && JSON.parse(localStorage.getItem("loggedUser")).role === "CUSTOMER") ?
            ( (isFavorite === true) ?
            <Button onClick={this.handleRemoveFromFavorites} style={{marginLeft:'5px', width:'100px', height:'60px'}} className="btn btn-light"><img alt="fav" src={heart} style={{width:'20px', height:'20px'}}></img></Button>
            :
            <Button onClick={this.handleAddToFavorites} style={{marginLeft:'5px', width:'100px', height:'60px'}} className="btn btn-danger"><img alt="unfav" className="logo" src={heart} style={{width:'20px', height:'20px'}}></img></Button>
            )
            : <div />)}
            </div>
            </div></div>

            <br /> <br />
           <h6 style={{marginLeft:'100px', marginRight:'100px'}}>{product.description}</h6>
              
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
           <div className="container fluid">
               <div>
                    <p><b>Size:</b> {product.specs.size}</p>
                    <p><b>Weight:</b> {product.specs.weight}g</p>
                </div>
           </div>
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
                <div className="col" style={{borderStyle:"solid", borderColor:'rgb(255,81,81)', borderRadius:'20px', backgroundColor:'rgb(255,81,81)', marginTop:'6px'}}>
                <Link style={{textDecoration:"none", color:"white"}} to={{ pathname: `/category/${category.name}`, state: { categoryName: category.name } }}>

                <h4 style={{ width:'100%'}}> {category.name} </h4> 
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
            {(isNaN(rating)) ? <p  className="text-muted">No reviews found</p> : <p className="text-muted">Average: {rating}</p>}
            {(!reviewedAlready && JSON.parse(localStorage.getItem("loggedUser")).role === "CUSTOMER" ? <Button onClick={this.toggleCreateReview} variant = "danger">Add review</Button> : <div /> )}
            <Modal isOpen={this.state.selected_create_review} toggle={this.toggleCreateReview}
                 className={this.props.className} size="lg">
                <ModalHeader toggle={this.toggleCreateReview}><p style={{color:"red"}}> Post a review </p></ModalHeader>
                <ModalBody>
                    <ReviewCreationForm product={product} reloadHandler={this.reloadReviewsAfterCreation}/>
                </ModalBody>
            </Modal>
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
                />
                </p> 
                <h5 style={{marginLeft:"20px"}} className="text-left"><b> {review.customer.user.firstName} {review.customer.user.lastName}</b> </h5>
                <p  style={{marginLeft:"20px"}} className="text-left text-muted" >@{review.customer.user.username}</p>
                <h4 style={{marginLeft:"20px"}} className="text-left">{review.message}</h4>    
                <div style={{textAlign:'right', marginRight:'20px'}}>
                    {(review.customer.user.username === JSON.parse(localStorage.getItem("loggedUser")).username ? 
                    <div>
                        <Button onClick={this.toggleUpdateReview} variant="outline-danger">Edit</Button>
                        <Button style={{marginLeft:'10px'}} variant="danger" onClick={() => this.handleDeleteReview(review.reviewId)}>Delete</Button>
                    </div> 
                    : <div />)}
                </div>
                
                <Modal isOpen={this.state.selected_update_review} toggle={this.toggleUpdateReview}
                 className={this.props.className} size="lg">
                    <ModalHeader toggle={this.toggleUpdateReview}><p style={{color:"red"}}> Update review </p></ModalHeader>
                    <ModalBody>
                        <ReviewUpdateForm review={review} reloadHandler={this.reloadReviews}/>
                    </ModalBody>
                </Modal>

                
                </div>
                )
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
            {(relatedProducts.length > 0) ? 
            
            <div className="container fluid">
                <div className=" d-flex flex-row flex-nowrap overflow-auto justify-content-left">
                    {relatedProducts.map((prod) => { 

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
                            <hr
                            style={{
                                color: 'rgb(255, 81, 81)',
                                backgroundColor: 'rgb(255, 81, 81)',
                                height: 1
                            }} />
                            <textarea readOnly='true' style={{width:'101%', border:'none'}} value={prod.description} className="txtarea text-muted"></textarea>
                        </Card.Text>
                        </Card.Body>
                    </Card></div> );
            }) }</div></div>: <div style={{textAlign:'center'}} className="text-muted">No related products</div> }

           

        </div>
        );
    }


}

export default withRouter(ProductPage);