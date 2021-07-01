import './App.css';
import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Home from "./home/home.js"
import ErrorPage from "./error-page.js"
import "./styles.css"
import NavbarPage from "./nav-bar.js"
import ProductStockPage from './admin/components/product-stock-page';
import ProductPage from './product/component/product-page';
import Login from "./login/login-page"
import Register from "./register/register-page"
import UserPage from './user/component/user-page';
import CategoryPage from './product/component/category-page';
import FavoritesPage from './user/component/favorites-page';
import CartPage from './user/component/cart-page';
import OrderPage from './user/component/order-page';
import ThankYou from "./thank-you-page"
import ComplaintCustomerPage from "./complaint/component/complaint-customer-page"
import { Button } from 'react-bootstrap';
import OrderHistoryPage from './user/component/order-history-page';
import OrdersAdminPage from './admin/components/orders-admin-page';
import StatisticsPage from './admin/components/statistics-page';
import ComplaintsAdminPage from './admin/components/complaints-admin-page';
import VouchersAdminPage from './admin/components/vouchers-admin-page';
import OrdersDeliveryPage from './delivery/components/orders-delivery-page';
import {EmailTest} from './email-test';
import ecomsyst from "./img/ecomsyst.png";
import UserBansPage from './admin/components/user-bans-list-page';

function App() {
  return (
    <div className="App">
      <Router>
                <NavbarPage />

                    <Switch>

                        <Route
                            exact
                            path='/'
                            render={() => <Home />}
                        />

                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage/>}
                        />

                        <Route 
                            exact 
                            path='/product_stock_page'
                            render={() => <ProductStockPage /> }
                        />


                        <Route 
                            exact 
                            path='/login'
                            render={() => <Login /> }
                        />

                        <Route 
                            exact 
                            path='/register'
                            render={() => <Register /> }
                        />

                        <Route 
                            exact 
                            path='/thank_you'
                            render={() => <ThankYou /> }
                        />

                        <Route 
                            exact 
                            path='/complaints'
                            render={() => <ComplaintCustomerPage /> }
                        />

                        <Route 
                            exact 
                            path='/orders_admin_page'
                            render={() => <OrdersAdminPage /> }
                        />

                        <Route 
                            exact 
                            path='/stats_admin_page'
                            render={() => <StatisticsPage /> }
                        />

                        <Route 
                            exact 
                            path='/complaints_admin_page'
                            render={() => <ComplaintsAdminPage /> }
                        />

                        <Route 
                            exact 
                            path='/vouchers_admin_page'
                            render={() => <VouchersAdminPage /> }
                        />

                        <Route 
                            exact 
                            path='/user_ban_list'
                            render={() => <UserBansPage /> }
                        />

                        <Route 
                            exact 
                            path='/orders_delivery_page'
                            render={() => <OrdersDeliveryPage /> }
                        />

                        <Route 
                            exact 
                            path='/email_test'
                            render={() => <EmailTest /> }
                        />

                    <Route path="/user_page/:username" render={(props) => <UserPage {...props} key={Date.now()}/>}/>

                    <Route path="/product_page/:id" render={(props) => <ProductPage {...props} key={Date.now()}/>}/>

                    <Route path="/category/:name" render={(props) => <CategoryPage {...props} key={Date.now()}/>}/>

                    <Route path="/fav_products/:username" render={(props) => <FavoritesPage {...props} key={Date.now()}/>}/>

                    <Route path="/cart/:username" render={(props) => <CartPage {...props} key={Date.now()}/>}/>

                    <Route path="/order/:username/:date" render={(props) => <OrderPage {...props} key={Date.now()}/>}/>

                    <Route path="/order_history/:username" render={(props) => <OrderHistoryPage {...props} key={Date.now()}/>}/>
                        <Route render={() =><ErrorPage />} />
                    </Switch>
            </Router>

              <footer className="bg-danger text-center text-lg-start" style={{color:"white"}}>
                 <img src={ecomsyst} style={{height:'70px'}}/>
                <br />
                {((localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "" && localStorage.getItem("loggedUser") !== undefined  && JSON.parse(localStorage.getItem("loggedUser")).role === "CUSTOMER") ? 
                <Button onClick={() => {window.location.href="/complaints"}} style={{marginTop:'5px', marginBottom:'10px'}} variant="outline-light">File a complaint</Button> : <div />)}
              </footer>
    </div>
  );
}

export default App;
