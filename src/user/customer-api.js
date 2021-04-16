import RestApiClient from "../commons/rest-client"
import {HOST} from "../commons/hosts"

const endpoint = {
    customer: '/customers'
};

function getCustomers(callback) {
    let request = new Request(HOST.backend_api + endpoint.customer, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getCustomerById(customerId, callback){
    let request = new Request(HOST.backend_api + endpoint.customer + "/" + customerId, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postCustomer(_users, callback){
    let request = new Request(HOST.backend_api + endpoint.customer , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'username': _users.username,
            'password': _users.password,
            'role': 'CUSTOMER',
            'CNP': _users.CNP,
            'birthDate': _users.birthDate,
            'firstName': _users.firstName,
            'lastName': _users.lastName,
            'gender': _users.gender,
            'dateJoined': _users.dateJoined
        })
    });
    
    console.log(request.body);
    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}


export {
    getCustomers,
    getCustomerById,
    postCustomer
};