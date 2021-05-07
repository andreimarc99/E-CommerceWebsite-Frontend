import React from 'react';
import validate from "./validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import {HOST} from "../../commons/hosts"
import axios from 'axios';
import Select from "react-select";

function isEmpty(item) {
    for(const p in item) {
        if(item.hasOwnProperty(p)) {
            return false;
        }
    }

    return JSON.stringify(item) === JSON.stringify({});
}

class VoucherCreationForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;
        this.state = {

            errorStatus: 0,
            error: null,
            oneTimeOnly: 'yes',

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

    postVoucher(voucher) {
        var isOneTimeOnly = true;
        const oneTimeOnly = voucher.oneTimeOnly;
        if (oneTimeOnly === "no") {
            isOneTimeOnly = false;
        }
        const postMethod = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'code': voucher.code,
                    'discount': voucher.discount,
                    'startDate': voucher.startDate,
                    'endDate': voucher.endDate,
                    'oneTimeOnly': isOneTimeOnly
                }
            )
        }
        console.log(postMethod.body);

        fetch(HOST.backend_api + '/vouchers', postMethod)
            .then(response => window.location.refresh())
            .catch(err => console.log(err));
        //this.reloadHandler();
    }

    handleSubmit() {
        let code = this.state.formControls.code.value;
        let discount = this.state.formControls.discount.value;
        let startDate = this.state.formControls.startDate.value;
        let endDate = this.state.formControls.endDate.value;
        let oneTimeOnly = this.state.oneTimeOnly;


        let voucher = {
            code: code,
            discount: discount,
            startDate: startDate,
            endDate: endDate,
            oneTimeOnly: oneTimeOnly
            
        };

        this.postVoucher(voucher);
    }

    
    handleOneTimeOnlyChange = option => {
        this.setState({oneTimeOnly: option.value})
    }

    render() {
        const {oneTimeOnly} = this.state;
        return (
            <div>
                <FormGroup id='code'>
                    <Label for='codeField'> Code </Label>
                    <Input name='code' id='codeField' placeholder={this.state.formControls.code.placeholder}
                           onChange={this.handleChange}
                           touched={this.state.formControls.code.touched? 1 : 0}
                           valid={this.state.formControls.code.valid}
                           required
                    />
                    {this.state.formControls.code.touched && !this.state.formControls.code.valid &&
                    <div className={"error-message"}> * Code not valid </div>}
                </FormGroup>

                <FormGroup id='discount'>
                    <Label for='discountField'> Discount </Label>
                    <Input name='discount' id='discountField' placeholder={this.state.formControls.discount.placeholder}
                           onChange={this.handleChange}
                           type="number"
                           touched={this.state.formControls.discount.touched? 1 : 0}
                           valid={this.state.formControls.discount.valid}
                           required
                    />
                    {this.state.formControls.discount.touched && !this.state.formControls.discount.valid &&
                    <div className={"error-message"}> * Discount not valid </div>}
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
                    <div className={"error-message"}> * Start date not valid </div>}
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
                    <div className={"error-message"}> * End date not valid </div>}
                </FormGroup>

                <div className="form-group">
                    <label>One Time Only</label>
                    <Select theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                ...theme.colors,
                                                    text: 'white',
                                                    primary25: 'rgb(255,81,81)',
                                                    primary: 'rgb(255,81,81)',
                                                },})} options={[{value: 'yes', label: 'Yes'}, {value: 'no', label: 'No'}]} defaultValue={{value: 'yes', label: 'Yes'}} onChange={this.handleOneTimeOnlyChange}/>
                    {isEmpty(oneTimeOnly) &&
                    <div className="help">This field is required</div>}
                </div>

                <Row>
                    <Col>
                        <Button variant="danger" style={{float:'right'}} type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>  Submit </Button>
                    </Col>
                </Row>

            </div>
        ) ;
    }
}

export default VoucherCreationForm;