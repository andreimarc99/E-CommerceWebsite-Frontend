import React from 'react';
import * as API_USERS from "../user/user-api"
import {Button, Form} from "react-bootstrap"
import Home from '../home/home';
import ProductStockPage from '../admin/components/product-stock-page';
import axios from 'axios';
import { HOST } from '../commons/hosts';

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
            case 'CUSTOMER':
                path_comp = {
                    path: '/',
                    comp: Home
                }
                break;
            case 'ADMIN':
                path_comp = {
                    path: '/product_stock_page',
                    comp: ProductStockPage
                }
                break;
            case 'DELIVERY_GUY':
                path_comp = {
                    path: '/orders_delivery_page',
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
        axios.post(HOST.backend_api + '/users/login/' + username + '/' + password)
        .then(response => {
            _user = response.data;
            localStorage.setItem('loggedUser', JSON.stringify(_user));
            const path = this.getPath(_user.role);
            return window.location.href = path.path;
        })
        .catch(err => this.setState({error: 'wrong'}));

    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value})
    }

    jumpToRegister() {
        window.location.href = "/register";
    }

    render() {
        const {username, password, completed} = this.state;
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
                        <input style={{textAlign:'center'}} type={'text'} className={'input-group input-group-sm'} name={'username'} value={username}
                               onChange={this.handleChange}/>
                        {completed && !username &&
                        <div className="error-message">Username is required</div>
                        }
                    </div>
                    <div className={'form-group'}>
                        <label> Password </label>
                        <input style={{textAlign:'center'}} type='password' className={'input-group input-group-sm'} name={'password'} value={password}
                               onChange={this.handleChange}/>
                        {
                            completed && !username &&
                            <div className='error-message'>Password is required</div>
                        }
                    </div>
                    <div id={this.state.wrong}>
                    {(this.state.error === "wrong") ? <p style={{color:'red'}}> Incorrect credentials. Please try again </p> : <div/>}
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