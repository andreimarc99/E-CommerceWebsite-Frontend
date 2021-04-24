import RestApiClient from "../commons/rest-client"
import {HOST} from "../commons/hosts"

const endpoint = {
    voucher: '/vouchers'
};

function getVouchers(callback) {
    let request = new Request(HOST.backend_api + endpoint.voucher, {
        method: 'GET',
    });
    console.log(request.url);
    RestApiClient.performRequest(request, callback);
}

function postVoucher(c, callback){
        
    let request = new Request(HOST.backend_api + endpoint.voucher , {
        method: 'POST',
        headers : {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'code': c.code,
            'discount': c.discount,
            'oneTimeOnly': c.oneTimeOnly,
            'startDate': c.startDate,
            'endDate': c.endDate
        })
    });
    console.log(request.body);

    console.log("URL: " + request.url);

    RestApiClient.performRequest(request, callback);
}


export {
    getVouchers,
    postVoucher
};