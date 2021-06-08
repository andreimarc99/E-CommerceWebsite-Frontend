import React from "react";
import Select from "react-select";
import validate from "../admin/components/validator";
import {FormGroup, Input, Label} from "reactstrap";
import * as API_USERS from "../user/user-api"
import { Button } from "react-bootstrap";
import {HOST} from "../commons/hosts"

function isEmpty(item) {
    for(const p in item) {
        if(item.hasOwnProperty(p)) {
            return false;
        }
    }

    return JSON.stringify(item) === JSON.stringify({});
}

class RegisterContainer extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.handleGenderChange = this.handleGenderChange.bind(this);
        this.state = {
            completed: false,
            error: '',
            errorStatus: 0,
            userList: [],
            formIsValid: false,
            role: 'CUSTOMER',
            gender: 'M',
            dateHired: '',
            formControls: {
                username: {
                    value: '',
                    placeholder: 'Username...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                password: {
                    value: '',
                    placeholder: 'Password...',
                    valid: false,
                    touched: false,
                    type: "password",
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                firstName: {
                    value: '',
                    placeholder: 'First name...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                lastName: {
                    value: '',
                    placeholder: 'Last name...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                cnp: {
                    value: '',
                    placeholder: 'CNP...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 12,
                        isRequired: true
                    }
                },
                birthDate: {
                    value: '',
                    type: "date",
                    placeholder: 'Birth Date...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true
                    }
                },
                dateHired: {
                    value: '',
                    type: "date",
                    placeholder: 'Hiring Date...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        isRequired: false
                    }
                }
            }
        };
    }

    componentDidMount() {
        API_USERS.getUsers((result, status, err) => {

            if (result !== null && status === 200) {
                this.setState({
                    userList: result
                });
            } else {
                this.setState(({
                    error: status
                }));
            }
        });
    }

    handleChange = event => {

        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = this.state.formControls;

        const updatedFormElement = updatedControls[name];

        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);
        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (let updatedFormElementName in updatedControls) {
            formIsValid = updatedControls[updatedFormElementName].valid && formIsValid;
        }

        this.setState({
            formControls: updatedControls,
            formIsValid: formIsValid
        });

    };

    handleSelectionChange = role => {
        this.setState({role: role.value})
    }
    handleGenderChange = gender => {
        this.setState({gender: gender.value})
    }

    registerCustomer(customer) {
        /*CUSTOMER_API.postCustomer(customer, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted customer with id: " + result);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });

        CUSTOMER_API.getCustomerByUsername(customer.username, (res, st, err) => {
            if (res !== null && (st === 200 || st === 201)) {
                let cart = {
                    customer: res,
                    products: [],
                    fullPrice: 0
                }
                console.log(cart);
                CART_API.postCart(cart, (r, s, e) => {
                    if (r !== null && (s === 200 || s === 201)) {
                        console.log("Successfully inserted cart with id: " + r);
                    } else {
                        this.setState(({
                            errorStatus: s,
                            error: e
                        }));
                    }
                });

                let fav = {
                    customer: res,
                    products: []
                }

                FAVORITE_PRODUCTS_API.postFavoriteProducts(fav, (r, s, e) => {
                    if (r !== null && (s === 200 || s === 201)) {
                        console.log("Successfully inserted fav_prod with id: " + r);
                    } else {
                        this.setState(({
                            errorStatus: s,
                            error: e
                        }));
                    }
                });
            } else {
                this.setState(({
                    errorStatus: st,
                    error: err
                }));
            }
        });*/
        const postMethod = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'username': customer.username,
                    'password': customer.password,
                    'role': 'CUSTOMER',
                    'CNP': customer.CNP,
                    'birthDate': customer.birthDate,
                    'firstName': customer.firstName,
                    'lastName': customer.lastName,
                    'gender': customer.gender,
                    'dateJoined': customer.dateJoined
                }
            )
        }

        fetch(HOST.backend_api + '/customers', postMethod)
            .then(response => {
                fetch(HOST.backend_api + '/customers/' + customer.username)
                .then(resp => resp.json())
                .then(data => {
                    console.log(data);
                    const postCartMethod = {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(
                            {
                                'products': [],
                                'customer': data,
                                'fullPrice': 0
                            }
                        )
                    }
                    fetch(HOST.backend_api + '/carts', postCartMethod)
                    .then(r => {
                        const postFavProdsMethod = {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify(
                                {
                                    'customer': data,
                                    'products': []
                                }
                            )
                        }
                        fetch(HOST.backend_api + '/favorite_products', postFavProdsMethod)
                        .then(rs => {window.location.href = '/login'})
                        .catch(e => console.log(e));
                })
            })
                .catch(er => console.log(er));
            })
            .catch(err => console.log(err));
    }
    
    registerAdmin(admin) {
        /*return ADMIN_API.postAdmin(admin, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted admin with id: " + result);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });*/
        const postMethod = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'username': admin.username,
                    'password': admin.password,
                    'role': 'ADMIN',
                    'CNP': admin.CNP,
                    'birthDate': admin.birthDate,
                    'firstName': admin.firstName,
                    'lastName': admin.lastName,
                    'gender': admin.gender,
                    'dateHired': admin.dateHired,
                    'salary': 1
                }
            )
        }
        fetch(HOST.backend_api + '/admins', postMethod)
            .then(rs => {window.location.href = '/login'})
            .catch(e => console.log(e));
    }

    registerDeliveryGuy(delivery_guy) {
        /*return DELIVERY_GUY_API.postDeliveryGuy(delivery_guy, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted delivery guy with id: " + result);
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });*/

        const postMethod = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'username': delivery_guy.username,
                    'password': delivery_guy.password,
                    'role': 'DELIVERY_GUY',
                    'CNP': delivery_guy.CNP,
                    'birthDate': delivery_guy.birthDate,
                    'firstName': delivery_guy.firstName,
                    'lastName': delivery_guy.lastName,
                    'gender': delivery_guy.gender,
                    'dateHired': delivery_guy.dateHired,
                    'salary': 1
                }
            )
        }
        fetch(HOST.backend_api + '/delivery_guys', postMethod)
            .then(rs => {window.location.href = '/login'})
            .catch(e => console.log(e));
    }


    handleSubmit() {
        const {userList} = this.state;
        let unique = true;
        for (let i = 0; i < userList.length; ++i) {
            if (userList[i].username === this.state.formControls.username.value) {
                unique = false;
                break;
            }
        }
        var dateHired = this.state.formControls.dateHired.value;
        if (!unique) {
            alert("Username is taken. Try again.");
        } else {
            console.log(this.state.formControls);
            
            switch (this.state.role) {
                case 'ADMIN':
                    if (dateHired === '') {
                        dateHired = new Date().toJSON().slice(0,10);
                    }
                    console.log("Date hired: " + dateHired);
                    let admin = {
                        username: this.state.formControls.username.value,
                        password: this.state.formControls.password.value,
                        firstName: this.state.formControls.firstName.value,
                        lastName: this.state.formControls.lastName.value,
                        birthDate: this.state.formControls.birthDate.value,
                        CNP: this.state.formControls.cnp.value,
                        gender: this.state.gender,
                        role: 'ADMIN',
                        dateHired: dateHired
                    };
                    this.registerAdmin(admin);                    
                    //window.location.href = '/login';
                    break;
                case 'CUSTOMER':
                    let customer = {
                        username: this.state.formControls.username.value,
                        password: this.state.formControls.password.value,
                        firstName: this.state.formControls.firstName.value,
                        lastName: this.state.formControls.lastName.value,
                        birthDate: this.state.formControls.birthDate.value,
                        CNP: this.state.formControls.cnp.value,
                        gender: this.state.gender,
                        role: 'CUSTOMER',
                        dateJoined: new Date().toJSON().slice(0,10)
                    };
                    this.registerCustomer(customer);
                    //window.location.href = '/login';
                    break;
                case 'DELIVERY_GUY':
                    if (dateHired === '') {
                        dateHired = new Date().toJSON().slice(0,10);
                    }
                    let delivery_guy = {
                        username: this.state.formControls.username.value,
                        password: this.state.formControls.password.value,
                        firstName: this.state.formControls.firstName.value,
                        lastName: this.state.formControls.lastName.value,
                        birthDate: this.state.formControls.birthDate.value,
                        CNP: this.state.formControls.cnp.value,
                        gender: this.state.gender,
                        role: 'DELIVERY_GUY',
                        dateHired: dateHired
                    };
                    this.registerDeliveryGuy(delivery_guy);
                   //window.location.href = '/login';
                    break;
                default:
                    break;
            }
        }
    }

    render() {
        const {role} = this.state;
        const roles = [];
        roles.push({value: 'ADMIN', label: 'ADMIN'});
        roles.push({value: 'CUSTOMER', label: 'CUSTOMER'});
        roles.push({value: 'DELIVERY_GUY', label: 'DELIVERY GUY'});

        const defaultRole = roles[1];

        const genders = [];
        genders.push({value: "M", label: "Male"});
        genders.push({value: "F", label: "Female"});
        const defaultGender = genders[0];
        return (
            <div>
                <br />
                <h2 style={{margin:'auto', color:'rgb(220,53,69)'}}>Register
                <small className="text-muted"> to continue.</small>
                </h2><br />
                <FormGroup id='username' style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                    <Label for='usernameField'> USERNAME </Label>
                    <Input style={{textAlign:'center'}}  name='username' id='usernameField' placeholder={this.state.formControls.username.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.username.value}
                           touched={this.state.formControls.username.touched? 1 : 0}
                           valid={this.state.formControls.username.valid}
                           required
                    />
                    {this.state.formControls.username.touched && !this.state.formControls.username.valid &&
                    <div className={"error-message"}> * Username not valid </div>}
                </FormGroup>

                <FormGroup id='password' style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                    <Label for='passwordField'> PASSWORD </Label>
                    <Input style={{textAlign:'center'}}  name='password' id='passwordField' placeholder={this.state.formControls.password.placeholder}
                           type="password"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.password.value}
                           touched={this.state.formControls.password.touched? 1 : 0}
                           valid={this.state.formControls.password.valid}
                           required
                    />
                    {this.state.formControls.password.touched && !this.state.formControls.password.valid &&
                    <div className={"error-message"}> * Password not valid </div>}
                </FormGroup>

                <FormGroup id='firstName' style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                    <Label for='firstNameField'> FIRST NAME </Label>
                    <Input style={{textAlign:'center'}}  name='firstName' id='firstNameField' placeholder={this.state.formControls.firstName.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.firstName.value}
                           touched={this.state.formControls.firstName.touched? 1 : 0}
                           valid={this.state.formControls.firstName.valid}
                           required
                    />
                    {this.state.formControls.firstName.touched && !this.state.formControls.firstName.valid &&
                    <div className={"error-message"}> * First Name not valid </div>}
                </FormGroup>

                <FormGroup id='lastName' style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                    <Label for='lastNameField'> LAST NAME </Label>
                    <Input style={{textAlign:'center'}}  name='lastName' id='lastNameField' placeholder={this.state.formControls.lastName.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.lastName.value}
                           touched={this.state.formControls.lastName.touched? 1 : 0}
                           valid={this.state.formControls.lastName.valid}
                           required
                    />
                    {this.state.formControls.lastName.touched && !this.state.formControls.lastName.valid &&
                    <div className={"error-message"}> * Last Name not valid </div>}
                </FormGroup>

                <FormGroup id='cnp' style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                    <Label for='cnpField'> CNP </Label>
                    <Input style={{textAlign:'center'}}  name='cnp' id='cnpField' placeholder={this.state.formControls.cnp.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.cnp.value}
                           touched={this.state.formControls.cnp.touched? 1 : 0}
                           valid={this.state.formControls.cnp.valid}
                           required
                    />
                    {this.state.formControls.cnp.touched && !this.state.formControls.cnp.valid &&
                    <div className={"error-message"}> * CNP not valid </div>}
                </FormGroup>

                <FormGroup id='birthDate' style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                    <Label for='birthDateField'> BIRTH DATE </Label>
                    <Input style={{textAlign:'center'}}  name='birthDate' id='birthDateField' placeholder={this.state.formControls.birthDate.placeholder}
                           type="date"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.birthDate.value}
                           touched={this.state.formControls.birthDate.touched? 1 : 0}
                           valid={this.state.formControls.birthDate.valid}
                           required
                    />
                    {this.state.formControls.birthDate.touched && !this.state.formControls.birthDate.valid &&
                    <div className={"error-message"}> * Birth date not valid </div>}
                </FormGroup>

                <div className="form-group" style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                    <label>GENDER</label>
                    <Select theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                ...theme.colors,
                                                    text: 'white',
                                                    primary25: 'rgb(220,53,69)',
                                                    primary: 'rgb(220,53,69)',
                                                },})} options={genders} defaultValue={defaultGender} onChange={this.handleGenderChange}/>
                    {isEmpty(role) &&
                    <div className="help">Gender is required</div>}
                </div>

                <div className="form-group" style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                    <label>ROLE</label>
                    <Select theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                ...theme.colors,
                                                    text: 'white',
                                                    primary25: 'rgb(220,53,69)',
                                                    primary: 'rgb(220,53,69)',
                                                },})} options={roles} defaultValue={defaultRole} onChange={this.handleSelectionChange}/>
                    {isEmpty(role) &&
                    <div className="help">Role is required</div>}
                </div>

                

                {
                    (role === "ADMIN" || role === "DELIVERY_GUY" ? 
                    <div>
                        <FormGroup id='dateHired' style={{marginLeft: "auto", marginRight:"auto", width:'300px'}}>
                        <Label for='dateHiredField'> DATE HIRED </Label>
                        <Input name='dateHired' id='dateHiredField' placeholder={this.state.formControls.dateHired.placeholder}
                            type="date"
                            onChange={this.handleChange}
                            defaultValue={this.state.formControls.dateHired.value}
                            touched={this.state.formControls.dateHired.touched? 1 : 0}
                            valid={this.state.formControls.dateHired.valid}
                            required
                        />
                        {this.state.formControls.dateHired.touched && !this.state.formControls.dateHired.valid &&
                        <div className={"error-message"}> * Date hired not valid </div>}
                        </FormGroup>
                    </div> 
                    :
                    <div />
                    )
                }
                <br />

                <Button variant="danger" onClick={this.handleSubmit} disabled={!this.state.formIsValid} style={{marginLeft: "auto", marginRight:"auto", width:'300px'}} type="submit" className="btn btn-dark btn-lg btn-block">REGISTER</Button>
                <p className="forgot-password">
                    Already registered? <a style={{color:'red'}} href="/login">Log in.</a>
                </p>
            </div>
        );
    }
};

export default RegisterContainer;