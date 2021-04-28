import React from 'react';
import {withRouter} from "react-router-dom";
import {HOST} from "../../commons/hosts"


import {Card, Button} from "react-bootstrap";
import {Link} from "react-router-dom";


class OrderHistoryPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            username: this.props.location.state.username,
            orderList: [],
            errorStatus: 0,
            error: ''
        }
        this.fetchOrders = this.fetchOrders.bind(this);
    }

    fetchOrders() {
        const {username} = this.state;
        console.log(username);
        let binData = null;
        fetch(HOST.backend_api + "/orders/" + username)
        .then(result => result.json())
        .then(data => {
            this.setState({orderList: data})
        });
    }

    componentDidMount() {
        this.fetchOrders();
    }

    render() {
        const {orderList, username} = this.state;
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
        console.log(orderList);
        return (
            <div style={{marginBottom:'20px'}}>  
                <h4 style={{marginTop:'10px'}}>{username}'s orders</h4> 
                <hr
                style={{
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 5
                }}/>
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
                                                <div style={{marginLeft:'10px'}} className="row"><b>Applied voucher </b> - {order.voucher.code} ({order.voucher.discount}% discount)</div>
                                                <div style={{marginLeft:'10px'}} className="row"><b>Products</b></div>
                                                {order.products.map((product) => {
                                                    return <div style={{marginLeft:'20px'}} className="row">{product.name} - ${product.price}</div>
                                                })}
                                                <div style={{marginLeft:'10px'}} className="row"><b>Delivered to: </b> {order.address.alias} ({order.address.streetNr}, {order.address.town}, {order.address.county}, {order.address.country})</div>
                                                <div style={{marginLeft:'10px'}} className="row"><b>Final price</b> - ${order.finalPrice}</div>

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
                                                <div style={{color:'red', marginTop:'10px'}} className="row"><b>Order #{order.orderId} summary</b></div>
                                                <div style={{marginLeft:'10px'}} className="row"><b>Applied voucher </b> - {order.voucher.code} ({order.voucher.discount}% discount)</div>
                                                <div style={{marginLeft:'10px'}} className="row"><b>Products</b></div>
                                                {order.products.map((product) => {
                                                    return <div style={{marginLeft:'20px'}} className="row">{product.name} - ${product.price}</div>
                                                })}
                                                <div style={{marginLeft:'10px'}} className="row"><b>Delivered to: </b> {order.address.alias} ({order.address.streetNr}, {order.address.town}, {order.address.county}, {order.address.country})</div>
                                                <div style={{marginLeft:'10px'}} className="row"><b>Final price</b> - ${order.finalPrice}</div>

                                            </div>);
                                    })
                                }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default withRouter(OrderHistoryPage);