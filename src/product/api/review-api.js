import RestApiClient from "../../commons/rest-client"
import {HOST} from "../../commons/hosts"

const endpoint = {
    review: '/reviews'
};

function getReviews(callback) {
    let request = new Request(HOST.backend_api + endpoint.review, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getReviewsByProductId(productId, callback) {
    let request = new Request(HOST.backend_api + endpoint.review + "/" + productId, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postReview(_review, callback){
    let request = new Request(HOST.backend_api + endpoint.review , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'product': _review.product,
            'customer': _review.customer,
            'rating': _review.rating,
            "message": _review.message
        })
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}


export {
    getReviews,
    getReviewsByProductId,
    postReview
};