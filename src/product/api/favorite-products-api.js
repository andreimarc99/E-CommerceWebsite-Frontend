import RestApiClient from "../../commons/rest-client"
import {HOST} from "../../commons/hosts"

const endpoint = {
    fav_prod: '/favorite_products'
};

function getFavoriteProducts(callback) {
    let request = new Request(HOST.backend_api + endpoint.fav_prod, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getFavoriteProductsByUsername(username, callback){
    let request = new Request(HOST.backend_api + endpoint.fav_prod  + "/" + username, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postFavoriteProducts(p, callback){
    let request = new Request(HOST.backend_api + endpoint.fav_prod , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'customer': p.customer,
            'product': p.product
        })
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}


export {
    getFavoriteProducts,
    getFavoriteProductsByUsername,
    postFavoriteProducts
};