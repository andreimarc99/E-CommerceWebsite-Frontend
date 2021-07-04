import React from 'react';
import {withRouter} from "react-router-dom";
import male from "../../img/male.png"
import female from "../../img/female.png"
import {Input} from 'reactstrap'
import {Button} from 'react-bootstrap'
import {HOST} from "../../commons/hosts"
import * as API_USERS from "../user-api"
import * as API_ADDRESS from "../address-api"
import AddressUpdateForm from "./address-update-form"
import {
    Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap';
import AddressCreationForm from './address-creation-form';
import axios from 'axios';
import EmailCreationForm from './email-creation-form';
import EmailUpdateForm from './email-update-form';
import ReactSpinner from 'react-bootstrap-spinner'
import trash from "../../img/trash.png"
import eye from "../../img/eye.png"

class UserPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            user: this.props.location.state.user,
            valid: true,
            addresses: [],
            errorStatus: 0,
            error: '',
            selected_update_address: false,
            selected_address: {},
            selected_add_address: false,
            emails: [],
            selected_add_email: false,
            selected_update_email: false,
            doneAddresses: false,
            doneEmails: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.toggleUpdateForm = this.toggleUpdateForm.bind(this);
        this.toggleUpdateEmailForm = this.toggleUpdateEmailForm.bind(this);
        this.toggleAddForm = this.toggleAddForm.bind(this);
        this.toggleAddEmailForm = this.toggleAddEmailForm.bind(this);
        this.fetchAddresses = this.fetchAddresses.bind(this);
    }

    componentDidMount() {
        this.fetchAddresses();
        this.fetchEmails();
    }

    fetchAddresses() {
        let username = document.getElementById("username").innerText.substr(1, document.getElementById("username").innerText.length - 1);
        if (username !== undefined) 
            API_ADDRESS.getAddressByUsername(username, (result, status, err) => {
                if (result !== null && status === 200) {
                    this.setState(({
                        addresses: result,
                        doneAddresses: true
                    }));
                    
                } else {
                    this.setState(({
                        errorStatus: status,
                        error: err
                    }));
                }
            })
        
    }

    fetchEmails() {
        const {user} = this.state;
        axios.get(HOST.backend_api + "/emails/" + JSON.parse(user).username)
        .then(response => this.setState({emails: response.data, doneEmails: true}))
    }

    handleEmailDelete(id) {
        fetch(HOST.backend_api + '/emails/' + id, {method: 'DELETE'})
            .then(response => this.refresh());
    }

    handleSave() {
        const {user} = this.state;
        const username = JSON.parse(user).username;
        const role = JSON.parse(user).role;
        const gender = JSON.parse(user).gender;

        
        const password = document.getElementById("password").value;
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const birthDate = document.getElementById("birthDate").value;
        const cnp = document.getElementById("cnp").value;


        const putMethod = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'username': username,
                    'password': password,
                    'firstName': firstName,
                    'lastName': lastName,
                    'birthDate': birthDate,
                    'cnp': cnp,
                    'gender': gender,
                    'role': role
                }
            )
        }

        fetch(HOST.backend_api + '/users', putMethod)
            .then(response => {console.log(response)})
            .then(data => {
                
                let _user = {};

                API_USERS.getUserById(username, (result, status, err) => {
                    
                    if (result !== null && status === 200) {
                        _user = result;
                        console.log(_user);
                        document.getElementById("name").value = JSON.parse(JSON.stringify(_user)).firstName.concat(JSON.parse(JSON.stringify(_user)).lastName);
                        document.getElementById("firstName").value = JSON.parse(JSON.stringify(_user)).firstName;
                        document.getElementById("lastName").value = JSON.parse(JSON.stringify(_user)).lastName;
                        document.getElementById("password").value = JSON.parse(JSON.stringify(_user)).password;
                        document.getElementById("cnp").value = JSON.parse(JSON.stringify(_user)).cnp;
                        this.setState({user: JSON.stringify(_user)});
                        localStorage.setItem("loggedUser", JSON.stringify(_user));
                    } else {
                        this.setState(({
                            errorStatus: status,
                            error: err
                        }));
                    }
            })
            })
            .catch(err => console.log(err));


    }

    handleChange = event => {
        if (document.getElementById('firstName').value.length < 3 || document.getElementById('lastName').value.length < 3 || document.getElementById('password').value.length < 3 || document.getElementById('cnp').value.length !== 13) {
            this.setState({valid: false});
        } else {
            this.setState({valid: true});
        }
    };

    toggleUpdateForm(address) {
        if (this.state.selected_update_address === true) {
            this.setState(
                {
                    selected_update_address: !this.state.selected_update_address
                }
            )
        } else {
            this.setState(
                {
                    selected_update_address: !this.state.selected_update_address,
                    selected_address: JSON.parse(JSON.stringify(address))
                }
            )
        }
    }
   
    toggleUpdateEmailForm(e) {
        if (this.state.selected_update_email === true) {
            this.setState(
                {
                    selected_update_email: !this.state.selected_update_email
                }
            )
        } else {
            this.setState(
                {
                    selected_update_email: !this.state.selected_update_email,
                    selected_email: JSON.parse(JSON.stringify(e))
                }
            )
        }
    }

    toggleAddForm() {
        this.setState(
            {
                selected_add_address: !this.state.selected_add_address
            }
        )
    }

    toggleAddEmailForm() {
        this.setState(
            {
                selected_add_email: !this.state.selected_add_email
            }
        )
    }

    refresh() {
        window.location.reload(false);
    }

    toggleVisibility() {
        var x = document.getElementById("password");
        if (x.type === "password") {
          x.type = "text";
        } else {
          x.type = "password";
        }
      }

    render() {
        const {user} = this.state;
        const {addresses, emails, doneAddresses, doneEmails} = this.state;
        console.log(emails);
        return (
        <div style={{overflow:'hidden'}}>

            <br />
            {(JSON.parse(user).gender === "M" ? <img alt="male" src={male} style={{width:'20%'}}></img> : <img alt="female" src={female} style={{width:'20%'}}></img>)}
            
            <h1 id="name" className="zoom-text" style={{backgroundColor:'rgb(220,53,69)', color:'white'}}>{JSON.parse(user).firstName} {JSON.parse(user).lastName}</h1>
            <p id="username" className="text-muted">@{JSON.parse(user).username}</p>

            <div>
            <h4 style={{marginTop:'10px'}}>FIRST NAME</h4>
            <input id='firstName' name='firstName' onChange={this.handleChange} style={{textAlign:'center', outlineColor:'rgb(220,53,69)'}} defaultValue={JSON.parse(user).firstName}></input>
            <h4 style={{marginTop:'10px'}}>LAST NAME</h4>
            <input id='lastName' name='lastName' onChange={this.handleChange} style={{textAlign:'center', outlineColor:'rgb(220,53,69)'}} defaultValue={JSON.parse(user).lastName}></input>
            <h4 onClick={this.toggleVisibility} style={{marginTop:'10px'}}>PASSWORD</h4>  
            <input id='password' type="password" name='password' onChange={this.handleChange} style={{textAlign:'center', outlineColor:'rgb(220,53,69)'}} defaultValue={JSON.parse(user).password}></input>
            <h4 style={{marginTop:'10px'}}>CNP</h4>
            <input id='cnp' name='cnp' onChange={this.handleChange} style={{textAlign:'center', outlineColor:'rgb(220,53,69)'}} defaultValue={JSON.parse(user).cnp}></input>
            <h4 style={{marginTop:'10px'}}>BIRTH DATE</h4>
            <Input id='birthDate' name='birthDate' onChange={this.handleChange} type="date" style={{textAlign:'center', margin:'auto', width:'18%'}} defaultValue={JSON.parse(user).birthDate.substring(0,10)}></Input>
            <h4 style={{marginTop:'10px'}}>ROLE</h4>
            <p style={{textAlign:'center'}}>{JSON.parse(user).role}</p>
            </div>

            <Button style={{marginBottom:'20px'}} size="lg" variant="danger" disabled={!this.state.valid} onClick={this.handleSave}>SAVE</Button>
          {(JSON.parse(localStorage.getItem("loggedUser")).role === "CUSTOMER" ?  <div>
              
                <h3 style={{backgroundColor:'rgb(220,53,69)', color:'white'}}>REGISTERED ADDRESSES
                </h3>
                {(doneAddresses === true ? <div>
                <Button style={{marginBottom:'10px', marginTop:'10px'}} onClick={this.toggleAddForm} variant="outline-danger"> NEW ADDRESS </Button>
                
                {
                    ((addresses.length > 0 && addresses !== undefined) ? 
                         addresses.map((address) => {
                            return( 
                                <div data-aos="fade-up" data-aos-duration="1000" style={{textAlign:'left', marginLeft: '30px', marginBottom:'20px'}}>
    
    
                                    <h4>  
                                          
                                        <b>{address.alias.toString().toUpperCase()}</b>
                                        <Button style={{marginRight:'10px', marginLeft:'10px'}} size="sm" variant="outline-danger"  onClick={() => this.toggleUpdateForm(address)}>EDIT</Button>
                                        
                                    </h4>                                 
    
                                    
                                    <div style={{textAlign:'center', display:'flex', justifyContent:'space-between', marginLeft:'50px', marginRight:'50px'}}>
                                        <div className="zoom-text" style={{display:'inline'}}>
                                        <p style={{marginTop:'10px'}}><b>COUNTRY</b></p>
                                        <hr
                                        style={{
                                            color: 'rgb(220,53,69)',
                                            backgroundColor: 'rgb(220,53,69)',
                                            height: 2
                                        }} />
                                        <p className="text-muted">{address.country}</p>
                                        </div>
                                        <div className="zoom-text" style={{display:'inline'}}>
                                        <p style={{marginTop:'10px'}}><b>COUNTY</b></p>
                                        <hr
                                        style={{
                                            color: 'rgb(220,53,69)',
                                            backgroundColor: 'rgb(220,53,69)',
                                            height: 2
                                        }} />
                                        <p className="text-muted">{address.county}</p>
                                        </div>
    
                                        <div className="zoom-text" style={{display:'inline'}}>
                                        <p style={{marginTop:'10px'}}><b>TOWN</b></p>
                                        <hr
                                        style={{
                                            color: 'rgb(220,53,69)',
                                            backgroundColor: 'rgb(220,53,69)',
                                            height: 2
                                        }} />
                                        <p className="text-muted">{address.town}</p>
                                        </div>
                                        
                                        <div className="zoom-text" style={{display:'inline'}}>
                                        <p style={{marginTop:'10px'}}><b>STREET NUMBER</b></p>
                                        <hr
                                        style={{
                                            color: 'rgb(220,53,69)',
                                            backgroundColor: 'rgb(220,53,69)',
                                            height: 2
                                        }} />
                                        <p className="text-muted">{address.streetNr}</p>
                                        </div>
                                        
                                        <div className="zoom-text" style={{display:'inline'}}>
                                        <p style={{marginTop:'10px'}}><b>COUNTRY CODE</b></p>
                                        <hr
                                        style={{
                                            color: 'rgb(220,53,69)',
                                            backgroundColor: 'rgb(220,53,69)',
                                            height: 2
                                        }} />
                                        <p className="text-muted">{address.countryCode}</p>
                                        </div>
                                    </div>
                                    <br /><br />
                                </div>
                            )
                        })
                            
                    : 
                    <p className="text-muted"> No addresses found </p>
                    )
                }</div>
                : <div style={{marginTop:'30px', marginBottom:'30px'}}> <ReactSpinner  type="border" color="danger" size="2" /></div>)}
            </div> :<div />)
        }
            <h3 style={{backgroundColor:'rgb(220,53,69)', color:'white'}}>REGISTERED EMAILS
            </h3>
            {(doneEmails === true ? 
                <div> 
        <Button style={{marginBottom:'10px', marginTop:'10px'}} onClick={this.toggleAddEmailForm} variant="outline-danger"> NEW EMAIL </Button>
        <div data-aos="fade-up" data-aos-duration="1000">
            <table style={{margin:'auto',width:'60%'}} className="table">
                            <thead>
                            <tr>
                                <th className="text-center">EMAIL ADDRESS</th>
                                <th className="text-center"> ACTIONS </th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                emails.map(
                                    email => 
                                        <tr key={email.emailId}>
                                            <td className="text-center"> {email.email}</td>
                                            <td className="text-center"> <Button onClick={() => this.toggleUpdateEmailForm(email)} style={{margin:'5px'}} variant='outline-danger' size='sm'>EDIT</Button>
                                            <Button onClick={() => this.handleEmailDelete(email.emailId)} style={{margin:'5px'}} variant='danger' size='sm'> <img src={trash} className="logo" style={{width:'20px'}}/></Button></td>
                                        </tr>)
                            }
                            </tbody>
                        </table></div>

                </div>
                : <div style={{marginTop:'30px', marginBottom:'30px'}}> <ReactSpinner  type="border" color="danger" size="2" /></div>)}
            
            <br /><br />
            <Modal isOpen={this.state.selected_update_address} toggle={this.toggleUpdateForm}
                    className={this.props.className} size="lg">
                <ModalHeader toggle={this.toggleUpdateForm} style={{color:'rgb(220,53,69)'}}> Update address </ModalHeader>
                <ModalBody>
                    <AddressUpdateForm address={this.state.selected_address} reloadHandler={this.refresh}/>
                </ModalBody>
            </Modal>

            <Modal isOpen={this.state.selected_add_address} toggle={this.toggleAddForm}
                    className={this.props.className} size="lg">
                <ModalHeader toggle={this.toggleAddForm} style={{color:'rgb(220,53,69)'}}> Create new address </ModalHeader>
                <ModalBody>
                    <AddressCreationForm reloadHandler={this.refresh}/>
                </ModalBody>
            </Modal>

            <Modal isOpen={this.state.selected_update_email} toggle={this.toggleUpdateEmailForm}
                    className={this.props.className} size="lg">
                <ModalHeader toggle={this.toggleUpdateEmailForm} style={{color:'rgb(220,53,69)'}}> Update email </ModalHeader>
                <ModalBody>
                    <EmailUpdateForm email={this.state.selected_email} reloadHandler={this.refresh}/>
                </ModalBody>
            </Modal>

            <Modal isOpen={this.state.selected_add_email} toggle={this.toggleAddEmailForm}
                    className={this.props.className} size="lg">
                <ModalHeader toggle={this.toggleAddEmailForm} style={{color:'rgb(220,53,69)'}}> Create new email </ModalHeader>
                <ModalBody>
                    <EmailCreationForm reloadHandler={this.refresh}/>
                </ModalBody>
            </Modal>
        </div>
        );
    }


}

export default withRouter(UserPage);