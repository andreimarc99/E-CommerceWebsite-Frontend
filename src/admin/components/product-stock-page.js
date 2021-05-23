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

class ProductStockPage extends React.Component {

    constructor(props) {
        super(props);
        this.toggleCreateProductForm = this.toggleCreateProductForm.bind(this);
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
            done: false
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

    handleDelete(id) {
        fetch(HOST.backend_api + '/products/' + id, {method: 'DELETE'})
            .then(this.fetchProducts());
    }

    render() {
        const {done, productList} = this.state;
        return(
        <div style={{marginTop:'20px', marginBottom:'20px', marginLeft:"30px", marginRight:"30px"}}>
            {(done === true ? (productList.length > 0 ?
                   <div>
                   <CardHeader>
                   <Button style = {{marginLeft:"20px"}} className="btn btn-danger" onClick={this.toggleCreateProductForm}>Add a new product</Button>
                   <Button style = {{marginLeft:"20px"}} className="btn btn-danger" onClick={this.toggleCreateCategoryForm}>Create a new category</Button>

                   </CardHeader>
                   <CardBody>
                   <div className="row">
                       <table className="table table-striped table-bordered">
                           <thead>
                           <tr>
                               <th className="text-center" width='50px'> ID</th>
                               <th className="text-center"> Name</th>
                               <th className="text-center"> Price</th>
                               <th className="text-center"> Description</th>
                               <th className="text-center"> Stock</th>
                               <th className="text-center"> Sold</th>
                               <th className="text-center"> Specs</th>
                               <th className="text-center"> Categories</th>
                               <th className="text-center"> Actions</th>
                           </tr>
                           </thead>
                           <tbody>
                           {
                               productList.map(
                                   product => 
                                       <tr key={product.productId}>
                                           <td className="text-center"> {product.productId}</td>
                                          <Link style={{textDecoration:"none", color: "black"}} to={{ pathname: `/product_page/${product.productId}`, state: { product: product } }}>
                                           <td className="text-center"> {product.name} </td>
                                           </Link>
                                           <td className="text-center"> ${product.price}</td>
                                           <td className="text-center"> {product.description}</td>
                                           <td className="text-center"> {product.stock}</td>
                                           <td className="text-center"> {product.numberSold}</td>
                                           <td className="text-center"> <b>Size:</b> {product.specs.size}  <br /><b>Weight:</b> {product.specs.weight}</td>
                                           <td className="text-center"> {product.specs.categories.map((category) => <p style={{color:'white', backgroundColor:'rgb(255,81,81', borderStyle:"solid", borderRadius:'12px'}}> {category.name} </p> )}</td>
                                           <td className="text-center"> <Button onClick={() => {this.handleDelete(product.productId)}} style={{margin:'5px'}} variant='danger' size='sm'>Delete</Button>
                                                                       <Button style={{margin:'5px'}} variant='outline-danger' size='sm'>Update</Button></td>
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
                   </div>  
                : <h2>No products.</h2>) :  <div style={{marginTop:'30px', marginBottom:'30px'}}> <ReactSpinner  type="border" color="danger" size="2" /></div>)}
             
        </div>);
    }
}

export default ProductStockPage;