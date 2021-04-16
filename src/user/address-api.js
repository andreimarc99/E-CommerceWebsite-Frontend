import RestApiClient from "../commons/rest-client"
import {HOST} from "../commons/hosts"

const endpoint = {
    address: '/addresses'
};

function getAddresses(callback) {
    let request = new Request(HOST.backend_api + endpoint.address, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getAddressByUsername(username, callback){
    let request = new Request(HOST.backend_api + endpoint.address + "/" + username, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postAddress(_address, callback){
    let request = new Request(HOST.backend_api + endpoint.address , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'alias': _address.alias,
            'country': _address.country,
            'county': _address.country,
            'town': _address.town,
            'streetNr': _address.streetNr,
            'countryCode': _address.countryCode,
            'user': _address.user
        })
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}


export {
    getAddresses,
    getAddressByUsername,
    postAddress
};