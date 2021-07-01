import React from 'react';
import validate from "./validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import {HOST} from "../../commons/hosts"

class BanUpdateForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;
        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: true,
            oneTimeOnly: 'NO',

            formControls: {
                reason: {
                    value: '',
                    placeholder: 'Ban reason...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                startDate: {
                    value: '',
                    placeholder: 'Ban\'s start date...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        isRequired: true
                    }
                },
                endDate: {
                    value: '',
                    placeholder: 'Ban\'s end date...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        isRequired: true
                    }
                }
            }
        };

        this.ban = this.props.ban;
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

    updateBan(ban) {
        const putMethod = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'banId': ban.banId,
                    'reason': ban.reason,
                    'startDate': ban.startDate,
                    'endDate': ban.endDate,
                    'user': this.ban.user
                }
            )
        }

        fetch(HOST.backend_api + '/user_bans', putMethod)
            .then(response => console.log(response))
            .catch(err => console.log(err));
        this.reloadHandler();
    }

    handleSubmit() {
        let banId = 0, reason = null, startDate = null, endDate = null;
        banId = this.ban.banId;

        if (this.state.formControls.reason.value === undefined || this.state.formControls.reason.value === '') {
            reason = this.ban.reason;
        } else {
            reason = this.state.formControls.reason.value;
        }
        if (this.state.formControls.startDate.value === undefined || this.state.formControls.startDate.value === '') {
            startDate = this.ban.startDate;
        } else {
            startDate = this.state.formControls.startDate.value;
        }
        if (this.state.formControls.endDate.value === undefined || this.state.formControls.endDate.value === '') {
            endDate = this.ban.endDate;
        } else {
            endDate = this.state.formControls.endDate.value;
        }

        let b = {
            banId: banId,
            reason: reason,
            startDate: startDate,
            endDate: endDate
        };
        this.updateBan(b);
    }

    render() {
        const ban = this.ban;
        console.log(ban);

        return (
            <div>
                <FormGroup id='reason'>
                    <Label for='reasonField'> Reason </Label>
                    <Input name='reason' id='reasonField' placeholder={this.state.formControls.reason.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.ban.reason}
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
                           defaultValue={this.ban.startDate.substring(0,10)}
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
                           defaultValue={this.ban.endDate.substring(0,10)}
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

export default BanUpdateForm;