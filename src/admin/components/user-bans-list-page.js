import React from 'react';
import {HOST} from "../../commons/hosts"
import {Button} from "react-bootstrap"
import {
    Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap';

import axios from 'axios';
import trash from "../../img/trash.png"
import ReactSpinner from 'react-bootstrap-spinner'
import BanUpdateForm from './ban-update-form';

class UserBansPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            banList: [],
            errorStatus: 0,
            error: '',
            selected_update_ban: false,
            selected_ban: {},
            done: false
        }
        this.fetchUserBans = this.fetchUserBans.bind(this);
        this.toggleUpdateBan = this.toggleUpdateBan.bind(this);
    }

    fetchUserBans() {
        return axios.get(HOST.backend_api + "/user_bans")
            .then(resp => {
                this.setState({banList: resp.data, done: true})
            });
    }
    
    handleDeleteBan(banId) { 
        fetch(HOST.backend_api + '/user_bans/' + banId, {
        method: 'DELETE',
        })
        .then(res => window.location.reload());
    }

    componentDidMount() {
        this.fetchUserBans();
    }


    toggleUpdateBan(ban) {
        if (this.state.selected_update_ban === true) {
            this.setState(
                {
                    selected_update_ban: !this.state.selected_update_ban
                }
            )
        } else {
            this.setState(
                {
                    selected_update_ban: !this.state.selected_update_ban,
                    selected_ban: JSON.parse(JSON.stringify(ban))
                }
            )
        }
    }

    refresh() {
        window.location.reload(false);
    }

    render() {
        
        if (localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== undefined) {
            if (JSON.parse(localStorage.getItem("loggedUser")).role === "ADMIN") {
        const {done} = this.state;
        var {banList} = this.state;
        return (
            <div>
                <h1 style={{backgroundColor:'rgb(220,53,69)', color:'white'}}>USER BANS</h1>
            <div style={{marginBottom:'20px', marginTop:'20px'}}>
                
                {(done === true ?  
                    (banList.length > 0 ? 
                    <div className="row" style={{marginLeft:'100px', marginRight:'100px'}}>
                        <div style={{width:'100%'}} data-aos="fade-up" data-aos-duration="1000">
                        <table className="table table-striped table-bordered">
                            <thead className="tbl-head">
                            <tr>
                                <th className="text-center" width='50px'> ID</th>
                                <th className="text-center"> USER </th>
                                <th className="text-center"> REASON </th>
                                <th className="text-center"> PERIOD </th>
                                <th className="text-center"> ACTIONS </th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                banList.map(
                                    ban => 
                                        <tr key={ban.banId}>
                                            <td className="text-center"> {ban.banId}</td>
                                            <td className="text-center"> {ban.user.firstName} {ban.user.lastName} <div className="text-muted">@{ban.user.username}</div></td>
                                            <td className="text-center"> {ban.reason}</td>
                                            <td className="text-center"> {new Date(ban.startDate.substring(0,10)).toDateString()} - {new Date(ban.endDate.substring(0,10)).toDateString()}</td>
                                            <td className="text-center"> <Button onClick={() => this.toggleUpdateBan(ban)} style={{margin:'5px'}} variant='outline-danger' size='sm'>UPDATE</Button>
                                            <Button className="btn btn-sm" variant="danger" onClick={() => this.handleDeleteBan(ban.banId)} style={{marginLeft:'5px'}}>
                                            <img src={trash} className="logo" style={{width:'18px'}}/></Button></td>
                                        </tr>)
                            }
                            </tbody>
                        </table></div>
                    </div> : <div >No bans</div>)
                
                : <div style={{marginTop:'30px', marginBottom:'30px'}}> <ReactSpinner  type="border" color="danger" size="2" /></div>)
                }

                <Modal isOpen={this.state.selected_update_ban} toggle={this.toggleUpdateBan}
                    className={this.props.className} size="lg">
                <ModalHeader toggle={this.toggleUpdateBan} style={{color:'rgb(220,53,69)'}}> Update ban </ModalHeader>
                <ModalBody>
                    <BanUpdateForm ban={this.state.selected_ban} reloadHandler={this.refresh}/>
                </ModalBody>
                </Modal>
            </div></div>
        );
    
        } else {
            return (
                <div style={{margin: "auto"}}>
                    <div className="card-body">
                        <h2 style={{color:'rgb(220,53,69)'}} className="card-title font-weight-bold">Access denied!</h2>
                        <p className="card-text text-muted">You do not have access to this page, as your role needs to be ADMIN.</p>
                    </div>
                </div>
            )
        }
    } else {
        return (
            <div style={{margin: "auto"}}>
                <div className="card-body">
                <h2 style={{color:'rgb(220,53,69)'}} className="card-title font-weight-bold">Access denied!</h2>
                    <p className="card-text text-muted">You do not have access to this page, as your role needs to be ADMIN.</p>
                </div>
            </div>
        )
    } 
    }

}

export default UserBansPage