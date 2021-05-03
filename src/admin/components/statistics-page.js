import React from 'react';
import {HOST} from "../../commons/hosts"
import {Button} from "react-bootstrap" 
import axios from 'axios';
import CanvasJSReact from "./canvasjs.react";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function getAge(dateString) 
{
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;
}

class StatisticsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            orderList: [],
            errorStatus: 0,
            error: '',
            productList: [],
            userList: []
        }
        this.fetchOrders = this.fetchOrders.bind(this);
        this.fetchProducts = this.fetchProducts.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
    }

    fetchOrders() {
        axios.get(HOST.backend_api + "/orders")
        .then(response => {
            this.setState({orderList: response.data})
        });
    }

    fetchProducts() {
        axios.get(HOST.backend_api + "/products")
        .then(response => {
            this.setState({productList: response.data})
        });
    }

    fetchUsers() {
        axios.get(HOST.backend_api + "/users")
        .then(response => {
            this.setState({userList: response.data})
        });
    }

    componentDidMount() {
        this.fetchProducts();
        this.fetchOrders();
        this.fetchUsers();
    }

    render() {
        const {orderList, productList, userList} = this.state;
        var delivered = 0;
        var undelivered = 0;
        var products = [];
        var categories = [];
        var userAges = [];
        var under25 = 0;
        var between25and40 = 0;
        var between40and65 = 0;
        var over65 = 0;
        
        if (orderList.length > 0) {
            for (let i = 0; i < orderList.length; ++i) {
                if (orderList[i].delivered === true) {
                    delivered += 1;
                } else {
                    undelivered += 1;
                }
            }
        }

        if (productList.length > 0) {
            for (let i = 0; i < productList.length; ++i) {
                products.push({label: productList[i].name, y: productList[i].numberSold})
                productList[i].specs.categories.map((category) => {
                    if (typeof categories[category.categoryId] !== "undefined") {
                        categories[category.categoryId] = {label: category.name, y: categories[category.categoryId].y + 1};
                    } else {
                        categories[category.categoryId] = {label: category.name, y: 1};
                    }
                })
            }
        }
        var filteredCategories = [];

        if (categories.length > 0) {
            filteredCategories = categories.filter(function (el) {
                return el != null;
            });
        }
        if (userList.length > 0) {
            var customers = userList.filter(function(item) {
                return item.role === "CUSTOMER"
            })
            if (customers.length > 0) {
                for (let i = 0; i < customers.length; ++i) {
                    userAges.push(getAge(customers[i].birthDate.substring(0,10)));
                }
                for (let i = 0; i < userAges.length; ++i) {
                    if (userAges[i] < 25) {
                        under25 += 1;
                    } else if (userAges[i] >= 25 && userAges[i] < 40) {
                        between25and40 += 1;
                    } else if (userAges[i] >= 40 && userAges[i] < 65) {
                        between40and65 += 1;
                    } else {
                        over65 += 1;
                    }
                }
            }
        }

        const orderChartOptions = {
            title: {
              text: "Order statistics"
            },
            theme: 'light2',
            subtitles: [{
                text: "Statistics about the orders registered in the system, divided by whether or not they were delivered"
            }],
            data: [{				
                      type: "column",
                      dataPoints: [
                          { label: "Total", y: orderList.length },
                          { label: "Delivered",  y: delivered  },
                          { label: "Undelivered", y: undelivered  }
                      ]
             }]
        }

        const productChartOptions = {
            title: {
              text: "Product statistics"
            },
            theme: 'light2',
            subtitles: [{
                text: "Statistics about the products registered in the system and their respective number of sold items"
            }],
            data: [{				
                      type: "column",
                      dataPoints: products
             }]
        }
        
        const categoriesChartOptions = {
            title: {
              text: "Categories statistics"
            },
            theme: 'light2',
            subtitles: [{
                text: "Statistics about the categories registered in the system and the number of existing products under the respective category"
            }],
            data: [{				
                      type: "column",
                      dataPoints: filteredCategories
             }]
        }

        const userAgesChartOptions = {
            title: {
              text: "Customer age group statistics"
            },
            theme: 'light2',
            subtitles: [{
                text: "Statistics about the customers registered in the systems based on their age groups"
            }],
            data: [{				
                      type: "column",
                      dataPoints: [
                        { label: "Under 25", y: under25 },
                        { label: "Between 25 and 40",  y: between25and40  },
                        { label: "Between 40 and 65", y: between40and65  },
                        { label: "Over 65", y: over65  }
                    ]
             }]
        }

    
        return (
            <div style={{marginBottom:'20px', marginTop:'20px'}}>  
               
                <CanvasJSChart options = {productChartOptions} />
                <hr
                style={{
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 10
                }}/>
                <CanvasJSChart options = {categoriesChartOptions} />
                <hr
                style={{
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 10
                }}/>
                <CanvasJSChart options = {userAgesChartOptions} />
                <hr
                style={{
                    color: 'rgb(255, 81, 81)',
                    backgroundColor: 'rgb(255, 81, 81)',
                    height: 10
                }}/>
                <CanvasJSChart options = {orderChartOptions} />
            </div>
        );
    }

}

export default StatisticsPage