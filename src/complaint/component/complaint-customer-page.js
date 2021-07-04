import React from 'react';
import {Button} from 'react-bootstrap'
import {HOST} from '../../commons/hosts'
import {
    Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap';
import ComplaintCreationForm from './complaint-creation-form';

class ComplaintCustomerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: {},
            complaintList: [],
            complaintResponseList: [],
            selected_create: false
        }
        this.fetchCustomer = this.fetchCustomer.bind(this);
        this.fetchComplaintResponses = this.fetchComplaintResponses.bind(this);
        this.toggleCreateForm = this.toggleCreateForm.bind(this);
        this.reloadComplaints = this.reloadComplaints.bind(this);
    }
    
    toggleCreateForm() {
        this.setState({selected_create: !this.state.selected_create});
    }
    
    reloadComplaints() {
        this.setState({
            isReviewListLoaded: false
        });
        this.toggleCreateForm();
    }

    fetchCustomer() {
        
        if (localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== undefined) {
            return fetch(HOST.backend_api + "/customers/" + JSON.parse(localStorage.getItem("loggedUser")).username)
            .then(response => response.json())
            .then (data => {
                this.setState({customer: data})
                fetch(HOST.backend_api + "/complaints/" + JSON.parse(localStorage.getItem("loggedUser")).username)
                .then(resp => resp.json())
                .then(d => {
                    this.setState({complaintList: d})
                    return d.map((complaint) => {
                        console.log(complaint);
                        return fetch(HOST.backend_api + "/complaint_responses/" + complaint.complaintId)
                        .then(response => response.json())
                        .then(data => {
                            this.setState(prevState => ({
                                complaintResponseList: [...prevState.complaintResponseList, data]
                            }))
                        })
                    })
                });
            });
        }
    }

    fetchComplaintResponses() {
        const {complaintList} = this.state;
        console.log(complaintList);
        return complaintList.map((complaint) => {
            console.log(complaint);
            return fetch(HOST.backend_api + "/complaint_responses/" + complaint.complaintId)
            .then(response => response.json())
            .then(data => {
                this.setState(prevState => ({
                    complaintResponseList: [...prevState.complaintResponseList, data]
                  }))
            })
        })
    }

    componentDidMount() {
        this.fetchCustomer();
    }

    render() {
        
        if (localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== undefined) {
            if (JSON.parse(localStorage.getItem("loggedUser")).role === "CUSTOMER") {
        const {customer, complaintList, complaintResponseList} = this.state;
        console.log(complaintResponseList);
        var responses = [];
        if (complaintList.length > 0 & complaintResponseList.length > 0) {
            complaintResponseList.map((cr) => {
                responses[cr.complaint.complaintId] = cr})
        } 
        return (
            <div style={{marginTop:'20px', marginBottom:'20px'}}>
                {(JSON.stringify(customer) !== JSON.stringify({}) ? <h2>{customer.user.firstName} {customer.user.lastName}'s complaints</h2> : <div />)}
                <hr
                style={{
                    marginLeft:'0px',
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 5
                }}/>
                <Button onClick={this.toggleCreateForm} variant="outline-danger">File new complaint</Button>

                <div className = "container fluid">
                {(complaintList.length > 0 ? 
                    complaintList.map((complaint) => {
                        return (
                        <div data-aos="fade-up" data-aos-duration="1000" className="row" style={{marginTop:'20px', marginBottom:'40px'}}>
                            <div className="col"> 
                                <div className="row">
                                    <h3>Complaint #{complaint.complaintId}</h3>
                                </div>
                                <div className="row">
                                    <hr
                                    style={{
                                        marginLeft:'0px',
                                        color: 'rgb(255, 81, 81)',
                                        backgroundColor: 'rgb(255, 81, 81)',
                                        height: 1,
                                        width: '300px'
                                    }}/>
                                </div>
                                <div className="row">
                                    <p><b>Reason</b></p>
                                </div>
                                <div className="row">
                                    <p style={{marginLeft:'20px'}}>{complaint.type}</p>
                                </div>
                                <div className="row">
                                    <p><b>Message</b></p>
                                </div>
                                <div className="row">
                                    <p style={{marginLeft:'20px'}}>{complaint.message}</p>
                                </div>
                            </div>
                            {(responses[complaint.complaintId] !== undefined ? (
                            <div className="col">
                                <h3 className="row">Response for C. #{complaint.complaintId}</h3>
                                <div className="row">
                                    <hr
                                    style={{
                                        marginLeft:'0px',
                                        color: 'rgb(255, 81, 81)',
                                        backgroundColor: 'rgb(255, 81, 81)',
                                        height: 1,
                                        width: '300px'
                                    }}/>
                                </div>
                                <div className="row">
                                    <p><b>Response</b></p>
                                </div>
                                <div className="row">
                                    <p style={{marginLeft:'20px'}}>{responses[complaint.complaintId].message}</p>
                                </div>
                            </div>) : <div />)}
                          </div>
                        );
                    })
                    : <div />
                )}
                </div>
            <Modal isOpen={this.state.selected_create} toggle={this.toggleCreateForm}
                className={this.props.className} size="lg">
                <ModalHeader toggle={this.toggleCreateForm}><p style={{color:"red"}}> File new complaint </p></ModalHeader>
                <ModalBody>
                    <ComplaintCreationForm reloadHandler={this.reloadComplaints}/>
                </ModalBody>
            </Modal>

            </div>
        );
        } else {
            return (
                <div style={{margin: "auto"}}>
                    <div className="card-body">
                        <h2 style={{color:'rgb(220,53,69)'}} className="card-title font-weight-bold">Access denied!</h2>
                        <p className="card-text text-muted">You do not have access to this page, as your role needs to be CUSTOMER.</p>
                    </div>
                </div>
            )
        }
    } else {
        return (
            <div style={{margin: "auto"}}>
                <div className="card-body">
                <h2 style={{color:'rgb(220,53,69)'}} className="card-title font-weight-bold">Access denied!</h2>
                    <p className="card-text text-muted">You do not have access to this page, as your role needs to be CUSTOMER.</p>
                </div>
            </div>
        )
    } 
    }
}

export default ComplaintCustomerPage