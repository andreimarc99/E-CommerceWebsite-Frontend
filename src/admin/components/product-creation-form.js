import React from 'react';
import validate from "./validator.js";
import Button from "react-bootstrap/Button";
import * as API_PRODUCTS from "../../product/api/product-api";
import { FormGroup, Input, Label} from 'reactstrap';
import * as CATEGORIES_API from "../../product/api/category-api"
import Select from "react-select";
import {HOST} from "../../commons/hosts";
import axios from 'axios';

class PatientForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.reloadHandler = this.props.reloadHandler;

        this.state = {
            categoryList: [],
            isCategoryLoaded: false,
            errorStatus: 0,
            error: null,
            completed: false,

            formIsValid: false,
            selectedCategories: '',

            selectedFile: [],

            formControls: {
                name: {
                    value: '',
                    placeholder: 'Product name...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                size: {
                    value: '',
                    placeholder: 'Product size (ℒ×ℓ×ℎ)...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                weight: {
                    value: '',
                    type: "number",
                    placeholder: 'Product weight...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true
                    }
                },
                price : {
                    value: '',
                    type: "number",
                    placeholder: 'Product price...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true
                    }
                },
                description: {
                    value: '',
                    placeholder: 'Product description...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        minLength: 3,
                        isRequired: true
                    }
                },
                stock: {
                    value: '',
                    type: "number",
                    placeholder: 'Product stock...',
                    valid: false,
                    touched: false,
                    validationRules: {
                        isRequired: true
                    }
                }
            }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
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

    registerProduct(product) {
        return API_PRODUCTS.postProduct(product, (result, status, error) => {
            if (result !== null && (status === 200 || status === 201)) {
                console.log("Successfully inserted product with id: " + result);
                this.reloadHandler();
            } else {
                this.setState(({
                    errorStatus: status,
                    error: error
                }));
            }
        });
    }

    handleSubmit() {
        const {selectedCategories} = this.state;
        let specs = {
            size: this.state.formControls.size.value,
            weight: this.state.formControls.weight.value
        }

        let _product = {
            name: this.state.formControls.name.value,
            price: this.state.formControls.price.value,
            description: this.state.formControls.description.value,
            stock: this.state.formControls.stock.value,
            numberSold: 0
        };

        let prodJSON = JSON.stringify({
            'name': _product.name,
            'price': _product.price,
            'description': _product.description,
            'stock': _product.stock,
            'numberSold': _product.numberSold
        })


        let categ = []
        for (let i = 0; i < selectedCategories.length; ++i) {
            categ.push({categoryId: selectedCategories[i].value, name: selectedCategories[i].label})
        }

        let specsJSON = JSON.stringify({
            'size': specs.size,
            'weight': specs.weight,
            'categories': categ
        })

        const formData = new FormData();
        formData.append('file', new Blob([this.state.selectedFile.value], {
            type: "image/png"
        }));
        formData.append('product', new Blob([prodJSON], {
            type: "application/json"
        }));
        formData.append('specs', new Blob([specsJSON], {
            type: "application/json"
        }));

        axios.post(HOST.backend_api + "/products/save", formData)
        this.reloadHandler();
    }

    fetchCategories() {
        return CATEGORIES_API.getCategories((result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    categoryList: result,
                    isCategoriesLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        })
    }

    handleCategoriesChange = selectedCategories => {
        this.setState({selectedCategories});
    };

    onFileChangeHandler = (e) => {
        e.preventDefault();
        this.setState({
            selectedFile: e.target.files[0]
        });
    }

    /*insertProduct(product, specs) {
        const formData = new FormData();
        formData.append('file', this.state.selectedFile);
        formData.append('product', product);
        //Append the rest data then send
        axios({
           method: 'POST',
           url: HOST.backend_api + "/products/save/",
           data: formData,
           headers: {'Content-Type': 'multipart/form-data' }
        })
        .then(function (response) {
           //handle success
           console.log(response);
        }, 
        function(error) { 
           // handle error 
        });
    }*/

    componentDidMount() {
        this.fetchCategories();
    }

    render() {
        const {completed, selectedCategories} = this.state;
        const specifications = this.state.categoryList.map( (categ) => ({
            value: categ.categoryId,
            label: categ.name
        }));
        return (
            <div>

                <FormGroup id='name'>
                    <Label for='nameField'> Name: </Label>
                    <Input name='name' id='nameField' placeholder={this.state.formControls.name.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.name.value}
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
                           defaultValue={this.state.formControls.price.value}
                           touched={this.state.formControls.price.touched? 1 : 0}
                           valid={this.state.formControls.price.valid}
                           required
                    />
                    {this.state.formControls.price.touched && !this.state.formControls.price.valid &&
                    <div style={{color:"red"}}> Price not valid </div>}
                </FormGroup>

                <FormGroup id='size'>
                    <Label for='sizeField'> Size: </Label>
                    <Input name='size' id='sizeField' placeholder={this.state.formControls.size.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.size.value}
                           touched={this.state.formControls.size.touched? 1 : 0}
                           valid={this.state.formControls.size.valid}
                           required
                    />
                    {this.state.formControls.size.touched && !this.state.formControls.size.valid &&
                    <div style={{color:"red"}}> Size not valid </div>}
                </FormGroup>

                <FormGroup id='weight'>
                    <Label for='weightField'> Weight: </Label>
                    <Input name='weight' id='weightField' placeholder={this.state.formControls.weight.placeholder}
                           onChange={this.handleChange} type="number"
                           defaultValue={this.state.formControls.weight.value}
                           touched={this.state.formControls.weight.touched? 1 : 0}
                           valid={this.state.formControls.weight.valid}
                           required
                    />
                    {this.state.formControls.weight.touched && !this.state.formControls.weight.valid &&
                    <div style={{color:"red"}}> Weight not valid </div>}
                </FormGroup>

                <FormGroup id='description'>
                    <Label for='descriptionField'> Description: </Label>
                    <Input name='description' id='descriptionField' placeholder={this.state.formControls.description.placeholder}
                           onChange={this.handleChange}
                           defaultValue={this.state.formControls.description.value}
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
                           defaultValue={this.state.formControls.stock.value}
                           touched={this.state.formControls.stock.touched? 1 : 0}
                           valid={this.state.formControls.stock.valid}
                           required
                    />
                    {this.state.formControls.stock.touched && !this.state.formControls.stock.valid &&
                    <div style={{color:"red"}}> Stock not valid </div>}
                </FormGroup>

                <div>
                    <label>Categories</label>
                    <Select isMulti options={specifications} value={selectedCategories} onChange={this.handleCategoriesChange}/>
                    {completed && selectedCategories.length === 0 &&
                    <div style={{color:"red"}}>Categories are required</div>
                    }
                </div>
                <div>
                    <label>Upload photo</label>
                    <input type="file" className="form-control" name="file" onChange={this.onFileChangeHandler}/>
                </div>
                <Button style={{float:'right', marginTop:'10px'}} className="btn btn-danger" type={"submit"} disabled={!this.state.formIsValid} onClick={this.handleSubmit}>  Submit </Button>
            </div>
        ) ;
    }
}

export default PatientForm;