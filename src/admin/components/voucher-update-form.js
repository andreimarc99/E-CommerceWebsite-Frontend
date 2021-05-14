import React from 'react';
import validate from "./validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import {HOST} from "../../commons/hosts"
import Select from 'react-select';

class VoucherUpdateForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;
        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: true,
            oneTimeOnly: 'NO',

            formControls: {
                code: {
                    value: '',
                    placeholder: 'Voucher\'s code...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                discount: {
                    value: '',
                    placeholder: 'Voucher\'s discount...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        isRequired: true
                    }
                },
                startDate: {
                    value: '',
                    placeholder: 'Voucher\'s start date...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        isRequired: true
                    }
                },
                endDate: {
                    value: '',
                    placeholder: 'Voucher\'s end date...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        isRequired: true
                    }
                }
            }
        };

        this.voucher = this.props.voucher;
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

    updateVoucher(voucher) {
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
                    'oneTimeOnly': voucher.oneTimeOnly
                }
            )
        }

        fetch(HOST.backend_api + '/vouchers', putMethod)
            .then(response => console.log(response))
            .catch(err => console.log(err));
        this.reloadHandler();
    }

    handleSubmit() {
        let voucherId = 0, code = null, discount = null, startDate = null, endDate = null;
        voucherId = this.voucher.voucherId;
        const {oneTimeOnly} = this.state;
        let isOneTimeOnly = false;
        if (oneTimeOnly === "NO") {
            isOneTimeOnly = false;
        } else {
            isOneTimeOnly = true;
        }

        if (this.state.formControls.code.value === undefined || this.state.formControls.code.value === '') {
            code = this.voucher.code;
        } else {
            code = this.state.formControls.code.value;
        }
        if (this.state.formControls.discount.value === undefined || this.state.formControls.discount.value === '') {
            discount = this.voucher.discount;
        } else {
            discount = this.state.formControls.discount.value;
        }
        if (this.state.formControls.startDate.value === undefined || this.state.formControls.startDate.value === '') {
            startDate = this.voucher.startDate;
        } else {
            startDate = this.state.formControls.startDate.value;
        }
        if (this.state.formControls.endDate.value === undefined || this.state.formControls.endDate.value === '') {
            endDate = this.voucher.endDate;
        } else {
            endDate = this.state.formControls.endDate.value;
        }

        let v = {
            voucherId: voucherId,
            code: code,
            discount: discount,
            startDate: startDate,
            endDate: endDate,
            oneTimeOnly: isOneTimeOnly
        };

        console.log(v);

        this.updateVoucher(v);
    }

    render() {
        const {oneTimeOnly} = this.state;
        const optionsUseOnly = [];
        optionsUseOnly.push({value: 'YES', label: 'Yes'});
        optionsUseOnly.push({value: 'NO', label: 'No'});

        const voucher = this.voucher;
        console.log(voucher);
        var defaultUse;
        if (voucher.oneTimeOnly === false) {
            defaultUse = optionsUseOnly[1];
        } else {
            defaultUse = optionsUseOnly[0];
        }

        return (
            <div>
                <FormGroup id='code'>
                    <Label for='codeField'> Code </Label>
                    <Input name='code' id='codeField' placeholder={this.state.formControls.code.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.voucher.code}
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
                           defaultValue={this.voucher.discount}
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
                           defaultValue={this.voucher.startDate.substring(0,10)}
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
                           defaultValue={this.voucher.endDate.substring(0,10)}
                           touched={this.state.formControls.endDate.touched? 1 : 0}
                           valid={this.state.formControls.endDate.valid}
                           required
                    />
                    {this.state.formControls.endDate.touched && !this.state.formControls.endDate.valid &&
                    <div className={"error-message"}> * End date not valid </div>}
                </FormGroup>

                <div className="form-group" style={{marginLeft: "auto", marginRight:"auto"}}>
                    <label>One Use Only?</label>
                    <Select theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                ...theme.colors,
                                                    text: 'white',
                                                    primary25: 'rgb(255,81,81)',
                                                    primary: 'rgb(255,81,81)',
                                                },})} options={optionsUseOnly} defaultValue={defaultUse} onChange={this.handleOneUseOnlySelection}/>
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

export default VoucherUpdateForm;


function isEmpty(item) {
    for(const p in item) {
        if(item.hasOwnProperty(p)) {
            return false;
        }
    }

    return JSON.stringify(item) === JSON.stringify({});
}