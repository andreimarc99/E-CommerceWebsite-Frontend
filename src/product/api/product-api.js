import RestApiClient from "../../commons/rest-client"
import {HOST} from "../../commons/hosts"

const endpoint = {
    product: '/products'
};

function getProducts(callback) {
    let request = new Request(HOST.backend_api + endpoint.product, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getProductsWithImages(callback) {
    let request = new Request(HOST.backend_api + endpoint.product + "/get", {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getProductById(params, callback){
    let request = new Request(HOST.backend_api + endpoint.product + params.id, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postProduct(_product, callback){
    let request = new Request(HOST.backend_api + endpoint.product , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'specs': _product.specs,
            'name': _product.name,
            'price': _product.price,
            'description': _product.description,
            'stock': _product.stock,
            'numberSold': _product.numberSold
        })
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}

export {
    getProducts,
    getProductById,
    postProduct,
    getProductsWithImages
};