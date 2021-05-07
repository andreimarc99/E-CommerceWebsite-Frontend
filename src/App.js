import './App.css';
import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Home from "./home/home.js"
import ErrorPage from "./error-page.js"
import "./styles.css"
import NavbarPage from "./nav-bar.js"
import instagram from "./img/instagram_icon.png"
import facebook from "./img/facebook_icon.png"
import email from "./img/gmail_icon.png"
import twitter from "./img/twitter_icon.png"
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

            <div>
              <footer className="bg-danger text-center text-lg-start" style={{color:"white"}}>
                  <p> © eCommerce System </p>
                  <a target="_tab" href="https://www.instagram.com/ut.cluj/">
                  <span
                    id="edit-img"
                    style={{ marginLeft: "2px", marginRight: "2px" }}
                  >
                    <img
                      className="logo"
                      src={instagram}
                      style={{ width: "2%" }}
                      alt="instagram"
                    ></img>
                  </span>
                </a>
                <a target="_tab" href="https://www.facebook.com/ac.utcluj.ro/">
                  <span
                    id="edit-img"
                    style={{ marginLeft: "2px", marginRight: "2px" }}
                  >
                    <img
                      className="logo"
                      src={facebook}
                      style={{ width: "2%" }}
                      alt="facebook"
                    ></img>
                  </span>
                </a>
                <a target="_tab" href="https://mail.google.com">
                  <span
                    id="edit-img"
                    style={{ marginLeft: "2px", marginRight: "2px" }}
                  >
                    <img
                      className="logo"
                      src={email}
                      style={{ width: "2%" }}
                      alt="email"
                    ></img>
                  </span>
                </a>
                <a target="_tab" href="https://twitter.com/utcluj">
                  <span
                    id="edit-img"
                    style={{ marginLeft: "2px", marginRight: "2px" }}
                  >
                    <img
                      className="logo"
                      src={twitter}
                      style={{ width: "2%" }}
                      alt="twitter"
                    ></img>
                  </span>
                </a>
                <br />
                {((localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "" && localStorage.getItem("loggedUser") !== undefined  && JSON.parse(localStorage.getItem("loggedUser")).role === "CUSTOMER") ? 
                <Button onClick={() => {window.location.href="/complaints"}} style={{marginTop:'10px', marginBottom:'10px'}} variant="outline-light">File a complaint</Button> : <div />)}
              </footer>
            </div>
    </div>
  );
}

export default App;
