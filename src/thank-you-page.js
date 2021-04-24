import React from 'react';
import {Button} from 'react-bootstrap'
import {HOST} from './commons/hosts'

class ThankYou extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick() {
        fetch(HOST.backend_api + '/carts/' + JSON.parse(localStorage.getItem("loggedUser")).username)
        .then(response => response.json())
        .then(data => {
            const putMethod = {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(
                    {
                        'cartId': data.cartId,
                        'customer': data.customer,
                        'products': [],
                        'fullPrice': 0
                    }
                )
            }
    
            fetch(HOST.backend_api + '/carts', putMethod)
                .then(response => {response.json(); window.location.href = '/'})
                .catch(err => console.log(err));
        })
        
    }

    render() {
        return (
            <div className="jumbotron text-center">
                <h1 className="display-3">Thank You!</h1>
                <p className="text-muted"> We are glad you chose our services. Our delivery guys will get to you as soon as possible. </p>
                
                <Button onClick={this.handleClick} variant="danger">Continue to homepage</Button>
            </div>
        )
    }
}

export default ThankYou