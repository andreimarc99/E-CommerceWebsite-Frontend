import React from 'react';
import {HOST} from "../../commons/hosts"
import {Card, Button} from "react-bootstrap"
import jump from "../../img/jump.png"
import axios from 'axios';

class OrdersDeliveryPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            orderList: [],
            errorStatus: 0,
            error: ''
        }
        this.fetchOrders = this.fetchOrders.bind(this);
    }

    fetchOrders() {
        axios.get(HOST.backend_api + "/orders")
        .then(response => {
            this.setState({orderList: response.data})
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

    getProducts(order) {
        let products = "";
        if (order.products.length > 0) {
            for (let i = 0; i < order.products.length; ++i) {
                products += order.products[i].name + " - $" + order.products[i].price + "\n";
            }
        }
        return products;
    }

    componentDidMount() {
        this.fetchOrders();
    }

    render() {
        const {orderList} = this.state;
        var undelivered = [];
        if (orderList.length > 0) {
            undelivered = orderList.filter(function(item) {
                return item.delivered === false
            })
        }
        return (
            <div style={{marginTop:'20px', marginBottom:'20px'}}>  
                <h2>Active orders</h2>
                <hr
                style={{
                    color: 'rgb(220,53,69)',
                    backgroundColor: 'rgb(220,53,69)',
                    height: 10
                }}/>
                {
                    undelivered.map((order) => {
                        return (

                            <div className="row">
                            <div className="col">
            
                            <Card bg="card border-danger" text="black" style={{marginLeft: '100px', marginRight:'100px', marginTop:'10px', marginBottom:'10px'}}>
                                
                            <Card.Header className="red-card-header"><h3>Order #{order.orderId}</h3></Card.Header>
                            <Card.Body>
                                <div className="container fluid">
                                <div className="row">
                                    <div className="col">
                                        
                                        <h5><b>Customer</b></h5>
                                        <div><b>Username </b> {order.customer.user.username}</div>
                                        <div><b>Name </b> {order.customer.user.firstName} {order.customer.user.lastName}</div>
                                        <div><b>CNP </b> {order.customer.user.cnp}</div>
                                    </div>
                                    <div className="col"> 
                                        <h5>
                                        <b>Products</b>
                                        </h5>

                                        {
                                        /*order.products.map((product) => {
                                            return <div>{product.name} - ${product.price}</div>
                                        })*/
                                            <textarea readOnly='true' style={{width:'100%', border:'none'}} value={this.getProducts(order)} className="txtarea"></textarea>
                                        }
                                    </div>
                                    <div className="col">
                                        <h5><b>Applied voucher</b> </h5>
                                        <div>{order.voucher.code} ({order.voucher.discount}% discount)</div>

                                    </div>
                                </div>

                                <hr
                                style={{
                                    color: 'rgb(220,53,69)',
                                    backgroundColor: 'rgb(220,53,69)',
                                    height: 2
                                }}/>
                                <div className="row">
                                    
                                <div className="col">

                                    <h5><b>Delivery address </b></h5>
                                    <div>{order.address.streetNr}, {order.address.town}, {order.address.county}, {order.address.country} <a style={{marginLeft:'5px'}} target="_tab" href={"https://www.google.ro/maps/place/"+order.address.streetNr+"+"+order.address.town+"+"+order.address.county+"+"+order.address.country}><img src={jump} style={{width:'2%'}} /></a></div>
                                    <hr
                                    style={{
                                        color: 'rgb(220,53,69)',
                                        backgroundColor: 'rgb(220,53,69)',
                                        height: 2
                                    }}/>
                                    <h5><b>Price</b></h5>
                                    <div>${order.finalPrice}</div>

                                </div>
                                </div>
                                </div>
                                <Button style={{marginTop:'15px'}} onClick={() => this.handleMarkAsDelivered(order)} variant="danger" size="lg">Mark as delivered</Button>
                            </Card.Body>
                            </Card></div></div>

                            );
                    })
                }
            </div>
        );
    }

}

export default OrdersDeliveryPage