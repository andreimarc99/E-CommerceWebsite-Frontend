import RestApiClient from "../commons/rest-client"
import {HOST} from "../commons/hosts"

const endpoint = {
    admin: '/admins'
};

function getAdmins(callback) {
    let request = new Request(HOST.backend_api + endpoint.admin, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function getAdminById(adminId, callback){
    let request = new Request(HOST.backend_api + endpoint.admin + "/" + adminId, {
        method: 'GET'
    });

    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postAdmin(_users, callback){
    let request = new Request(HOST.backend_api + endpoint.admin , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'username': _users.username,
            'password': _users.password,
            'role': 'ADMIN',
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
    getAdmins,
    getAdminById,
    postAdmin
};