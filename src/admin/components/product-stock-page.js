import React from 'react'
import * as API_PRODUCT from "../../product/api/product-api"
import {Button} from 'react-bootstrap'
import {
    CardHeader,
    CardBody,
    Modal,
    ModalBody,
    ModalHeader
} from 'reactstrap';
import ProductCreationForm from './product-creation-form'
import {Link} from "react-router-dom"
import {HOST} from '../../commons/hosts'
import ReactSpinner from 'react-bootstrap-spinner'
import axios from 'axios';
import CategoryCreationForm from './category-creation-page';
import ProductUpdateForm from './product-update-form';

class ProductStockPage extends React.Component {

    constructor(props) {
        super(props);
        this.toggleCreateProductForm = this.toggleCreateProductForm.bind(this);        
        this.toggleUpdateProduct = this.toggleUpdateProduct.bind(this);
        this.toggleCreateCategoryForm = this.toggleCreateCategoryForm.bind(this);
        this.fetchProducts = this.fetchProducts.bind(this);
        this.reloadProducts = this.reloadProducts.bind(this);
        this.state = {
            productList: [],
            isProductLoaded: false,
            errorStatus: 0,
            error: '',
            selected_create_product: false,
            selected_create_category: false,
            done: false,
            selected_update_product: false,
            selected_product: {}
        }
    }

    componentDidMount() {
        this.fetchProducts();
    }

    toggleCreateProductForm() {
        this.setState({selected_create_product: !this.state.selected_create_product});
    }

    toggleCreateCategoryForm() {
        this.setState({selected_create_category: !this.state.selected_create_category});
    }

    reloadProducts() {
        this.setState({
            isProductLoaded: false
        });
        this.toggleCreateProductForm();
        this.fetchProducts();
    }

    fetchProducts() {
       axios.get(HOST.backend_api + '/products')
       .then(response =>
            this.setState({
                productList: response.data,
                isProductLoaded: true,
                done: true
            }));
    }


    toggleUpdateProduct(product) {
        if (this.state.selected_update_product === true) {
            this.setState(
                {
                    selected_update_product: !this.state.selected_update_product
                }
            )
        } else {
            this.setState(
                {
                    selected_update_product: !this.state.selected_update_product,
                    selected_product: JSON.parse(JSON.stringify(product))
                }
            )
        }
    }


    render() {
        if (localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== undefined) {
            if (JSON.parse(localStorage.getItem("loggedUser")).role === "ADMIN") {
        const {done, productList} = this.state;
        return(
            <div>
            <h1 style={{backgroundColor:'rgb(220,53,69)', color:'white'}}>PRODUCTS STOCK</h1>

        <div style={{marginTop:'10px', marginBottom:'20px', marginLeft:"30px", marginRight:"30px"}}>

            {(done === true ? (productList.length > 0 ?
                   <div>
                   <CardHeader>
                   <Button style = {{marginLeft:"20px"}} className="btn btn-danger" onClick={this.toggleCreateProductForm}>NEW PRODUCT</Button>
                   <Button style = {{marginLeft:"20px"}} className="btn btn-danger" onClick={this.toggleCreateCategoryForm}>NEW CATEGORY</Button>

                   </CardHeader>
                   <CardBody>
                   <div className="row">
                       <table className="table table-striped table-bordered" >
                           <thead className="tbl-head">
                           <tr>
                               <th className="text-center" width='50px'> ID</th>
                               <th className="text-center"> NAME</th>
                               <th className="text-center"> PRICE</th>
                               <th className="text-center"> DESCRIPTION</th>
                               <th className="text-center"> STOCK</th>
                               <th className="text-center"> SOLD</th>
                               <th className="text-center"> SPECS</th>
                               <th className="text-center"> CATEGORIES</th>
                               <th className="text-center"> ACTIONS</th>
                           </tr>
                           </thead>
                           <tbody>
                           {
                               productList.map(
                                   product => 
                                       <tr key={product.productId}>
                                           <td className="text-center"> {product.productId}</td>
                                           <td className="text-center"> {product.name} </td>
                                           <td className="text-center"> ${product.price}</td>
                                           <td className="text-center"> {product.description}</td>
                                           <td className="text-center"> {product.stock}</td>
                                           <td className="text-center"> {product.numberSold}</td>
                                           <td className="text-center"> <b>Size:</b> {product.specs.size}  <br /><b>Weight:</b> {product.specs.weight}</td>
                                           <td className="text-center"> {product.specs.categories.map((category) => <p style={{color:'white', backgroundColor:'rgb(255,81,81', borderStyle:"solid", borderRadius:'12px'}}> {category.name} </p> )}</td>
                                           <td className="text-center"><Button onClick={() => this.toggleUpdateProduct(product)} style={{margin:'5px'}} variant='outline-danger' size='sm'>UPDATE</Button></td>
                                       </tr>)
                           }
                           </tbody>
                       </table>
                   </div>
                   </CardBody>
       
                   <Modal isOpen={this.state.selected_create_product} toggle={this.toggleCreateProductForm}
                           className={this.props.className} size="lg">
                       <ModalHeader toggle={this.toggleCreateProductForm}><p style={{color:"red"}}> Add product </p></ModalHeader>
                       <ModalBody>
                           <ProductCreationForm reloadHandler={this.reloadProducts}/>
                       </ModalBody>
                   </Modal>

                   <Modal isOpen={this.state.selected_create_category} toggle={this.toggleCreateCategoryForm}
                           className={this.props.className} size="lg">
                       <ModalHeader toggle={this.toggleCreateCategoryForm}><p style={{color:"red"}}> Add category </p></ModalHeader>
                       <ModalBody>
                           <CategoryCreationForm reloadHandler={this.reloadProducts}/>
                       </ModalBody>
                   </Modal>

                   <Modal isOpen={this.state.selected_update_product} toggle={this.toggleUpdateProduct}
                    className={this.props.className} size="lg">
                        <ModalHeader toggle={this.toggleUpdateProduct} style={{color:'rgb(220,53,69)'}}> Update Product </ModalHeader>
                        <ModalBody>
                            <ProductUpdateForm product={this.state.selected_product} reloadHandler={this.refresh}/>
                        </ModalBody>
                    </Modal>
                   </div>  
                : <h2>No products.</h2>) :  <div style={{marginTop:'30px', marginBottom:'30px'}}> <ReactSpinner  type="border" color="danger" size="2" /></div>)}
             
        </div></div>);
    
        } else {
            return (
                <div style={{margin: "auto"}}>
                    <div className="card-body">
                        <h2 style={{color:'rgb(220,53,69)'}} className="card-title font-weight-bold">Access denied!</h2>
                        <p className="card-text text-muted">You do not have access to this page, as your role needs to be ADMIN.</p>
                    </div>
                </div>
            )
        }
        } else {
        return (
            <div style={{margin: "auto"}}>
                <div className="card-body">
                <h2 style={{color:'rgb(220,53,69)'}} className="card-title font-weight-bold">Access denied!</h2>
                    <p className="card-text text-muted">You do not have access to this page, as your role needs to be ADMIN.</p>
                </div>
            </div>
        )
        } 
    }
}

export default ProductStockPage;