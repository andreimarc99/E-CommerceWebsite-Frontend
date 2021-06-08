import React from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import Select from "react-select";
import {Form, Button} from "react-bootstrap"

import "./styles.css"
import account from "./img/account.png"
import cart from "./img/cart.png"
import logout from "./img/log-out.png"
import heart from "./img/heart.png"
import bear from "./img/bear.png"
import history from "./img/history.png"
import voucher from "./img/voucher.png"
import complaint from "./img/complaint.png"
import stats from "./img/stats.png"
import orders from "./img/orders.png"
import stock from "./img/stock.png"
import product_search from "./img/product.png"

import {Link} from 'react-router-dom'
import * as CATEGORY_API from "./product/api/category-api"
import * as API_PRODUCT from "./product/api/product-api"

class NavbarPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      categoryList: [],
      areCategoriesLoaded: false,
      productList: [],
      errorStatus: 0,
      error: '',
      product: {label: 'Search products...', value: {}},
      productId: 0
    }

    this.handleAccountClick = this.handleAccountClick.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleProductPick = this.handleProductPick.bind(this);
  }

  fetchProducts() {
    return API_PRODUCT.getProductsWithImages((result, status, err) => {
        if (result !== null && status === 200) {
            this.setState({
                productList: result
            });
        } else {
            this.setState(({
                errorStatus: status,
                error: err
            }));
        }
    })
}
  
  componentDidMount() {
    this.fetchProducts();
    this.fetchCategories();
  }

  handleProductPick = product => 
  {
    this.setState({product:product, productId: product.value.productId});
  }

  fetchCategories() {
    return CATEGORY_API.getCategories((result, status, err) => {
      if (result !== null && status === 200) {
          this.setState({
            categoryList: result,
            areCategoriesLoaded: true
          });
      } else {
          this.setState(({
            errorStatus: status,
            error: err
          }));
      }
  })
  }

  handleAccountClick() {
    window.location.href="/login";
  }

  handleLogout() {
    localStorage.removeItem('loggedUser');
    window.location.href = "/";
  }

  render() {
    const {categoryList, productList, product, productId} = this.state;
    var productOptions = [];
    if (productList.length > 0) {
      productOptions = productList.map( (p) => ({
        value: p,
        label: p.name
    }));
    }
    return (
      <div>
        <Navbar color="danger" light expand="md">
        <a href="/" className="navbar-brand lower-zoom">
              <img className="logo" src={bear} height="33" alt="logo"></img>
          </a>
          <NavbarBrand href="/" style={{color:"white"}}>
            eComSystem
          </NavbarBrand>
            <Nav className="mr-auto" navbar>
              {(localStorage.getItem("loggedUser") !== null ? (JSON.parse(localStorage.getItem("loggedUser")).role === "ADMIN" ?
              <NavItem>
                <NavLink href="/product_stock_page" style={{color:"white"}}>
                  <div id="side-menu">
                <img src={stock} className="logo" height="30" alt="stock" style={{marginRight:'3px'}}></img><span>PRODUCT STOCK</span>
                </div></NavLink>
              </NavItem> : <div />) : <div />)
              }

              {(localStorage.getItem("loggedUser") !== null ? (JSON.parse(localStorage.getItem("loggedUser")).role === "ADMIN" ?
              <NavItem>
                <NavLink href="/orders_admin_page" style={{color:"white"}}>
                  
                <div id="side-menu">
                <img src={orders} className="logo" height="30" alt="orders" style={{marginRight:'3px'}}></img><span>ORDERS</span>
                </div>
                </NavLink>
              </NavItem> : <div />) : <div />)
              }

            {(localStorage.getItem("loggedUser") !== null ? (JSON.parse(localStorage.getItem("loggedUser")).role === "ADMIN" ?
              <NavItem>
                <NavLink href="/stats_admin_page" style={{color:"white"}}>
                <div id="side-menu">
                <img src={stats} className="logo" height="30" alt="stats" style={{marginRight:'3px'}}></img><span>STATISTICS</span>
                </div>
                </NavLink>
              </NavItem> : <div />) : <div />)
              }

              {(localStorage.getItem("loggedUser") !== null ? (JSON.parse(localStorage.getItem("loggedUser")).role === "ADMIN" ?
              <NavItem>
                <NavLink href="/complaints_admin_page" style={{color:"white"}}>
                <div id="side-menu">

                <img src={complaint} className="logo" height="30" alt="complaints" style={{marginRight:'3px'}}></img><span>COMPLAINTS</span>
                </div>
                  </NavLink>
              </NavItem> : <div />) : <div />)
              }

              {(localStorage.getItem("loggedUser") !== null ? (JSON.parse(localStorage.getItem("loggedUser")).role === "ADMIN" ?
              <NavItem>
                <NavLink href="/vouchers_admin_page" style={{color:"white"}}> 
                <div id="side-menu">
                <img src={voucher} className="logo" height="30" alt="vouchers" style={{marginRight:'3px'}}></img><span>VOUCHERS</span>
                </div>
                </NavLink>
              </NavItem> : <div />) : <div />)
              }
              
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle style={{color:'white'}} nav caret>
                <img src={product_search} className="logo lower-zoom" height="30" alt="products" style={{marginRight:'3px'}}></img>
                </DropdownToggle>
                <DropdownMenu right>
                <DropdownItem header>CATEGORIES</DropdownItem>
                <DropdownItem divider />
                  {((categoryList.length > 0) ? categoryList.map((category) => 
                  <Link style={{textDecoration:"none", color:"white"}} to={{ pathname: `/category/${category.name}`, state: { categoryName: category.name } }}>
                  <DropdownItem>{category.name}</DropdownItem>
                  </Link> )
                  : <div />)}
                </DropdownMenu>
              </UncontrolledDropdown>
                  
              {(localStorage.getItem("loggedUser") !== null ? (JSON.parse(localStorage.getItem("loggedUser")).role === "DELIVERY_GUY" ?
              <NavItem>
                <NavLink href="/orders_delivery_page" style={{color:"white"}}>
                <div id="side-menu">
                <img src={orders} className="logo" height="30" alt="orders" style={{marginRight:'3px'}}></img><span>ORDERS</span>
                </div>

                </NavLink>
              </NavItem> : <div />) : <div />)
              }

            </Nav>
            <Form inline>
            <div style={{width:'200px'}}>
              <Select placeholder="Search products..." options={productOptions} value={this.state.product} onChange={this.handleProductPick}/>
            </div>
            <Link style={{textDecoration:"none", color:"white"}} to={{ pathname: `/product_page/${productId}`, state: { product: product.value } }}>
            <Button disabled={product.label === "Search products..."} style={{marginLeft:'10px'}} variant="outline-light"> GO </Button>
            </Link>
              {
              ((localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "" && localStorage.getItem("loggedUser") !== undefined) ? 
              <Link style={{textDecoration:"none", color:"white"}} to={{ pathname: `/user_page/${JSON.parse(localStorage.getItem("loggedUser")).username}`, state: { user: localStorage.getItem("loggedUser") } }}>
                 <div id="side-menu">
                <img src={account} className="logo" height="30" alt="account" style={{marginLeft:'10px', marginRight:'3px'}}></img><span>ACCOUNT</span>
                </div>
              </Link>
              :
              
              <img className="lower-zoom logo" onClick={this.handleAccountClick} src={account} height="30" alt="account" style={{marginLeft:'20px', marginRight:'10px'}}></img>
              )
              }
                
                {
              ((localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "" && localStorage.getItem("loggedUser") !== undefined && JSON.parse(localStorage.getItem("loggedUser")).role === "CUSTOMER") ? 
              <Link style={{textDecoration:"none", color:"white"}} to={{ pathname: `/fav_products/${JSON.parse(localStorage.getItem("loggedUser")).username}`, state: { username: JSON.parse(localStorage.getItem("loggedUser")).username } }}>
                <div id="side-menu">
                <img src={heart} className="logo" height="30" alt="heart" style={{marginLeft:'10px', marginRight:'3px'}}></img><span>FAVORITES</span>
                </div>
              </Link>
              :
                <div />
              )
              }
              {
              ((localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "" && localStorage.getItem("loggedUser") !== undefined  && JSON.parse(localStorage.getItem("loggedUser")).role === "CUSTOMER") ? 
              <Link style={{textDecoration:"none", color:"white"}} to={{ pathname: `/cart/${JSON.parse(localStorage.getItem("loggedUser")).username}`, state: { username: JSON.parse(localStorage.getItem("loggedUser")).username } }}>
                <div id="side-menu">
                <img src={cart} className="logo" height="30" alt="cart" style={{marginLeft:'10px', marginRight:'3px'}}></img><span>CART</span>
                </div>              
                </Link>
              :
                <div />
              )
              }
              {
              ((localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "" && localStorage.getItem("loggedUser") !== undefined  && JSON.parse(localStorage.getItem("loggedUser")).role === "CUSTOMER") ? 
              <Link style={{textDecoration:"none", color:"white"}} to={{ pathname: `/order_history/${JSON.parse(localStorage.getItem("loggedUser")).username}`, state: { username: JSON.parse(localStorage.getItem("loggedUser")).username } }}>
                <div id="side-menu">
                <img src={history} className="logo" height="30" alt="history" style={{marginLeft:'10px', marginRight:'3px'}}></img><span>HISTORY</span>
                </div>  
              </Link>
              :
                <div />
              )
              }
                {((localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "") ? <img onClick={this.handleLogout} src={logout} height="30" alt="cart" className="logo lower-zoom" style={{marginLeft:'20px'}}></img> : <div />)}
              </Form>
            </Navbar>
        </div>
      );
    }
}

export default NavbarPage;