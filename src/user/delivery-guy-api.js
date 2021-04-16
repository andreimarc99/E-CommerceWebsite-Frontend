import RestApiClient from "../commons/rest-client"
import {HOST} from "../commons/hosts"

const endpoint = {
    delivery: '/delivery_guys'
};

function getDeliveryGuys(callback) {
    let request = new Request(HOST.backend_api + endpoint.delivery, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getDeliveryGuyById(deliveryId, callback){
    let request = new Request(HOST.backend_api + endpoint.delivery + "/" + deliveryId, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postDeliveryGuy(_users, callback){
    let request = new Request(HOST.backend_api + endpoint.delivery , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'username': _users.username,
            'password': _users.password,
            'role': 'DELIVERY_GUY',
            'CNP': _users.CNP,
            'birthDate': _users.birthDate,
            'firstName': _users.firstName,
            'lastName': _users.lastName,
            'gender': _users.gender,
            'dateHired': _users.dateHired,
            'salary': 1
        })
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}


export {
    getDeliveryGuys,
    getDeliveryGuyById,
    postDeliveryGuy
};