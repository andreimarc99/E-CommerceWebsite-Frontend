
import React from 'react'
import * as API_PRODUCT from "../product/api/product-api"
import "../styles.css"
import {
    Col,
    Carousel
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
        products.sort(compare);
        console.log(products);
        var imageElem1, imageElem2, imageElem3;

        if (products !== "undefined" && products.length >0) {
            console.log(products[0]);
            var buf1 = products[0].image.data;

            imageElem1 = document.createElement('img1');
            imageElem1.src = 'data:image/png;base64,' + buf1.toString('base64');
            var src1 = document.getElementById("product1");


            var buf2 = products[1].image.data;

            imageElem2 = document.createElement('img2');
            imageElem2.src = 'data:image/png;base64,' + buf2.toString('base64');
            var src2 = document.getElementById("product2"); 
            var buf3 = products[2].image.data;

            imageElem3 = document.createElement('img3');
            imageElem3.src = 'data:image/png;base64,' + buf3.toString('base64');
            var src3 = document.getElementById("product3"); 

        return(
        <div>
          <br />
          <h1 style={{color: 'red'}}>Featured products</h1>
            <Col md={9} className="carousel-content" style = {{marginLeft: "auto", marginRight:"auto"}}>
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100 contain"
                  src={imageElem1.src}
                  alt="First slide"
                  width='40%'
                />
                <Carousel.Caption>
                  <h3>{products[0].name}</h3>
                  <p>{products[0].description}</p>
                  <p>{products[0].price + "$"}</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100 contain"
                  src={imageElem2.src}
                  alt="Second slide"
                  width='40%'
                />

                <Carousel.Caption>
                <h3>{products[1].name}</h3>
                <p>{products[1].description}</p>
                <p>{products[1].price + "$"}</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block w-100 contain"
                  src={imageElem3.src}
                  alt="Third slide"
                  width='40%'
                />

                <Carousel.Caption>
                <h3>{products[2].name}</h3>
                <p>{products[2].description}</p>
                <p>{products[2].price + "$"}</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Col>
          <br />
        </div>
        );
   
    } else {
        return (<div></div>)
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
  