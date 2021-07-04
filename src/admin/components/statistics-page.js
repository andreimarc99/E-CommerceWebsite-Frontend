import React from 'react';
import {HOST} from "../../commons/hosts"
import axios from 'axios';
import CanvasJSReact from "./canvasjs.react";
import ReactSpinner from 'react-bootstrap-spinner'
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function compareIds(a, b) {
    return a.productId - b.productId;
}

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
            userList: [],
            voucherList: [],
            orderListDone:false,
            productListDone:false,
            userListDone:false,
            voucherListDone:false
        }
        this.fetchOrders = this.fetchOrders.bind(this);
        this.fetchProducts = this.fetchProducts.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.fetchVouchers = this.fetchVouchers.bind(this);
    }

    fetchOrders() {
        axios.get(HOST.backend_api + "/orders/no_images")
        .then(response => {
            this.setState({orderList: response.data, orderListDone: true})
        });
    }

    fetchProducts() {
        axios.get(HOST.backend_api + "/products")
        .then(response => {
            this.setState({productList: response.data, productListDone: true})
        });
    }

    fetchUsers() {
        axios.get(HOST.backend_api + "/users")
        .then(response => {
            this.setState({userList: response.data, userListDone: true})
        });
    }

    fetchVouchers() {
        axios.get(HOST.backend_api + "/vouchers")
        .then(response => {
            this.setState({voucherList: response.data, voucherListDone: true})
        });
    }

    componentDidMount() {
        this.fetchProducts();
        this.fetchOrders();
        this.fetchUsers();
        this.fetchVouchers();
    }

    render() {
        if (localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== undefined) {
            if (JSON.parse(localStorage.getItem("loggedUser")).role === "ADMIN") {
        const {orderList, productList, userList, voucherList} = this.state;
        const {orderListDone, productListDone, userListDone, voucherListDone} = this.state;
        var done = false;
        if (orderListDone === true && productListDone === true && userListDone === true && voucherListDone === true) {
            done = true;
        }
        var delivered = 0;
        var undelivered = 0;
        var products = [];
        var categories = [];
        var userAges = [];
        var under25 = 0;
        var between25and40 = 0;
        var between40and65 = 0;
        var over65 = 0;
        var voucherUsage = [];
        var orderedProducts = [];
        
        if (orderList.length > 0) {
            for (let i = 0; i < orderList.length; ++i) {
                if (orderList[i].delivered === true) {
                    delivered += 1;
                } else {
                    undelivered += 1;
                }
                if (voucherUsage[orderList[i].voucher.voucherId] === undefined) {
                    voucherUsage[orderList[i].voucher.voucherId] = {label: orderList[i].voucher.code, y: 1};
                } else {
                    voucherUsage[orderList[i].voucher.voucherId] = {label: orderList[i].voucher.code, y: voucherUsage[orderList[i].voucher.voucherId].y + 1};
                }
            }
            voucherUsage = voucherUsage.filter(function (el) {
                return el != null;
            });
            if (voucherList.length > 0) {
                for (let i = 0; i < voucherList.length; ++i) {
                    let v = voucherList[i];
                    let found = false;
                    if (voucherUsage.length > 0) {
                        for (let j = 0; j < voucherUsage.length; ++j) {
                            if (voucherUsage[j].label === v.code) {
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found) {
                        voucherUsage.push({label: v.code, y: 0});
                    }
                }
            }     
        }

        if (productList.length > 0) {
            orderedProducts = productList.sort(compareIds);
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
        products = products.filter(function (el) {
            return el.y != 0;
        });

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

        const vouchersChartOptions = {
            title: {
              text: "Vouchers statistics"
            },
            theme: 'light2',
            subtitles: [{
                text: "Statistics about the vouchers registered in the system and how many times they have been used"
            }],
            data: [{				
                      type: "column",
                      dataPoints: voucherUsage
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
            <div>  
                <h1 style={{backgroundColor:'rgb(220,53,69)', color:'white'}}>STATISTICS</h1>
               {(done === false ? <div style={{marginTop:'30px', marginBottom:'30px'}}> <ReactSpinner  type="border" color="danger" size="2" /></div> : 
               <div style={{marginBottom:'20px', marginTop:'20px', marginLeft: '150px', marginRight: '150px'}}>
                   <div data-aos="fade-up" data-aos-duration="1000">
                   <CanvasJSChart options = {productChartOptions} />
                    <hr
                    style={{
                        color: 'rgb(220,53,69)',
                        backgroundColor: 'rgb(220,53,69)',
                        height: 10
                    }}/></div>

                    <div data-aos="fade-up" data-aos-duration="1000">
                    <CanvasJSChart options = {categoriesChartOptions} />
                    <hr
                    style={{
                        color: 'rgb(220,53,69)',
                        backgroundColor: 'rgb(220,53,69)',
                        height: 10
                    }}/></div>

                    <div data-aos="fade-up" data-aos-duration="1000">
                    <CanvasJSChart options = {userAgesChartOptions} />
                    <hr
                    style={{
                        color: 'rgb(220,53,69)',
                        backgroundColor: 'rgb(220,53,69)',
                        height: 10
                    }}/></div>

                    <div data-aos="fade-up" data-aos-duration="1000">    
                    <CanvasJSChart options = {vouchersChartOptions} />
                    <hr
                    style={{
                        color: 'rgb(220,53,69)',
                        backgroundColor: 'rgb(220,53,69)',
                        height: 10
                    }}/></div>
                    <div data-aos="fade-up" data-aos-duration="1000">
                    <CanvasJSChart options = {orderChartOptions} />
                    <hr
                    style={{
                        color: 'rgb(220,53,69)',
                        backgroundColor: 'rgb(220,53,69)',
                        height: 10
                    }}/></div>

                    <div data-aos="fade-up" data-aos-duration="1000">
                    <h3>Top rated products</h3>
                    <p className="text-muted">using IMDb's product ranking formula</p>
                    <div className="row">
                        <div className="col"><img src={HOST.flask_api + "/popular_products"} alt="popular" /></div>
                        <div className="col">
                            <table className="table table-striped table-bordered tbl-orders" style={{display:'inline-block', overflow:'auto', height:'600px', width:'80%', marginBottom:'50px'}}>
                                <thead className="tbl-head">
                                    <tr>
                                        <th className="text-center" width='50px'> ID</th>
                                        <th className="text-center"> Product</th>
                                    </tr>
                                </thead>
                                <tbody>{
                                orderedProducts.map((product) => 
                                    <tr key={product.productId}>
                                        <td className="text-center"> <b>{product.productId}</b></td>
                                        <td className="text-center"> {product.name}</td>
                                    </tr>)
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <hr
                    style={{
                        color: 'rgb(220,53,69)',
                        backgroundColor: 'rgb(220,53,69)',
                        height: 10
                    }}/>
                    </div>

                    <div data-aos="fade-up" data-aos-duration="1000">
                    <h3>Customer segmentation by gender</h3>
                    <img src={HOST.flask_api + "/genders"} alt="gender_segm" />

                    <hr
                    style={{
                        color: 'rgb(220,53,69)',
                        backgroundColor: 'rgb(220,53,69)',
                        height: 10
                    }}/>
                    </div>

                    <div data-aos="fade-up" data-aos-duration="1000">
                    <h3>Customer segmentation by performing k-means clustering</h3>
                    <h5 className="text-muted">depending on age and total money spent on the platform</h5>
                    <img src={HOST.flask_api + "/clustering/age"} alt="Age-Money Clustering"/>

                    <hr
                    style={{
                        color: 'rgb(220,53,69)',
                        backgroundColor: 'rgb(220,53,69)',
                        height: 10
                    }}/>
                    </div>

                    <div data-aos="fade-up" data-aos-duration="1000">
                    <h3>Customer segmentation by performing k-means clustering</h3>
                    <h5 className="text-muted">depending on gender and total money spent on the platform</h5>
                    <img src={HOST.flask_api + "/clustering/gender"} alt="Gender-Money Clustering"/>
                    </div>
               </div> 
               
               )}
                
            </div>
        );
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

export default StatisticsPage