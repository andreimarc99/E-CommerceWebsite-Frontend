import React from 'react';
import {withRouter} from "react-router-dom";

class ProductPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { product: this.props.location.state.product }
    }

    componentDidMount() {
    }

    render() {
        const {product} = this.state;
        var buf = product.image.data;
        var imageElem = document.createElement('img');
        imageElem.src = 'data:image/png;base64,' + buf.toString('base64');
        console.log(product);
        return (
        <div>
            <hr
            style={{
                color: 'rgb(255, 81, 81)',
                backgroundColor: 'rgb(255, 81, 81)',
                height: 10
            }}
            />
            <h1 >{product.name}</h1>
            {(product.stock > 10 ? (<h5 style={{color: 'green'}}>{product.stock} left</h5>) : (<h5 style={{color: 'red'}}>{product.stock} left</h5>))}
            <hr
            style={{
                color: 'rgb(255, 81, 81)',
                backgroundColor: 'rgb(255, 81, 81)',
                height: 10
            }}/>
            <img
                  className="d-block w-100 prod-img"
                  src={imageElem.src}
                  alt="First slide"
            />
            <h3>Price: ${product.price}</h3>
           <h6>{product.description}</h6>
           <hr
            style={{
                color: 'rgb(255, 81, 81)',
                backgroundColor: 'rgb(255, 81, 81)',
                height: 10
            }}
            />
           <h5 className="text-left" style={{marginLeft:"20px"}}><b>Technical specs</b>
           </h5>
           <p className="text-left" style={{marginLeft:"30px"}}><b>Size:</b> {product.specs.size}</p>
           <p className="text-left" style={{marginLeft:"30px"}}><b>Weight:</b> {product.specs.weight}g</p>

           <hr
            style={{
                color: 'rgb(255, 81, 81)',
                backgroundColor: 'rgb(255, 81, 81)',
                height: 10
            }}
            />
            <h5 className="text-left" style={{marginLeft:"20px"}}><b>Categories</b></h5>
            {product.specs.categories.map((category) => <p style={{marginLeft:"20px", borderStyle:"solid", borderRadius:'12px', width:'10%'}}> {category.name} </p> )}
            
        </div>
        );
    }

}

export default withRouter(ProductPage);