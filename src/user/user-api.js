import RestApiClient from "../commons/rest-client"
import {HOST} from "../commons/hosts"

const endpoint = {
    users: '/users'
};

function getUsers(callback) {
    let request = new Request(HOST.backend_api + endpoint.users, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getUserById(username, callback){
    let request = new Request(HOST.backend_api + endpoint.users + "/" + username, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postUsers(_users, callback){
    let request = new Request(HOST.backend_api + endpoint.users , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'username': _users.username,
            'password': _users.password,
            'role': _users.role,
            'cnp': _users.cnp,
            'birthDate': _users.birthDate,
            'firstName': _users.firstName,
            'lastName': _users.lastName,
            'gender': _users.gender
        })
    });

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}


export {
    getUsers,
    getUserById,
    postUsers
};