import React from 'react';
import validate from "../../admin/components/validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import {HOST} from "../../commons/hosts"
import * as CUSTOMER_API from "../../user/customer-api"


class ComplaintCreationForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;
        this.state = {
            customer: {},

            errorStatus: 0,
            error: null,

            formIsValid: true,

            formControls: {
                message: {
                    value: '',
                    placeholder: 'Your message...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 5,
                        isRequired: true
                    }
                },
                type: {
                    value: '',
                    placeholder: 'Complaint reason...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        isRequired: true,
                        minLength: 3
                    }
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.fetchCustomer();
    }

    fetchCustomer() {
        return CUSTOMER_API.getCustomerByUsername(JSON.parse(localStorage.getItem("loggedUser")).username, (result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    customer: result
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        })
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

    postReview(complaint) {
        const postMethod = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'message': complaint.message,
                    'customer': complaint.customer,
                    'type': complaint.type,
                }
            )
        }

        fetch(HOST.backend_api + '/complaints', postMethod)
            .then(response => window.location.reload())
            .catch(err => console.log(err));
        this.reloadHandler();
    }

    handleSubmit() {
        let message = null, type = null;
        message = this.state.formControls.message.value;
        type = this.state.formControls.type.value;

        const {customer} = this.state;
        let review = {
            customer: customer,
            message: message, 
            type: type
        };

        this.postReview(review);
    }

    render() {

        return (
            <div>

                
                <FormGroup id='type'>
                    <Label for='typeField'> Reason </Label>
                    <Input name='type' id='typeField' placeholder={this.state.formControls.type.placeholder}
                           onChange={this.handleChange}
                           touched={this.state.formControls.type.touched? 1 : 0}
                           valid={this.state.formControls.type.valid}
                           required
                    />
                    {this.state.formControls.type.touched && !this.state.formControls.type.valid &&
                    <div className={"error-message"}> * Reason not valid </div>}
                </FormGroup>
                
                <FormGroup id='message'>
                    <Label for='messageField'> Message </Label>
                    <Input name='message' id='messageField' placeholder={this.state.formControls.message.placeholder}
                           onChange={this.handleChange}
                           touched={this.state.formControls.message.touched? 1 : 0}
                           valid={this.state.formControls.message.valid}
                           required
                    />
                    {this.state.formControls.message.touched && !this.state.formControls.message.valid &&
                    <div className={"error-message"}> * Message not valid </div>}
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

export default ComplaintCreationForm;