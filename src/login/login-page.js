import React from 'react';
import * as API_USERS from "../user/user-api"
import {Button} from "react-bootstrap"
import Home from '../home/home';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            completed: false,
            error: '',
            errorStatus: 0,
            user: {},
            isUserLoaded: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getPath(userRole) {
        console.log(userRole);
        let path_comp = {};
        switch(userRole) {
            /*
            case 'DOCTOR':
                path_comp = {
                    path: '/doctor',
                    comp: PatientContainer
                };
                break;
            case 'PATIENT':
                path_comp = {
                    path: '/patient',
                    comp: PatientPage
                };
                break;
            case 'CAREGIVER':
                path_comp = {
                    path: '/caregiver',
                    comp: CaregiverContainer
                };
                break;*/
            case 'CUSTOMER':
                path_comp = {
                    path: '/',
                    comp: Home
                }
                break;
            default:
                path_comp = {
                    path: '/login',
                    comp: LoginPage
                }
        }

        return path_comp;
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({completed: true, error: ''});
        const {username, password} = this.state;
        if (!username || !password) {
            return;
        }
        let _user = {};
        //let user = login(username, password, userList);
        API_USERS.getUserById(username, (result, status, err) => {
            if (result !== null && status === 200) {
                _user= result;
                console.log(_user);
                localStorage.setItem('loggedUser', JSON.stringify(_user));
                const path = this.getPath(_user.role);
                window.location.href = path.path;
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        })

    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value})
    }

    jumpToRegister() {
        window.location.href = "/register";
    }

    render() {
        const {username, password, completed, error} = this.state;
        return (
            <div>
                <br /><br />
            <div className="col-md-3 col-md-offset-3" style={{margin:'auto'}}>
                <h2 style={{margin:'auto', color:'rgb(255,81,81)'}}>Login
                <small className="text-muted"> to continue.</small>
                </h2><br />
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group'}>
                        <label> Username </label>
                        <input  type={'text'} className={'input-group input-group-sm'} name={'username'} value={username}
                               onChange={this.handleChange}/>
                        {completed && !username &&
                        <div className="error-message">Username is required</div>
                        }
                    </div>
                    <div className={'form-group'}>
                        <label> Password </label>
                        <input type='password' className={'input-group input-group-sm'} name={'password'} value={password}
                               onChange={this.handleChange}/>
                        {
                            completed && !username &&
                            <div className='error-message'>Password is required</div>
                        }
                    </div>
                        <br />
                    <div className={'form-group'}>
                        <Button onClick={this.handleSubmit} style={{margin:'auto', width:'50%'}} className={'btn btn-sm'} variant="outline-danger">
                            Login
                        </Button>
                    </div> <br />
                    <div className={'form-group'}>
                        Don't have an account? <a style={{color:'rgb(255,81,81)'}} href="/register">Register</a>
                    </div>
                </form>

            </div>
            <br /><br /><br /><br /><br />
            </div>

        );
    }
}

export default LoginPage;