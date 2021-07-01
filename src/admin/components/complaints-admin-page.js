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
import check from "../../img/checked.png"
import cancel from "../../img/cancel.png"


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

                       <div data-aos="fade-up" data-aos-duration="1000"> 
                <h5>UNANSWERED</h5>
                           <hr
                           style={{
                               color: 'rgb(220,53,69)',
                               backgroundColor: 'rgb(220,53,69)',
                               height: 3
                           }}/>
                            <table className="table table-striped table-bordered tbl-orders" style={{display:'inline-block', overflow:'auto', width:'80%', marginBottom:'50px'}}>
                                <thead className="tbl-head">
                                <tr>
                                    <th className="text-center"> ID</th>
                                    <th className="text-center"> CUSTOMER</th>
                                    <th className="text-center"> REASON</th>
                                    <th className="text-center"> MESSAGE</th>
                                    <th className="text-center"> ACTIONS</th>
                                </tr>
                                </thead>
                                <tbody>{
                                unanswered.map((c) => 
                                            <tr key={c.complaintId}>
                                                <td className="text-center"> {c.complaintId}</td>
                                                <td className="text-center"> <b>{c.customer.user.firstName} {c.customer.user.lastName}</b> <p className="text-muted">@{c.customer.user.username}</p></td>
                                                <td className="text-center"> {c.type} </td>
                                                <td className="text-center"> {c.message} </td>
                                                <td className="text-center"><Button onClick={() => this.toggleRespondForm(c)} style={{marginLeft:'10px'}} variant="outline-danger" size="sm">RESPOND</Button></td>
                                            </tr>)
                                }
                                </tbody>
                       </table>

                    </div>
                    <div data-aos="fade-up" data-aos-duration="1000">
                       <h5>ANSWERED</h5>
                           <hr
                           style={{
                               color: 'rgb(220,53,69)',
                               backgroundColor: 'rgb(220,53,69)',
                               height: 3
                           }}/>
                            <table className="table table-striped table-bordered tbl-orders" style={{display:'inline-block', overflow:'auto', width:'80%', marginBottom:'50px'}}>
                                <thead className="tbl-head">
                                <tr>
                                    <th className="text-center"> ID</th>
                                    <th className="text-center"> CUSTOMER</th>
                                    <th className="text-center"> REASON</th>
                                    <th className="text-center"> MESSAGE</th>
                                    <th className="text-center"> RESPONSE</th>
                                </tr>
                                </thead>
                                <tbody>{
                                answered.map((c) => 
                                            <tr key={c.complaintId}>
                                                <td className="text-center"> {c.complaintId}</td>
                                                <td className="text-center"> <b>{c.customer.user.firstName} {c.customer.user.lastName}</b> <p className="text-muted">@{c.customer.user.username}</p></td>
                                                <td className="text-center"> {c.type} </td>
                                                <td className="text-center"> {c.message} </td>
                                                <td className="text-center" style={{color:'rgb(220,53,69)'}}> <strong>{responses[c.complaintId].message} </strong></td>
                                               </tr>)
                                }
                                </tbody>
                       </table>
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