import React from 'react';
import {Button} from 'react-bootstrap'
import {HOST} from '../../commons/hosts'
import * as CUSTOMER_API from "../../user/customer-api"

class ComplaintCustomerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: {}
        }
        this.fetchCustomer = this.fetchCustomer.bind(this);
    }

    fetchCustomer() {
        return fetch(HOST.backend_api + "/customers/" + JSON.parse(localStorage.getItem("loggedUser")).username)
        .then(response => response.json())
        .then (data => this.setState({customer: data}));
    }

    componentDidMount() {
        this.fetchCustomer();
    }

    render() {
        const {customer} = this.state;
        console.log(customer);
        return (
            <div>
                {(JSON.stringify(customer) !== JSON.stringify({}) ? <h5 className="display-3">{customer.user.firstName} {customer.user.lastName}'s complaints</h5> : <div />)}
            </div>
        )
    }
}

export default ComplaintCustomerPage