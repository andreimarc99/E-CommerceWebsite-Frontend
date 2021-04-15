import React from 'react';
import {withRouter} from "react-router-dom";
import male from "../../img/male.png"
import female from "../../img/female.png"
import {Input} from 'reactstrap'
import {Button} from 'react-bootstrap'
import {HOST} from "../../commons/hosts"
import * as API_USERS from "../user-api"

class UserPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            user: this.props.location.state.user,
            valid: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
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
            .then(response => response.json())
            .then(data => data ? JSON.parse(data) : {})
            .catch(err => console.log(err));

        let _user = {};

        API_USERS.getUserById(username, (result, status, err) => {
            if (result !== null && status === 200) {
                _user = result;
                document.getElementById("name").value = JSON.parse(JSON.stringify(_user)).firstName.concat(JSON.parse(JSON.stringify(_user)).lastName);
                document.getElementById("firstName").value = JSON.parse(JSON.stringify(_user)).firstName;
                document.getElementById("lastName").value = JSON.parse(JSON.stringify(_user)).lastName;
                document.getElementById("password").value = JSON.parse(JSON.stringify(_user)).password;
                document.getElementById("cnp").value = JSON.parse(JSON.stringify(_user)).cnp;
                console.log(_user);
                this.setState({user: JSON.stringify(_user)});
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        })

    }

    handleChange = event => {
        if (document.getElementById('firstName').value.length < 3 || document.getElementById('lastName').value.length < 3 || document.getElementById('password').value.length < 3 || document.getElementById('cnp').value.length !== 13) {
            this.setState({valid: false});
        } else {
            this.setState({valid: true});
        }
    };

    render() {
        const {user} = this.state;
        console.log(user);
        return (
        <div>
            <br />
            {(JSON.parse(user).gender === "M" ? <img src={male} style={{width:'20%'}}></img> : <img src={female} style={{width:'20%'}}></img>)}
            
            <h1 id="name" style={{backgroundColor:'rgb(255,81,81)', color:'white'}}>{JSON.parse(user).firstName} {JSON.parse(user).lastName}</h1>
            <p className="text-muted">@{JSON.parse(user).username}</p>

            <div>
            <h4 style={{marginTop:'10px'}}>First Name</h4>
            <input id='firstName' name='firstName' onChange={this.handleChange} style={{textAlign:'center', outlineColor:'rgb(255,81,81)'}} defaultValue={JSON.parse(user).firstName}></input>
            <h4 style={{marginTop:'10px'}}>Last Name</h4>
            <input id='lastName' name='lastName' onChange={this.handleChange} style={{textAlign:'center', outlineColor:'rgb(255,81,81)'}} defaultValue={JSON.parse(user).lastName}></input>
            <h4 style={{marginTop:'10px'}}>Password</h4>
            <input id='password' name='password' onChange={this.handleChange} style={{textAlign:'center', outlineColor:'rgb(255,81,81)'}} defaultValue={JSON.parse(user).password}></input>
            
            <h4 style={{marginTop:'10px'}}>Birth Date</h4>
            <Input id='birthDate' name='birthDate' onChange={this.handleChange} type="date" style={{margin:'auto', width:'20%'}} defaultValue={JSON.parse(user).birthDate.substring(0,10)}></Input>
            <h4 style={{marginTop:'10px'}}>CNP</h4>
            <input id='cnp' name='cnp' onChange={this.handleChange} style={{textAlign:'center', outlineColor:'rgb(255,81,81)'}} defaultValue={JSON.parse(user).cnp}></input>
            <h4 style={{marginTop:'10px'}}>Role</h4>
            <p style={{textAlign:'center'}}>{JSON.parse(user).role}</p>
            </div>

            <Button size="lg" variant="danger" disabled={!this.state.valid} onClick={this.handleSave}>Save</Button>
            <br /><br />
        </div>
        );
    }


}

export default withRouter(UserPage);