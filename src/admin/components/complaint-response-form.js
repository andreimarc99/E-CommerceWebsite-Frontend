import React from 'react';
import validate from "./validator";
import Button from "react-bootstrap/Button";
import {Col, Row} from "reactstrap";
import { FormGroup, Input, Label} from 'reactstrap';
import {HOST} from "../../commons/hosts"
import axios from 'axios';



class ComplaintResponseForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;
        this.complaint = this.props.complaint;
        this.state = {

            errorStatus: 0,
            error: null,
            admin: {},

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
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    fetchAdmin() {
        axios.get(HOST.backend_api + '/admins')
        .then(response => {
            let admins = response.data;
            for (let i = 0; i < admins.length; ++i) {
                if (admins[i].user.username === JSON.parse(localStorage.getItem("loggedUser")).username) {
                    this.setState({admin: admins[i]})
                }
            }
        })
    }

    componentDidMount() {
        this.fetchAdmin();
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

    postComplaintResponse(complaintResponse) {
        const complaint = this.complaint;
    
        const {admin} = this.state;
        const postMethod = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(
                {
                    'complaint': complaint,
                    'admin': admin,
                    'message': complaintResponse.message
                }
            )
        }
        console.log(postMethod.body);

        fetch(HOST.backend_api + '/complaint_responses', postMethod)
            .then(response => window.location.reload())
            .catch(err => console.log(err));
        this.reloadHandler();
    }

    handleSubmit() {
        let message = null;
        message = this.state.formControls.message.value;

        let complaintResponse = {
            message: message
        };

        this.postComplaintResponse(complaintResponse);
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

export default ComplaintResponseForm;