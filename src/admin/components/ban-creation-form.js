import React from 'react';
import validate from "./validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import {HOST} from "../../commons/hosts"
import axios from 'axios';

class BanCreationForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;
        
        this.review = this.props.review;

        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: true,

            formControls: {
                reason: {
                    value: '',
                    placeholder: 'Ban reason...',
                    valid: false,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        maxLength: 254,
                        isRequired: true
                    }
                },
                startDate: {
                    value: '',
                    placeholder: 'Voucher\'s start date...',
                    valid: false,
                    touched: true,
                    validationRules: {
                        isRequired: true
                    }
                },
                endDate: {
                    value: '',
                    placeholder: 'Voucher\'s end date...',
                    valid: false,
                    touched: true,
                    validationRules: {
                        isRequired: true
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

    postBan(ban) {
        const postMethod = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'reason': ban.reason,
                    'startDate': ban.startDate,
                    'endDate': ban.endDate,
                    'user': this.review.customer.user
                }
            )
        }
        console.log(postMethod.body);

        fetch(HOST.backend_api + '/user_bans', postMethod)
            .then(response => {
                fetch(HOST.backend_api + "/reviews/" + this.review.reviewId, {method: 'DELETE'})
                .then(resp => window.location.reload());
            })
            .catch(err => console.log(err));
        //this.reloadHandler();
    }

    handleSubmit() {
        let reason = this.state.formControls.reason.value;
        let startDate = this.state.formControls.startDate.value;
        let endDate = this.state.formControls.endDate.value;


        let ban = {
            reason: reason,
            startDate: startDate,
            endDate: endDate            
        };

        this.postBan(ban);
    }

    render() {
        return (
            <div>
                <FormGroup id='reason'>
                    <Label for='reasonField'> Reason </Label>
                    <Input name='reason' id='reasonField' placeholder={this.state.formControls.reason.placeholder}
                           onChange={this.handleChange}
                           touched={this.state.formControls.reason.touched? 1 : 0}
                           valid={this.state.formControls.reason.valid}
                           required
                    />
                    {this.state.formControls.reason.touched && !this.state.formControls.reason.valid &&
                    <div className={"error-message"}> Reason not valid </div>}
                </FormGroup>

                <FormGroup id='startDate'>
                    <Label for='startDateField'> Start Date </Label>
                    <Input name='startDate' id='startDateField' placeholder={this.state.formControls.startDate.placeholder}
                           type="date"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.startDate.value}
                           touched={this.state.formControls.startDate.touched? 1 : 0}
                           valid={this.state.formControls.startDate.valid}
                           required
                    />
                    {this.state.formControls.startDate.touched && !this.state.formControls.startDate.valid &&
                    <div className={"error-message"}> Start date not valid </div>}
                </FormGroup>

                <FormGroup id='endDate'>
                    <Label for='endDateField'> End Date </Label>
                    <Input name='endDate' id='endDateField' placeholder={this.state.formControls.endDate.placeholder}
                           type="date"
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.endDate.value}
                           touched={this.state.formControls.endDate.touched? 1 : 0}
                           valid={this.state.formControls.endDate.valid}
                           required
                    />
                    {this.state.formControls.endDate.touched && !this.state.formControls.endDate.valid &&
                    <div className={"error-message"}> End date not valid </div>}
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

export default BanCreationForm;