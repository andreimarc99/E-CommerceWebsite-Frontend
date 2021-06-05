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

    getProductsForGivenOrder(o) {
        var products = '';
        for (let i = 0; i < o.products.length; ++i) {
            products += "[" + o.products[i].name + "], "
        }
        products = products.substring(0, products.length - 2)
        return products;
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
            <div>
                <h5>Undelivered orders</h5>
                <hr
                style={{
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 3
                }}/>
                    <table className="table table-striped table-bordered tbl-orders" style={{display:'inline-block', overflow:'auto', height:'600px', width:'80%', marginBottom:'50px'}}>
                    <thead className="tbl-head">
                    <tr>
                        <th className="text-center" width='50px'> ID</th>
                        <th className="text-center"> Customer</th>
                        <th className="text-center"> Products</th>
                        <th className="text-center"> Delivery Address</th>
                        <th className="text-center"> Voucher</th>
                        <th className="text-center"> Price</th>
                        <th className="text-center"> Actions</th>
                    </tr>
                    </thead>
                    <tbody>{
                    undelivered.map((order) => 
                    (order.products.length > 0 ? 
                             (
                                <tr key={order.orderId}>
                                    <td className="text-center"> {order.orderId}</td>
                                    <td className="text-center"> <b>{order.customer.user.firstName} {order.customer.user.lastName}</b> <p className="text-muted">@{order.customer.user.username}</p></td>
                                    <td className="text-center"> {this.getProductsForGivenOrder(order)}</td>
                                    <td className="text-center"> {order.address.streetNr}, {order.address.town}, {order.address.county}, {order.address.country}</td>
                                    <td className="text-center"> [{order.voucher.code}] <p className="text-muted">{order.voucher.discount}% discount</p></td>
                                    <td className="text-center"> ${order.finalPrice} </td>
                                    <td className="text-center"><Button onClick={() => this.handleMarkAsDelivered(order)} style={{marginLeft:'10px'}} variant="outline-danger" size="sm">Mark as delivered</Button></td>
    
    
                                </tr>)
                        
                        : <div />)
                    )}
                    </tbody>
                       </table>

                       <h5>Delivered orders</h5>
                <hr
                style={{
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 3
                }}/>
                    <table className="table table-striped table-bordered tbl-orders" style={{display:'inline-block', overflow:'auto', height:'600px', width:'80%', marginBottom:'50px'}}>
                    <thead className="tbl-head">
                    <tr>
                        <th className="text-center" width='50px'> ID</th>
                        <th className="text-center"> Customer</th>
                        <th className="text-center"> Products</th>
                        <th className="text-center"> Delivery Address</th>
                        <th className="text-center"> Voucher</th>
                        <th className="text-center"> Price</th>
                    </tr>
                    </thead>
                    <tbody>{
                    delivered.map((order) => 
                    (order.products.length > 0 ? 
                             (
                                <tr key={order.orderId}>
                                    <td className="text-center"> {order.orderId}</td>
                                    <td className="text-center"> <b>{order.customer.user.firstName} {order.customer.user.lastName}</b> <p className="text-muted">@{order.customer.user.username}</p></td>
                                    <td className="text-center"> {this.getProductsForGivenOrder(order)}</td>
                                    <td className="text-center"> {order.address.streetNr}, {order.address.town}, {order.address.county}, {order.address.country}</td>
                                    <td className="text-center"> [{order.voucher.code}] <p className="text-muted">{order.voucher.discount}% discount</p></td>
                                    <td className="text-center"> ${order.finalPrice} </td>
    
                                </tr>)
                        
                        : <div />)
                    )}
                    </tbody>
                       </table>
                
            </div>
            : <h2>No orders.</h2>) : <div style={{marginTop:'30px', marginBottom:'30px'}}> <ReactSpinner  type="border" color="danger" size="2" /></div>)}
                
            </div>
        );
    }

}

export default OrdersAdminPage