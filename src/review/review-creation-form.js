import React from 'react';
import validate from "../admin/components/validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import {HOST} from "../commons/hosts"
import * as CUSTOMER_API from "../user/customer-api"


class ReviewCreationForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;
        this.product = this.props.product;
        this.state = {
            customer: {},

            errorStatus: 0,
            error: null,

            formIsValid: false,

            formControls: {
                message: {
                    value: '',
                    placeholder: 'Your message...',
                    valid: false,
                    touched: true,
                    validationRules: {
                        minLength: 5,
                        isRequired: true
                    }
                },
                rating: {
                    value: '',
                    placeholder: 'Your rating...',
                    valid: false,
                    touched: true,
                    validationRules: {
                        isRequired: true,
                        minValue: true,
                        maxValue: true
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

    postReview(review) {
        const postMethod = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'message': review.message,
                    'customer': review.customer,
                    'product': review.product,
                    'rating': review.rating
                }
            )
        }

        fetch(HOST.backend_api + '/reviews', postMethod)
            .then(response => window.location.reload())
            .catch(err => console.log(err));
        this.reloadHandler();
    }

    handleSubmit() {
        let message = null, rating = null;
        let product = this.product;
        message = this.state.formControls.message.value;
        rating = this.state.formControls.rating.value;

        const {customer} = this.state;
        let review = {
            customer: customer,
            message: message, 
            rating: rating,
            product: product
        };

        this.postReview(review);
    }

    render() {

        return (
            <div>
                <FormGroup id='message'>
                    <Label for='messageField'> Message </Label>
                    <Input name='message' id='messageField' placeholder={this.state.formControls.message.placeholder}
                           onChange={this.handleChange}
                           touched={this.state.formControls.message.touched? 1 : 0}
                           valid={this.state.formControls.message.valid}
                           required
                    />
                    {this.state.formControls.message.touched && !this.state.formControls.message.valid &&
                    <div className={"error-message"}> Message not valid </div>}
                </FormGroup>

                <FormGroup id='rating'>
                    <Label for='ratingField'> Rating </Label>
                    <Input name='rating' id='ratingField' placeholder={this.state.formControls.rating.placeholder}
                           onChange={this.handleChange}
                           type="number" min="0" max="5"
                           touched={this.state.formControls.rating.touched? 1 : 0}
                           valid={this.state.formControls.rating.valid}
                           required
                    />
                    {this.state.formControls.rating.touched && !this.state.formControls.rating.valid &&
                    <div className={"error-message"}> Rating not valid! Choose a number between 0 and 5 </div>}
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

export default ReviewCreationForm;