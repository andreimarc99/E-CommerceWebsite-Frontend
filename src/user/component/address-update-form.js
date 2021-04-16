import React from 'react';
import validate from "../../admin/components/validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import {HOST} from "../../commons/hosts"


class AddressUpdateForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;
        this.address = this.props.address;
        this.state = {

            errorStatus: 0,
            error: null,

            formIsValid: true,

            formControls: {
                alias: {
                    value: '',
                    placeholder: 'Alias...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                country: {
                    value: '',
                    placeholder: 'Country...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                county: {
                    value: '',
                    placeholder: 'County...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                town: {
                    value: '',
                    placeholder: 'Town...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                streetNr: {
                    value: '',
                    placeholder: 'Street and number...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 5,
                        isRequired: true
                    }
                },
                countryCode: {
                    value: '',
                    placeholder: 'Country code...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 5,
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
        console.log(this.state.formControls);
    };

    updateAddress(address) {
        const putMethod = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'addressId': address.addressId,
                    'alias': address.alias,
                    'country': address.country,
                    'county': address.county,
                    'town': address.town,
                    'streetNr': address.streetNr,
                    'countryCode': address.countryCode,
                    'user': address.user
                }
            )
        }

        fetch(HOST.backend_api + '/addresses', putMethod)
            .then(response => response.json())
            .then(data => data ? JSON.parse(data) : {})
            .catch(err => console.log(err));
        this.reloadHandler();
    }

    handleSubmit() {
        let addressId = 0, alias = null, country = null, county = null, town = null, streetNr = null, countryCode = null;
        addressId = this.address.addressId;
        let user = this.address.user;

        if (this.state.formControls.alias.value === undefined || this.state.formControls.alias.value === '') {
            alias = this.address.alias;
        } else {
            alias = this.state.formControls.alias.value;
        }
        if (this.state.formControls.country.value === undefined || this.state.formControls.country.value === '') {
            country = this.address.country;
        } else {
            country = this.state.formControls.country.value;
        }
        if (this.state.formControls.county.value === undefined || this.state.formControls.county.value === '') {
            county = this.address.county;
        } else {
            county = this.state.formControls.county.value;
        }
        if (this.state.formControls.town.value === undefined || this.state.formControls.town.value === '') {
            town = this.address.town;
        } else {
            town = this.state.formControls.town.value;
        }
        if (this.state.formControls.streetNr.value === undefined || this.state.formControls.streetNr.value === '') {
            streetNr = this.address.streetNr;
        } else {
            streetNr = this.state.formControls.streetNr.value;
        }
        if (this.state.formControls.countryCode.value === undefined || this.state.formControls.countryCode.value === '') {
            countryCode = this.address.countryCode;
        } else {
            countryCode = this.state.formControls.countryCode.value;
        }

        let address = {
            addressId: addressId,
            user: user,
            alias: alias,
            country: country,
            county: county,
            town: town,
            streetNr: streetNr,
            countryCode: countryCode
        };

        console.log(address);
        this.updateAddress(address);
    }

    render() {

        return (
            <div>
                <FormGroup id='alias'>
                    <Label for='aliasField'> Alias </Label>
                    <Input name='alias' id='aliasField' placeholder={this.state.formControls.alias.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.address.alias}
                           touched={this.state.formControls.alias.touched? 1 : 0}
                           valid={this.state.formControls.alias.valid}
                           required
                    />
                    {this.state.formControls.alias.touched && !this.state.formControls.alias.valid &&
                    <div className={"error-message"}> * Alias not valid </div>}
                </FormGroup>

                <FormGroup id='country'>
                    <Label for='countryField'> Country </Label>
                    <Input name='country' id='countryField' placeholder={this.state.formControls.country.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.address.country}
                           touched={this.state.formControls.country.touched? 1 : 0}
                           valid={this.state.formControls.country.valid}
                           required
                    />
                    {this.state.formControls.country.touched && !this.state.formControls.country.valid &&
                    <div className={"error-message"}> * Country not valid </div>}
                </FormGroup>

                <FormGroup id='county'>
                    <Label for='countyField'> County </Label>
                    <Input name='county' id='countyField' placeholder={this.state.formControls.county.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.address.county}
                           touched={this.state.formControls.county.touched? 1 : 0}
                           valid={this.state.formControls.county.valid}
                           required
                    />
                    {this.state.formControls.county.touched && !this.state.formControls.county.valid &&
                    <div className={"error-message"}> * County not valid </div>}
                </FormGroup>

                <FormGroup id='town'>
                    <Label for='townField'> Town </Label>
                    <Input name='town' id='townField' placeholder={this.state.formControls.town.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.address.town}
                           touched={this.state.formControls.town.touched? 1 : 0}
                           valid={this.state.formControls.town.valid}
                           required
                    />
                    {this.state.formControls.town.touched && !this.state.formControls.town.valid &&
                    <div className={"error-message"}> * Town not valid </div>}
                </FormGroup>

                <FormGroup id='streetNr'>
                    <Label for='streetNrField'> Street and Number </Label>
                    <Input name='streetNr' id='streetNrField' placeholder={this.state.formControls.streetNr.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.address.streetNr}
                           touched={this.state.formControls.streetNr.touched? 1 : 0}
                           valid={this.state.formControls.streetNr.valid}
                           required
                    />
                    {this.state.formControls.streetNr.touched && !this.state.formControls.streetNr.valid &&
                    <div className={"error-message"}> * Street and Number not valid </div>}
                </FormGroup>

                <FormGroup id='countryCode'>
                    <Label for='countryCodeField'> Country Code </Label>
                    <Input name='countryCode' id='countryCodeField' placeholder={this.state.formControls.countryCode.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.address.countryCode}
                           touched={this.state.formControls.countryCode.touched? 1 : 0}
                           valid={this.state.formControls.countryCode.valid}
                           required
                    />
                    {this.state.formControls.countryCode.touched && !this.state.formControls.countryCode.valid &&
                    <div className={"error-message"}> * Country Code not valid </div>}
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

export default AddressUpdateForm;