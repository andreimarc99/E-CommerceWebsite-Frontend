import React from 'react';
import validate from "../../admin/components/validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import {HOST} from "../../commons/hosts"


class EmailUpdateForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;
        this.email = this.props.email;
        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: true,

            formControls: {
                email: {
                    value: '',
                    placeholder: 'Alias...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        isRequired: true,
                        email: true
                    }
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    updateEmail(e) {
        const putMethod = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'emailId': e.emailId,
                    'user': e.user,
                    'email': e.email
                }
            )
        }
        console.log(putMethod.body);

        fetch(HOST.backend_api + '/emails', putMethod)
            .then(response => response.json())
            .then(data => data ? JSON.parse(data) : {})
            .catch(err => console.log(err));
        this.reloadHandler();
    }

    handleSubmit() {
        let emailId = 0, email = null;
        let user = JSON.parse(localStorage.getItem("loggedUser"));
        emailId = this.email.emailId;

        if (this.state.formControls.email.value === undefined || this.state.formControls.email.value === '') {
            email = this.address.email;
        } else {
            email = this.state.formControls.email.value;
        }
        let e = {
            emailId: emailId,
            user: user,
            email: email,
        };

        console.log(e);
        this.updateEmail(e);
    }

    render() {

        return (
            <div>
                <FormGroup id='email'>
                    <Label for='emailField'> Alias </Label>
                    <Input name='email' id='emailField' placeholder={this.state.formControls.email.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.email.email}
                           touched={this.state.formControls.email.touched? 1 : 0}
                           valid={this.state.formControls.email.valid}
                           required
                    />
                    {this.state.formControls.email.touched && !this.state.formControls.email.valid &&
                    <div className={"error-message"}> * Email not valid </div>}
                </FormGroup>

                <Row>
                    <Col>
                        <Button variant="danger" style={{float:'right'}} type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>  Submit </Button>
                    </Col>
                </Row>

            </div>
        ) ;
    }
}

export default EmailUpdateForm;