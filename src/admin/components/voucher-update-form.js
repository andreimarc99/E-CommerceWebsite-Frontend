import React from 'react';
import validate from "../admin/components/validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import {HOST} from "../commons/hosts"


class VoucherUpdateForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;
        this.voucher = this.props.vocuher;
        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: true,

            formControls: {
                code: {
                    value: '',
                    placeholder: 'Voucher\'s code...',
                    valid: false,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                discount: {
                    value: '',
                    placeholder: 'Voucher\'s discount...',
                    valid: false,
                    touched: true,
                    validationRules: {
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

    updateReview(review) {
        const putMethod = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'voucherId': voucher.voucherId,
                    'code': voucher.code,
                    'discount': voucher.discount,
                    'startDate': voucher.startDate,
                    'endDate': voucher.endDate,
                    'oneTimeOnly': isOneTimeOnly
                }
            )
        }

        fetch(HOST.backend_api + '/vouchers', putMethod)
            .then(response => response.json())
            .catch(err => console.log(err));
        this.reloadHandler();
    }

    handleSubmit() {
        let voucherId = 0, code = null, discount = null, startDate = null, endDate = null;
        voucherId = this.voucher.voucherId;
        let user = this.review.customer;
        let product = this.review.product;

        if (this.state.formControls.message.value === undefined || this.state.formControls.message.value === '') {
            message = this.review.message;
        } else {
            message = this.state.formControls.message.value;
        }
        if (this.state.formControls.rating.value === undefined || this.state.formControls.rating.value === '') {
            rating = this.review.rating;
        } else {
            rating = this.state.formControls.rating.value;
        }

        let review = {
            voucherId: voucher.voucherId,
            code: voucher.code,
            discount: voucher.discount,
            startDate: voucher.startDate,
            endDate: voucher.endDate,
            oneTimeOnly: isOneTimeOnly
        };

        this.updateReview(review);
    }

    render() {

        return (
            <div>
                <FormGroup id='message'>
                    <Label for='messageField'> Message </Label>
                    <Input name='message' id='messageField' placeholder={this.state.formControls.message.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.review.message}
                           touched={this.state.formControls.message.touched? 1 : 0}
                           valid={this.state.formControls.message.valid}
                           required
                    />
                    {this.state.formControls.message.touched && !this.state.formControls.message.valid &&
                    <div className={"error-message"}> * Message not valid </div>}
                </FormGroup>

                <FormGroup id='rating'>
                    <Label for='ratingField'> Rating </Label>
                    <Input name='rating' id='ratingField' placeholder={this.state.formControls.rating.placeholder}
                           onChange={this.handleChange}
                           type="number"
                           defaultValue={this.review.rating}
                           touched={this.state.formControls.rating.touched? 1 : 0}
                           valid={this.state.formControls.rating.valid}
                           required
                    />
                    {this.state.formControls.rating.touched && !this.state.formControls.rating.valid &&
                    <div className={"error-message"}> * Rating not valid </div>}
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

export default VoucherUpdateForm;