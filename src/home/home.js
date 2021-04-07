import React from 'react'
import * as API_PRODUCT from "../product/api/product-api"
import "../styles.css"
import {
    Container,
    Row,
    Col,
    Carousel,
    ListGroup,
    Card,
    Button
  } from "react-bootstrap";

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
            }
        }
    }


    fetchProducts() {
        return API_PRODUCT.getProductsWithImages((result, status, err) => {

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
        });
        
    }

    componentDidMount() {
        this.fetchProducts();
    }

    render() {
        const {products} = this.state;
        return(
        <div>
            <h3>Featured products</h3> 
            {
                
                <Carousel> 
                    
                    <div id="products">
                    {
                    
                            <Carousel.Item>
                                    {
                                        products.map( (product) => { 
                                            var buf = product.image.data;
                                            var imageElem = document.createElement('img');
                                            imageElem.src = 'data:image/png;base64,' + buf.toString('base64');
                                            var src = document.getElementById("products"); 
                                            imageElem.style.width='40%';
                                            src.appendChild(imageElem); 
                                        })
                                    }
                                <Carousel.Caption>
                                    First slide label
                                </Carousel.Caption>
                            </Carousel.Item>
                    }
                    </div>
                </Carousel>

            }
        </div>
        );
    }
}

export default Home;