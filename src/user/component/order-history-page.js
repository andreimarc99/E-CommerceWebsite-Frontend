import React from 'react';
import {withRouter} from "react-router-dom";
import {HOST} from "../../commons/hosts"
import ReactSpinner from 'react-bootstrap-spinner'
import OrderVisualizationForm from "./order-visualization-form"
import {Card, Button} from "react-bootstrap";
import {
    Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap';

class OrderHistoryPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            username: this.props.location.state.username,
            orderList: [],
            errorStatus: 0,
            error: '',
            done: false,
            selected_view_order: false
        }
        this.fetchOrders = this.fetchOrders.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
    }

    fetchOrders() {
        const {username} = this.state;
        fetch(HOST.backend_api + "/orders/" + username)
        .then(result => result.json())
        .then(data => {
            this.setState({orderList: data, done: true})
        });
    }

    getProductsForGivenOrder(o) {
        var products = '';
        for (let i = 0; i < o.products.length; ++i) {
            products += o.products[i].name + "\n"
        }
        return products;
    }

    toggleForm(o) {
        this.setState(
            {
                selected_view_order: !this.state.selected_view_order,
                selected_order: o
            }
        )
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
            <div>
                <h1 style={{backgroundColor:'rgb(220,53,69)', color:'white'}}>ORDER HISTORY</h1>
            
            <div style={{marginBottom:'20px', marginTop:'20px', justifyContent:'center'}}>  
               <h2>UNDELIVERED</h2>
               <hr
                style={{
                    color: 'rgb(220,53,69)',
                    backgroundColor: 'rgb(220,53,69)',
                    height: 10
                }}/>
               {(done === true ? <div>
                 {(undelivered.length > 0 ? 
                    <div className="row" style={{justifyItems:'center', alignItems:'center', flexWrap:'wrap'}}>
                    {undelivered.map((o) => {
                        {return (o.products.length > 0 ? 
                            
                        <div className="col">
                        <Card bg="card border-danger" text="black" style={{margin: '10px', minWidth:'200px'}}>
                             
                      
                        <Card.Header style={{backgroundColor:'rgb(220,53,69)', color:'white'}}><h4>Order #{o.orderId}</h4></Card.Header>
                        
                        <Card.Body className="text-center">
                            <b>Products</b>
                        <textarea readOnly='true' style={{width:'100%', border:'none', overflowX: 'hidden'}} value={this.getProductsForGivenOrder(o)} className="txtarea text-muted"></textarea>
                            <hr
                            style={{
                                color: 'rgb(220,53,69)',
                                backgroundColor: 'rgb(220,53,69)',
                                height: 3,
                                width:'40%'
                            }}/>
                            <h4 className="text-muted">${(Math.round(o.finalPrice * 100) / 100).toFixed(1)}</h4>
                            <Button style={{marginBottom:'5px'}} variant="outline-danger" onClick={() => this.toggleForm(o)}>Details</Button>
                        </Card.Body>
                        </Card>
                        </div>
                            : <div />)}
                   })}
    
                    </div>
    
                    : <div className="text-muted">No undelivered orders found at the moment.</div>)}</div>
                : <div style={{marginTop:'30px', marginBottom:'30px'}}> <ReactSpinner  type="border" color="danger" size="2" /></div>)}
              

              <h2 style={{marginTop:'40px'}}>DELIVERED</h2>
               <hr
                style={{
                    color: 'rgb(220,53,69)',
                    backgroundColor: 'rgb(220,53,69)',
                    height: 10
                }}/>
               {(done === true ? <div>
                 {(delivered.length > 0 ? 
                    <div className="row" style={{justifyItems:'center', alignItems:'center', flexWrap:'wrap'}}>
                    {delivered.map((o) => {
                        {return (o.products.length > 0 ? 
                            
                        <div className="col">

                        <Card bg="card border-danger" text="black" style={{margin: '10px', minWidth:'200px'}}>
                             
                      
                        <Card.Header style={{backgroundColor:'rgb(220,53,69)', color:'white'}}><h4>Order #{o.orderId}</h4></Card.Header>
                        
                        <Card.Body className="text-center">
                            <b>Products</b>
                        <textarea readOnly='true' style={{width:'100%', border:'none', overflowX: 'hidden'}} value={this.getProductsForGivenOrder(o)} className="txtarea text-muted"></textarea>
                            <hr
                            style={{
                                color: 'rgb(220,53,69)',
                                backgroundColor: 'rgb(220,53,69)',
                                height: 3,
                                width:'40%'
                            }}/>
                            <h4 className="text-muted">${(Math.round(o.finalPrice * 100) / 100).toFixed(1)}</h4>
                            <Button style={{marginBottom:'5px'}} variant="outline-danger" onClick={() => this.toggleForm(o)}>Details</Button>
                        </Card.Body>
                        </Card>
                        </div>
                            : <div />)}
                            
                   })}
    
                    </div>
    
                    : <div className="text-muted">No delivered orders found.</div>)}</div>
                : <div style={{marginTop:'30px', marginBottom:'30px'}}> <ReactSpinner  type="border" color="danger" size="2" /></div>)}
              
                            
              <Modal isOpen={this.state.selected_view_order} toggle={this.toggleForm}
                        className={this.props.className} size="lg">
                    <ModalHeader toggle={this.toggleForm} style={{color:'rgb(220,53,69)'}}> Order details </ModalHeader>
                    <ModalBody>
                        <OrderVisualizationForm order={this.state.selected_order}/>
                    </ModalBody>
                </Modal>
               
            </div></div>
        );
    }

}

export default withRouter(OrderHistoryPage);