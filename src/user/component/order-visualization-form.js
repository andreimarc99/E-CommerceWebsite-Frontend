import React from 'react';

class OrderVisualizationForm extends React.Component {

    constructor(props) {
        super(props);
        this.reloadHandler = this.props.reloadHandler;
        this.order = this.props.order;
        this.state = {
            errorStatus: 0,
            error: null,

            formIsValid: true
        }
    }


    render() {
        var o = this.order;
        return (
            <div style={{textAlign:'center', marginBottom:'20px'}}>
                <h3>Products ordered</h3>
                <hr
                style={{
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 3,
                    width:'30%'
                }}/>
                {o.products.map((p) => {
                    return (
                        <li>
                            <b>{p.name}</b> - ${p.price}
                        </li>
                    )
                })}
                <h4 style={{marginTop:'20px'}}>Address</h4>
                <hr
                style={{
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 3,
                    width:'30%'
                }}/>
                <div><b>[{o.address.alias}]</b> {o.address.streetNr}, {o.address.town}, {o.address.county}, {o.address.country}</div>
                <hr
                style={{
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 4,
                    marginTop:'50px'
                }}/>
                <h3>Final price</h3>
                <h4 className="text-muted">${o.finalPrice}</h4>
            </div>
        ) ;
    }
}

export default OrderVisualizationForm;