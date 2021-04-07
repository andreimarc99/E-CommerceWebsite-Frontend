import RestApiClient from "../../commons/rest-client"
import {HOST} from "../../commons/hosts"

const endpoint = {
    specs: '/specs'
};

function getSpecs(callback) {
    let request = new Request(HOST.backend_api + endpoint.specs, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getSpecsById(params, callback){
    let request = new Request(HOST.backend_api + endpoint.specs + params.id, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postSpecs(_specs, callback){
    let request = new Request(HOST.backend_api + endpoint.specs , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'weight': _specs.weight,
            'size': _specs.size,
            'categories': _specs.categories
        })
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}


export {
    getSpecs,
    getSpecsById,
    postSpecs
};