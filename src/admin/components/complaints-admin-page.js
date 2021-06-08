import React from 'react';
import {withRouter} from "react-router-dom";
import {HOST} from "../../commons/hosts"
import {Button} from "react-bootstrap"
import {
    Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap';

import axios from 'axios';
import ComplaintResponseForm from './complaint-response-form';
import ReactSpinner from 'react-bootstrap-spinner'

class ComplaintsAdminPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            complaintList: [],
            complaintResponseList: [],
            errorStatus: 0,
            error: '',
            selected_complaint_response: false,
            selected_complaint: {},
            complaintDone: false,
            complaintResponseDone: false
        }
        this.fetchComplaints = this.fetchComplaints.bind(this);
        this.fetchComplaintResponses = this.fetchComplaintResponses.bind(this);
        this.toggleRespondForm = this.toggleRespondForm.bind(this);
    }

    fetchComplaints() {
        return axios.get(HOST.backend_api + "/complaints")
            .then(resp => {
                this.setState({complaintList: resp.data, complaintDone: true})
            });
    }

    fetchComplaintResponses() {
        return axios.get(HOST.backend_api + "/complaint_responses")
            .then(resp => {
                this.setState({complaintResponseList: resp.data, complaintResponseDone: true})
            });
    }

    componentDidMount() {
        this.fetchComplaints();
        this.fetchComplaintResponses();
    }

    toggleRespondForm(complaint) {
        this.setState(
            {
                selected_complaint_response: !this.state.selected_complaint_response,
                selected_complaint: complaint
            }
        )
    }
    refresh() {
        window.location.reload(false);
    }

    render() {
        const {complaintDone, complaintResponseDone} = this.state;
        const {complaintList, complaintResponseList} = this.state;
        var done = false;
        if (complaintDone === true && complaintResponseDone === true) {
            done = true;
        }
        console.log(complaintResponseList);
        var answered = [];
        var unanswered = [];
        var responses = [];
        if (complaintList.length > 0 && complaintResponseList.length > 0) {
            for (let j = 0; j < complaintResponseList.length; ++j) {
                answered.push(complaintResponseList[j].complaint);
            }
            for (let i = 0; i < complaintList.length; ++i) {
                var complaint = complaintList[i];
                var found = false;
                for (let j = 0; j < complaintResponseList.length; ++j) {
                    if (complaint.complaintId === complaintResponseList[j].complaint.complaintId) {
                        found = true;
                    }
                }
                if (found === false) {
                    unanswered.push(complaint);
                }
            }
        }
        if (complaintResponseList.length > 0) {
            for (let i = 0; i < complaintResponseList.length; ++i) {
                responses[complaintResponseList[i].complaint.complaintId] = complaintResponseList[i];
            }
        }

        return (
            <div>
                <h1 style={{backgroundColor:'rgb(220,53,69)', color:'white'}}>COMPLAINTS</h1>

            <div style={{marginBottom:'20px', marginTop:'20px'}}>  
            {(done === true ? (complaintList.length > 0 ? <div>
               <div style={{justifyContent:'center', marginTop:'20px'}} className="container fluid">
               <div className="row">

               <div style={{marginLeft:'5px'}} className="col">
                       <div style={{marginLeft:'5px'}} className="row"><h5>UNANSWERED</h5></div>
                           <hr
                           style={{
                               color: 'rgb(220,53,69)',
                               backgroundColor: 'rgb(220,53,69)',
                               height: 3
                           }}/>
                           {
                               unanswered.map((complaint) => {
                                   return (
                                       <div style={{marginBottom:'20px'}}>
                                           <div style={{color:'red'}} className="row"><b>Complaint #{complaint.complaintId} </b>
                                           <Button onClick={() => this.toggleRespondForm(complaint)} size="sm" variant="outline-danger" style={{marginLeft:'10px'}}>REPLY</Button></div>
                                           <div style={{marginLeft:'10px'}} className="row"><b style={{marginRight:'2px'}}>Customer</b></div>
                                           <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>Username </b> {complaint.customer.user.username}</div>
                                           <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>Name </b> {complaint.customer.user.firstName} {complaint.customer.user.lastName}</div>
                                           <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>CNP </b> {complaint.customer.user.cnp}</div>
                                           <div style={{marginLeft:'10px'}} className="row"><b style={{marginRight:'2px'}}>COMPLAINT</b> </div>
                                           <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>Reason</b> {complaint.type}</div>
                                           <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>Message</b> {complaint.message}</div>

                                       </div>);
                                   
                               })
                           }
                   </div>

                   <div style={{marginRight:'5px'}} className="col">

                       <div style={{marginLeft:'5px'}} className="row"><h5>ANSWERED</h5></div>
                       <hr
                       style={{
                           color: 'rgb(220,53,69)',
                           backgroundColor: 'rgb(220,53,69)',
                           height: 3
                       }}/>
                           {
                               answered.map((complaint) => {
                                   return (
                                       <div style={{marginBottom:'20px'}}>
                                           <div style={{color:'red'}} className="row"><b>Complaint #{complaint.complaintId} </b></div>
                                           <div style={{marginLeft:'10px'}} className="row"><b style={{marginRight:'2px'}}>Customer</b></div>
                                           <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>Username </b> {complaint.customer.user.username}</div>
                                           <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>Name </b> {complaint.customer.user.firstName} {complaint.customer.user.lastName}</div>
                                           <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>CNP </b> {complaint.customer.user.cnp}</div>

                                           <div style={{marginLeft:'10px'}} className="row"><b style={{marginRight:'2px'}}>COMPLAINT</b> </div>
                                           <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>Reason</b> {complaint.type}</div>
                                           <div style={{marginLeft:'20px'}} className="row"><b style={{marginRight:'2px'}}>Message</b> {complaint.message}</div>
                                           <div style={{marginLeft:'10px', color:'red'}} className="row"><b style={{marginRight:'2px'}}>RESPONSE</b> </div>
                                           <div style={{marginLeft:'20px', color:'red'}} className="row"><b style={{marginRight:'2px'}}>Message</b> {responses[complaint.complaintId].message}</div>


                                       </div>);
                               })
                           }
                   </div>
                   
               </div>
           </div>
            <Modal isOpen={this.state.selected_complaint_response} toggle={this.toggleRespondForm}
            className={this.props.className} size="lg">
        <ModalHeader toggle={this.toggleRespondForm} style={{color:'rgb(220,53,69)'}}> Respond to complaint </ModalHeader>
        <ModalBody>
            <ComplaintResponseForm complaint={this.state.selected_complaint} reloadHandler={this.refresh}/>
        </ModalBody>
        </Modal></div> : <h2>No complaints.</h2>)
               
                :
                <div style={{marginTop:'30px', marginBottom:'30px'}}> <ReactSpinner  type="border" color="danger" size="2" /></div>)
            }

               
            </div>            
            </div>
        );
    }

}

export default ComplaintsAdminPage