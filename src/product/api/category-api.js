import RestApiClient from "../../commons/rest-client"
import {HOST} from "../../commons/hosts"

const endpoint = {
    categories: '/categories'
};

function getCategories(callback) {
    let request = new Request(HOST.backend_api + endpoint.categories, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getCategoryByName(name, callback){
    let request = new Request(HOST.backend_api + endpoint.categories  + "/" + name, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postCategories(_category, callback){
    let request = new Request(HOST.backend_api + endpoint.categories , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'name': _category.name
        })
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}


export {
    getCategories,
    getCategoryByName,
    postCategories
};