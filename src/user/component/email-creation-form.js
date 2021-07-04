import React from 'react';
import validate from "../../admin/components/validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import {HOST} from "../../commons/hosts"


class EmailCreationForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;
        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                email: {
                    value: '',
                    placeholder: 'Alias...',
                    valid: false,
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

    addEmail(e) {
        const postMethod = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'email': e.email,
                    'user': e.user
                }
            )
        }

        fetch(HOST.backend_api + '/emails', postMethod)
            .then(response => response.json())
            .then(data => {window.location.reload()})
            .catch(err => console.log(err));
    }

    handleSubmit() {
        let email = null;

        if (this.state.formControls.email.value !== undefined && this.state.formControls.email.value !== '') {
            email = this.state.formControls.email.value;
        }

        let e = {
            user: JSON.parse(localStorage.getItem("loggedUser")),
            email: email
        };

        this.addEmail(e);
    }

    render() {

        return (
            <div>
                <FormGroup id='email'>
                    <Label for='emailField'> E-mail Address </Label>
                    <Input name='email' id='emailField' placeholder={this.state.formControls.email.placeholder}
                           onChange={this.handleChange}
                           touched={this.state.formControls.email.touched? 1 : 0}
                           valid={this.state.formControls.email.valid}
                           required
                    />
                    {this.state.formControls.email.touched && !this.state.formControls.email.valid &&
                    <div className={"error-message"}> Email not valid </div>}
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

export default EmailCreationForm;