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

class ProductStockPage extends React.Component {

    constructor(props) {
        super(props);
        this.toggleCreateProductForm = this.toggleCreateProductForm.bind(this);
        this.fetchProducts = this.fetchProducts.bind(this);
        this.reloadProducts = this.reloadProducts.bind(this);
        this.state = {
            productList: [],
            isProductLoaded: false,
            errorStatus: 0,
            error: '',
            selected_create_product: false
        }
    }

    componentDidMount() {
        this.fetchProducts();
    }

    toggleCreateProductForm() {
        this.setState({selected_create_product: !this.state.selected_create_product});
    }

    reloadProducts() {
        this.setState({
            isProductLoaded: false
        });
        this.toggleCreateProductForm();
        this.fetchProducts();
    }

    fetchProducts() {
        return API_PRODUCT.getProducts((result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    productList: result,
                    isProductLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        })
    }

    render() {
        return(
        <div style={{marginLeft:"30px", marginRight:"30px"}}>
            <CardHeader>
            <Button style = {{marginLeft:"20px"}} className="btn btn-danger" onClick={this.toggleCreateProductForm}>Add a new product</Button>
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
                        <th className="text-center"> Number of products sold</th>
                        <th className="text-center"> Specs</th>
                        <th className="text-center"> Categories</th>

                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.productList.map(
                            product => 
                                <tr key={product.productId}>
                                    <td className="text-center"> {product.productId}</td>
                                    <td className="text-center"> {product.name} </td>
                                    <td className="text-center"> {product.price}</td>
                                    <td className="text-center"> {product.description}</td>
                                    <td className="text-center"> {product.stock}</td>
                                    <td className="text-center"> {product.numberSold}</td>
                                    <td className="text-center"> <b>Size:</b> {product.specs.size}  <br /><b>Weight:</b> {product.specs.weight}</td>
                                    <td className="text-center"> {product.specs.categories.map((category) => <p style={{borderStyle:"solid", borderRadius:'12px'}}> {category.name} </p> )}</td>

                                </tr>)
                    }
                    </tbody>
                </table>
            </div>
            </CardBody>

            <Modal isOpen={this.state.selected_create_product} toggle={this.toggleCreateProductForm}
                           className={this.props.className} size="lg">
                        <ModalHeader toggle={this.toggleCreateProductForm}><p style={{color:"red"}}> Add product: </p></ModalHeader>
                        <ModalBody>
                            <ProductCreationForm reloadHandler={this.reloadProducts}/>
                        </ModalBody>
                    </Modal>
        </div>);
    }
}

export default ProductStockPage;