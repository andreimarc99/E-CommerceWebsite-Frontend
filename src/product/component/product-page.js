import React from 'react';
import {withRouter} from "react-router-dom";
import * as REVIEW_API from "../api/review-api"
import StarRatings from "react-star-ratings"

class ProductPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            product: this.props.location.state.product,
            reviewList: [],
            isReviewListLoaded: false,
            errorStatus: 0,
            error: ""
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

    componentDidMount() {
        this.fetchReviews();
    }

    render() {
        const {product} = this.state;
        const {reviewList} = this.state;
        let rating = 0;
        let reviewNumber = 0;

        if (reviewList !== "undefined" && reviewList.length > 0) {
        console.log(reviewList);
            reviewList.map((review) => {
                rating += parseInt(review.rating);
                reviewNumber++;
            });
        }
        rating /= reviewNumber;

        var buf = product.image.data;
        var imageElem = document.createElement('img');
        imageElem.src = 'data:image/png;base64,' + buf.toString('base64');
        return (
        <div>
            <hr
            style={{
                color: 'rgb(255, 81, 81)',
                backgroundColor: 'rgb(255, 81, 81)',
                height: 10
            }}
            />
            <h1 >{product.name}</h1>
            {(product.stock > 10 ? (<h5 style={{color: 'green'}}>{product.stock} left</h5>) : (<h5 style={{color: 'red'}}>{product.stock} left</h5>))}
            <hr
            style={{
                color: 'rgb(255, 81, 81)',
                backgroundColor: 'rgb(255, 81, 81)',
                height: 10
            }}/>
            <img
                  className="d-block w-100 prod-img shadowed"
                  src={imageElem.src}
                  alt="First slide"
            />
            <h3>Price: ${product.price}</h3>
           <h6>{product.description}</h6>
              
           {(isNaN(rating)) ? <div>No rating available</div> : <StarRatings rating={rating} starDimension="40px" starSpacing="10px" starRatedColor="red"/>}
           <hr
            style={{
                color: 'rgb(255, 81, 81)',
                backgroundColor: 'rgb(255, 81, 81)',
                height: 10
            }}
            />
           <h5 className="text-left" style={{marginLeft:"20px"}}><b>Technical specs</b>
           </h5>
           <p className="text-left" style={{marginLeft:"30px"}}><b>Size:</b> {product.specs.size}</p>
           <p className="text-left" style={{marginLeft:"30px"}}><b>Weight:</b> {product.specs.weight}g</p>

           <hr
            style={{
                color: 'rgb(255, 81, 81)',
                backgroundColor: 'rgb(255, 81, 81)',
                height: 10
            }}
            />
            <h5 className="text-left" style={{marginLeft:"20px"}}><b>Categories</b></h5>
            {product.specs.categories.map((category) => <p style={{marginLeft:"20px", borderStyle:"solid", borderRadius:'12px', width:'10%'}}> {category.name} </p> )}
            
            <hr
            style={{
                color: 'rgb(255, 81, 81)',
                backgroundColor: 'rgb(255, 81, 81)',
                height: 25
            }}
            />
            <h5><b>Reviews</b></h5>
            {(isNaN(rating)) ? <p  className="font-text-light">No reviews found</p> : <p className="font-text-light">Average: {rating}</p>}

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
        </div>
        );
    }


}

export default withRouter(ProductPage);