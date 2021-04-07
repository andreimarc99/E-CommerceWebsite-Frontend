import './App.css';
import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Home from "./home/home.js"
import ErrorPage from "./error-page.js"
import "./styles.css"
import NavbarPage from "./nav-bar.js"
import instagram from "./img/instagram.png"
import facebook from "./img/facebook.png"
import location from "./img/location.png"
import email from "./img/email.png"
import twitter from "./img/twit.png"
import ProductStockPage from './admin/components/product-stock-page';

function App() {
  return (
    <div className="App">
      <Router>
                <NavbarPage />

                    <Switch>

                        <Route
                            exact
                            path='/'
                            render={() => <Home/>}
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

                        <Route render={() =><ErrorPage/>} />
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
                <a
                  target="_tab"
                  href="https://www.google.com/maps/place/Facultatea+de+Automatic%C4%83+%C8%99i+Calculatoare/@44.4359395,26.0425057,15z/data=!4m5!3m4!1s0x40b201ebafcdf7a3:0xeafb513bd76c5277!8m2!3d44.4357327!4d26.0477521"
                >
                  <span
                    id="edit-img"
                    style={{ marginLeft: "2px", marginRight: "2px" }}
                  >
                    <img
                      className="logo"
                      src={location}
                      style={{ width: "2%" }}
                      alt="location"
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

              </footer>
            </div>
    </div>
  );
}

export default App;
