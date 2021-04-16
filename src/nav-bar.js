import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import {Form, FormControl, Button} from "react-bootstrap"

import "./styles.css"
import logo from "./img/logo.png"
import account from "./img/account.png"
import cart from "./img/cart.png"
import logout from "./img/log-out.png"
import heart from "./img/heart.png"

import {Link} from 'react-router-dom'
import UserPage from "./user/component/user-page"
import * as CATEGORY_API from "./product/api/category-api"

class NavbarPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      categoryList: [],
      areCategoriesLoaded: false,
      errorStatus: 0,
      error: ''
    }

    this.handleAccountClick = this.handleAccountClick.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }
  
  componentDidMount() {
    this.fetchCategories();
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

  handleFavoritesClick() {
  }

  handleLogout() {
    console.log(localStorage.getItem("loggedUser"))
    localStorage.removeItem('loggedUser');
    window.location.href = "/";
  }

  render() {
    const {categoryList} = this.state;
    console.log(categoryList);
    return (
      <div>
        <Navbar color="danger" light expand="md">
        <a href="/" className="navbar-brand">
              <img className="logo" src={logo} height="70" alt="logo"></img>
          </a>
          <NavbarBrand href="/" style={{color:"white"}}>
            eCommerce System
          </NavbarBrand>
            <Nav className="mr-auto" navbar>
              {(JSON.stringify(localStorage.getItem("loggedUser")).role === "ADMIN") ?
              <NavItem>
                <NavLink href="/product_stock_page" style={{color:"white"}}>Products</NavLink>
              </NavItem> : <div />
              }

              
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle style={{color:'white'}} nav caret>
                  Products
                </DropdownToggle>
                <DropdownMenu right>
                <DropdownItem><b>Categories</b></DropdownItem>
                <DropdownItem divider />
                  {((categoryList.length > 0) ? categoryList.map((category) => 
                  <Link style={{textDecoration:"none", color:"white"}} to={{ pathname: `/category/${category.name}`, state: { categoryName: category.name } }}>
                  <DropdownItem>{category.name}</DropdownItem>
                  </Link> )
                  : <div />)}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
            <Form inline>
            <FormControl type="search" placeholder="Search product..." className="mr-sm-2" />
            <Button variant="outline-light">Search</Button>
              {
              ((localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "" && localStorage.getItem("loggedUser") !== undefined) ? 
              <Link style={{textDecoration:"none", color:"white"}} to={{ pathname: `/user_page/${JSON.parse(localStorage.getItem("loggedUser")).username}`, state: { user: localStorage.getItem("loggedUser") } }}>
                <img src={account} height="30" alt="account" style={{marginLeft:'30px'}}></img>
              </Link>
              :
              <img onClick={this.handleAccountClick} src={account} height="30" alt="account" style={{marginLeft:'30px'}}></img>
              )
              }
                
                {
              ((localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "" && localStorage.getItem("loggedUser") !== undefined) ? 
              <Link style={{textDecoration:"none", color:"white"}} to={{ pathname: `/fav_products/${JSON.parse(localStorage.getItem("loggedUser")).username}`, state: { username: JSON.parse(localStorage.getItem("loggedUser")).username } }}>
                <img src={heart} className="logo" height="30" alt="account" style={{marginLeft:'20px'}}></img>
              </Link>
              :
                <div />
              )
              }

                <img src={cart} height="30" alt="cart" className="logo" style={{marginLeft:'20px', marginRight:'10px'}}></img>
                {((localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "") ? <img onClick={this.handleLogout} src={logout} height="30" alt="cart" className="logo" style={{marginLeft:'20px', marginRight:'10px'}}></img> : <div />)}
              </Form>
            </Navbar>
        </div>
      );
    }
}

export default NavbarPage;