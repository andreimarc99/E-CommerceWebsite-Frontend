import React from 'react';
import validate from "./validator.js";
import Button from "react-bootstrap/Button";
import * as API_PRODUCTS from "../../product/api/product-api";
import { FormGroup, Input, Label} from 'reactstrap';
import * as CATEGORIES_API from "../../product/api/category-api"
import Select from "react-select";
import {HOST} from "../../commons/hosts";
import axios from 'axios';


class ProductUpdateForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;
        this.product = this.props.product;
        this.fetchProduct = this.fetchProduct.bind(this);
        this.state = {
            errorStatus: 0,
            error: null,
            completed: false,
            prod: {},
            formIsValid: true,

            formControls: {
                name: {
                    value: '',
                    placeholder: 'Product name...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        maxLength: 100,
                        isRequired: true
                    }
                },
                price : {
                    value: '',
                    type: "number",
                    placeholder: 'Product price...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        isRequired: true
                    }
                },
                description: {
                    value: '',
                    placeholder: 'Product description...',
                    valid: true,
                    touched: true,
                    validationRules: {
                        minLength: 3,
                        maxLength: 244,
                        isRequired: true
                    }
                },
                stock: {
                    value: '',
                    type: "number",
                    placeholder: 'Product stock...',
                    valid: true,
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

    fetchProduct() {
        axios.get(HOST.backend_api + "/products/get/" + this.product.productId)
        .then(response => this.setState({prod: response.data}));
    }

    toggleForm() {
        this.setState({collapseForm: !this.state.collapseForm});
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

    }

    handleSubmit() {
        const {prod} = this.state;
        let name = null, price = 0, description = null, stock = 0, numberSold = prod.numberSold;

        if (this.state.formControls.name.value === undefined || this.state.formControls.name.value === '') {
            name = prod.name;
        } else {
            name = this.state.formControls.name.value;
        }
        if (this.state.formControls.price.value === undefined || this.state.formControls.price.value === '') {
            price = prod.price;
        } else {
            price = this.state.formControls.price.value;
        }
        if (this.state.formControls.description.value === undefined || this.state.formControls.description.value === '') {
            description = prod.description;
        } else {
            description = this.state.formControls.description.value;
        }
        if (this.state.formControls.stock.value === undefined || this.state.formControls.stock.value === '') {
            stock = prod.stock;
        } else {
            stock = this.state.formControls.stock.value;
        }

        let _product = {
            productId: prod.productId,
            name: name,
            price: price,
            description: description,
            stock: stock,
            numberSold: numberSold,
            image: prod.image
        };

        let prodJSON = JSON.stringify({
            'productId': _product.productId,
            'name': _product.name,
            'price': _product.price,
            'description': _product.description,
            'stock': _product.stock,
            'numberSold': _product.numberSold,
            'specs': prod.specs,
            'image': prod.image
        })

        const putMethod = {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: prodJSON
        }

        console.log(prodJSON);
        fetch(HOST.backend_api + '/products/update', putMethod)
        .then(response => console.log(response))
        .catch(err => console.log(err));
    }

    componentDidMount() {
        this.fetchProduct();
    }

    render() {
        return (
            <div>

                <FormGroup id='name'>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField' placeholder={this.state.formControls.name.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.product.name}
                           touched={this.state.formControls.name.touched? 1 : 0}
                           valid={this.state.formControls.name.valid}
                           required
                    />
                    {this.state.formControls.name.touched && !this.state.formControls.name.valid &&
                    <div style={{color:"red"}}> Name not valid </div>}
                </FormGroup>

                <FormGroup id='price'>
                    <Label for='priceField'> Price: </Label>
                    <Input name='price' id='priceField' placeholder={this.state.formControls.price.placeholder}
                           onChange={this.handleChange} type="number"
                           defaultValue={this.product.price}
                           touched={this.state.formControls.price.touched? 1 : 0}
                           valid={this.state.formControls.price.valid}
                           required
                    />
                    {this.state.formControls.price.touched && !this.state.formControls.price.valid &&
                    <div style={{color:"red"}}> Price not valid </div>}
                </FormGroup>

                <FormGroup id='description'>
                    <Label for='descriptionField'> Description: </Label>
                    <Input name='description' id='descriptionField' placeholder={this.state.formControls.description.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.product.description}
                           touched={this.state.formControls.description.touched? 1 : 0}
                           valid={this.state.formControls.description.valid}
                           required
                    />
                    {this.state.formControls.description.touched && !this.state.formControls.description.valid &&
                    <div style={{color:"red"}}> Description not valid </div>}
                </FormGroup>

                <FormGroup id='stock'>
                    <Label for='stockField'> Stock: </Label>
                    <Input name='stock' id='stockField' placeholder={this.state.formControls.stock.placeholder}
                           onChange={this.handleChange} type="number"
                           defaultValue={this.product.stock}
                           touched={this.state.formControls.stock.touched? 1 : 0}
                           valid={this.state.formControls.stock.valid}
                           required
                    />
                    {this.state.formControls.stock.touched && !this.state.formControls.stock.valid &&
                    <div style={{color:"red"}}> Stock not valid </div>}
                </FormGroup>

                <Button style={{float:'right', marginTop:'10px'}} className="btn btn-danger" type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>  Submit </Button>
            </div>
        ) ;
    }
}

export default ProductUpdateForm;