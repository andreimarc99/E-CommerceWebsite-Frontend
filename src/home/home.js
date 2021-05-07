import React from 'react'
import * as API_PRODUCT from "../product/api/product-api"
import * as CATEGORY_API from "../product/api/category-api"
import "../styles.css"
import {
    Col,
    Carousel
  } from "react-bootstrap";
  import {Card, Button} from "react-bootstrap";

import logo from "../img/logo.png"
import {Link} from "react-router-dom";

import {HOST} from "../commons/hosts"
import axios from 'axios';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            isLoaded: false,
            errorStatus: 0,
            error: null,
            imageElem: {
                src: ""
            },
            categories: []
        }
        this.handleAddToCart = this.handleAddToCart.bind(this);
    }

    fetchCategories() {
      /*return CATEGORY_API.getCategories((result, status, err) => {
        if (result !== null && (status === 200 || status === 201)) {
            this.setState({
              categories: result
            });
        } else {
            this.setState(({
              errorStatus: status,
              error: err
            }));
        }
      })*/
      return axios.get(HOST.backend_api + '/categories')
        .then (response => {
          this.setState({categories: response.data})
        })   
    }

    fetchProducts() {
        /*return API_PRODUCT.getProductsWithImages((result, status, err) => {
            if (result !== null && status === 200) {
                this.setState({
                    products: result,
                    isLoaded: true
                });
            } else {
                this.setState(({
                    errorStatus: status,
                    error: err
                }));
            }
        });     */
        return axios.get(HOST.backend_api + '/products/get')
        .then (response => {
          this.setState({products: response.data})
        })   
    }

    handleAddToCart(product) {
      console.log(product);
      if (product.stock > 0) {
        fetch(HOST.backend_api + "/carts/" + JSON.parse(localStorage.getItem("loggedUser")).username)
        .then(response => response.json())
        .then(data => {
            data.products.push(product);

            var price = 0;
            data.products.map((p) => {
                price += p.price
            })
            const putMethod = {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(
                    {
                        'cartId': data.cartId,
                        'customer': data.customer,
                        'products': data.products,
                        'fullPrice': price
                    }
                )
            }

            fetch(HOST.backend_api + '/carts', putMethod)
                .then(response => {alert(product.name + " added to cart.")})
                .catch(err => console.log(err));
        })
        .catch(error => console.log(error));
      } else {
        alert("Stock insufficient for " + product.name);
      }
  }

    componentDidMount() {
        this.fetchProducts();
        this.fetchCategories();
    }

    render() {
        const {products} = this.state;

        const {categories} = this.state;
        products.sort(compare);

        if (products !== "undefined" && products.length >0) {
          var imageElems = [];
          for (let i = 0; i < products.length; ++i) {
              var buf1 = products[i].image.data;
              var imageElem1 = document.createElement('img1');
              imageElem1.src = 'data:image/png;base64,' + buf1.toString('base64');
              imageElems[products[i].productId] = imageElem1.src;
          }
          var productsCategories = [];
          products.map((prod) => {
            prod.specs.categories.map((categ) =>
              productsCategories.push({category: categ.name, product: prod})
          )})
        return(
        <div>
          <br />
          <h1 style={{backgroundColor:'rgb(255,81,81)', color:'white'}}>Featured products</h1>
        <br />
            {
              (imageElems.length > 0 ?
              
            <Col md={9} className="carousel-content" style = {{marginLeft: "auto", marginRight:"auto"}}>
            <Carousel fade>
            
              <Carousel.Item>
                <img
                  className="d-block w-100 contain"
                  src={imageElems[products[0].productId]}
                  alt="First slide"
                />
                <Carousel.Caption>
                <Link style={{textDecoration:"none", color:"white"}} to={{ pathname: `/product_page/${products[0].productId}`, state: { product: products[0] } }}>
                  <h3>{products[0].name}</h3> 
                </Link>
                  <p>{products[0].price + "$"}</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100 contain"
                  src={imageElems[products[1].productId]}
                  alt="Second slide"
                />

                <Carousel.Caption>
                <Link style={{textDecoration:"none", color:"white"}} to={{ pathname: `/product_page/${products[1].productId}`, state: { product: products[1] } }}>
                  <h3>{products[1].name}</h3> 
                </Link>
                <p>{products[1].price + "$"}</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100 contain"
                  src={imageElems[products[2].productId]}
                  alt="Third slide"
                />

                <Carousel.Caption>
                <Link style={{textDecoration:"none", color:"white"}} to={{ pathname: `/product_page/${products[2].productId}`, state: { product: products[2] } }}>
                  <h3>{products[2].name}</h3> 
                </Link>
                <p>{products[2].price + "$"}</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Col>
              : <p className="text-muted">No products found.</p>)}
          <br />

        <h1 style={{backgroundColor:'rgb(255,81,81)', color:'white'}}>Our products by categories</h1>
   
            <br />
          <div className="container fluid">
                {
                  (productsCategories.length > 0 && categories.length > 0 && imageElems.length > 0 ?
                    categories.map((category) => {
                      let temp = [];
                      temp = productsCategories.filter(function(item) {
                        return item.category === category.name
                      });
                        return (
                        <div>
                        <div className="d-flex overflow-auto justify-content-center" style={{marginBottom:'20px'}}>
                          <h4 style={{textAlign:'center'}}>{temp[0].category}</h4>
                          </div>
                          <hr
                          style={{
                              color: 'rgb(255, 81, 81)',
                              backgroundColor: 'rgb(255, 81, 81)',
                              height: 3,
                              width: '30%'
                          }}/>
            
                          <div className="d-flex overflow-auto justify-content-left" style={{marginBottom:'20px'}}>

                            {temp.map((prod) => { 
                              return(
                                <div className="col">
                                    <Card bg="card border-danger mb-3" text="black" style={{ width: '18rem', margin: '10px'}}>
                                        
                                    <Link style={{textDecoration:"none"}} to={{ pathname: `/product_page/${prod.product.productId}`, state: { product: prod.product }}} >
                                    <Card.Header className="red-card-header">{prod.product.name}</Card.Header></Link>
                                    <Card.Body>
                                        
                                    <img
                                      className="rel-img"
                                      src={imageElems[prod.product.productId]}
                                      alt="First slide"
                                    />
                                    <hr
                                        style={{
                                            color: 'rgb(255, 81, 81)',
                                            backgroundColor: 'rgb(255, 81, 81)',
                                            height: 3
                                        }} />
                                        <textarea readOnly='true' style={{width:'100%', border:'none'}} value={prod.product.description} className="txtarea text-muted"></textarea>
                                      <Card.Text>
                                        <h4>${prod.product.price}</h4>
                                        
                                      </Card.Text>
                                      {(localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "" && localStorage.getItem("loggedUser") !== undefined && JSON.parse(localStorage.getItem("loggedUser")).role === "CUSTOMER" ? 
                                      <Button onClick={() => this.handleAddToCart(prod.product)} style={{marginRight:'5px', width:'100px', height:'60px'}} variant="danger"><img className="logo" alt="logo" src={logo} style={{width:'50px', height:'50px'}}></img></Button>
                                      :<div/>)}
                                    </Card.Body>
                                  </Card>
                                  </div> );
                                })} 
                                </div></div>)
                  })
                    : 
                    <p className="text-muted"> No products found. </p>) 
                  } </div>
        </div>
        );
   
    } else {
        return (<div className="text-muted">No products registered yet.</div>)
    }
         
}
}

export default Home;

function compare( a, b ) {
    if ( a.numberSold < b.numberSold ){
      return 1;
    }
    if ( a.numberSold > b.numberSold ){
      return -1;
    }
    return 0;
  }
  