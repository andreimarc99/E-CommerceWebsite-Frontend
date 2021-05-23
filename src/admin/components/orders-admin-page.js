import React from 'react';
import {withRouter} from "react-router-dom";
import {HOST} from "../../commons/hosts"
import {Button} from "react-bootstrap"
import ReactSpinner from 'react-bootstrap-spinner'

import axios from 'axios';


class OrdersAdminPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            orderList: [],
            errorStatus: 0,
            error: '',
            done: false
        }
        this.fetchOrders = this.fetchOrders.bind(this);
    }

    fetchOrders() {
        axios.get(HOST.backend_api + "/orders/no_images")
        .then(response => {
            this.setState({orderList: response.data, done:true})
        });
    }

    handleMarkAsDelivered(order) {
        const putMethod = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'orderId': order.orderId,
                    'products': order.products,
                    'customer': order.customer,
                    'finalPrice': order.finalPrice,
                    'address': order.address,
                    'delivered': true,
                    'voucher': order.voucher
                }
            )
        }
        fetch(HOST.backend_api + '/orders', putMethod)
            .then(response => {})
            .then(data => window.location.reload())
            .catch(err => console.log(err));
    }

    componentDidMount() {
        this.fetchOrders();
    }

    render() {
        const {orderList, done} = this.state;
        var delivered = [];
        var undelivered = [];
        if (orderList.length > 0) {
            delivered = orderList.filter(function(item) {
                return item.delivered === true
            })
            undelivered = orderList.filter(function(item) {
                return item.delivered === false
            })
        }
        return (
            <div style={{marginBottom:'20px', marginTop:'20px'}}>  
            {(done === true ? (orderList.length > 0 ? 
            <div style={{justifyContent:'center', marginTop:'20px'}} className="container fluid">
            <div className="row">
                <div style={{marginRight:'5px'}} className="col">
                    <div style={{marginLeft:'5px'}} className="row"><h5>Delivered orders</h5></div>
                    <hr
                    style={{
                        color: 'rgb(255, 81, 81)',
                        backgroundColor: 'rgb(255, 81, 81)',
                        height: 3
                    }}/>
                        {
                            delivered.map((order) => {
                                return (
                                    <div>
                                        <div style={{color:'red'}} className="row"><b>Order #{order.orderId} summary</b></div>
                                        <div style={{marginLeft:'10px'}} className="row"><b style={{marginRight:'2px'}}>Customer</b></div>
                                        <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>Username </b> {order.customer.user.username}</div>
                                        <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>Name </b> {order.customer.user.firstName} {order.customer.user.lastName}</div>
                                        <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>CNP </b> {order.customer.user.cnp}</div>

                                        <div style={{marginLeft:'10px'}} className="row"><b style={{marginRight:'2px'}}>Applied voucher </b> {order.voucher.code} ({order.voucher.discount}% discount)</div>
                                        <div style={{marginLeft:'10px'}} className="row"><b style={{marginRight:'2px'}}>Products</b></div>
                                        {order.products.map((product) => {
                                            return <div style={{marginLeft:'20px'}} className="row">{product.name} - ${product.price}</div>
                                        })}
                                        <div style={{marginLeft:'10px'}} className="row"><b style={{marginRight:'2px'}}>Delivered to </b> {order.address.alias} ({order.address.streetNr}, {order.address.town}, {order.address.county}, {order.address.country})</div>
                                        <div style={{marginLeft:'10px'}} className="row"><b style={{marginRight:'2px'}}>Final price</b>  ${order.finalPrice}</div>

                                    </div>);
                            })
                        }
                </div>
                <div style={{marginLeft:'5px'}} className="col">
                    <div style={{marginLeft:'5px'}} className="row"><h5>Undelivered orders</h5></div>
                        <hr
                        style={{
                            color: 'rgb(255, 81, 81)',
                            backgroundColor: 'rgb(255, 81, 81)',
                            height: 3
                        }}/>
                        {
                            undelivered.map((order) => {
                                return (
                                    <div>
                                        <div style={{color:'red', marginTop:'10px'}} className="row"><b>Order #{order.orderId} summary</b>
                                        <Button onClick={() => this.handleMarkAsDelivered(order)} style={{marginLeft:'10px'}} variant="outline-danger" size="sm">Mark as delivered</Button>
                                        </div>
                                        <div style={{marginLeft:'10px'}} className="row"><b style={{marginRight:'2px'}}>Customer</b></div>
                                        <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>Username </b> {order.customer.user.username}</div>
                                        <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>Name </b> {order.customer.user.firstName} {order.customer.user.lastName}</div>
                                        <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>CNP </b> {order.customer.user.cnp}</div>

                                        <div style={{marginLeft:'10px'}} className="row"><b style={{marginRight:'2px'}}>Applied voucher </b> {order.voucher.code} ({order.voucher.discount}% discount)</div>
                                        <div style={{marginLeft:'10px'}} className="row"><b style={{marginRight:'2px'}}>Products</b></div>
                                        {order.products.map((product) => {
                                            return <div style={{marginLeft:'20px'}} className="row">{product.name} - ${product.price}</div>
                                        })}
                                        <div style={{marginLeft:'10px'}} className="row"><b style={{marginRight:'2px'}}>Delivery address </b> {order.address.alias} ({order.address.streetNr}, {order.address.town}, {order.address.county}, {order.address.country})</div>
                                        <div style={{marginLeft:'10px'}} className="row"><b style={{marginRight:'2px'}}>Final price</b> ${order.finalPrice}</div>

                                    </div>);
                            })
                        }
                </div>
            </div>
        </div>
            : <h2>No orders.</h2>) : <div style={{marginTop:'30px', marginBottom:'30px'}}> <ReactSpinner  type="border" color="danger" size="2" /></div>)}
                
            </div>
        );
    }

}

export default OrdersAdminPage