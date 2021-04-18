import RestApiClient from "../commons/rest-client"
import {HOST} from "../commons/hosts"

const endpoint = {
    cart: '/carts'
};

function getCarts(callback) {
    let request = new Request(HOST.backend_api + endpoint.cart, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getCartByUsername(username, callback){
    let request = new Request(HOST.backend_api + endpoint.cart + "/" + username, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postCart(c, callback){
    if (c.products.length === 0) {
        let request = new Request(HOST.backend_api + endpoint.cart , {
            method: 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'products': [],
                'customer': c.customer,
                'fullPrice': 0
            })
        });
        console.log(request.body);
        console.log("URL: " + request.url);

        RestApiClient.performRequest(request, callback);
    } else {
        
        let request = new Request(HOST.backend_api + endpoint.cart , {
            method: 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'products': c.products,
                'customer': c.customer,
                'fullPrice': c.price
            })
        });
        console.log(request.body);

        console.log("URL: " + request.url);

        RestApiClient.performRequest(request, callback);
    }
}


export {
    getCarts,
    getCartByUsername,
    postCart
};