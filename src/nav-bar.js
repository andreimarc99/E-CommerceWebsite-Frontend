import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';

import {Form, FormControl, Button} from "react-bootstrap"

import "./styles.css"
import logo from "./img/logo.png"
import account from "./img/account.png"
import cart from "./img/cart.png"
import logout from "./img/log-out.png"

import {Link} from 'react-router-dom'
import UserPage from "./user/component/user-page"

const NavbarPage = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const handleAccountClick = () => {
    window.location.href="/login";
  }

  const handleLogout = () => {
    console.log(localStorage.getItem("loggedUser"))
    localStorage.removeItem('loggedUser');
    window.location.href = "/";
  }

  return (
    <div>
      <Navbar color="danger" light expand="md">
      <a href="/" className="navbar-brand">
            <img className="logo" src={logo} height="70" alt="logo"></img>
        </a>
        <NavbarBrand href="/" style={{color:"white"}}>
          eCommerce System
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            {(JSON.stringify(localStorage.getItem("loggedUser")).role === "ADMIN") ?
            <NavItem>
              <NavLink href="/product_stock_page" style={{color:"white"}}>Products</NavLink>
            </NavItem> : <div />
            }
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
              <img onClick={handleAccountClick} src={account} height="30" alt="account" style={{marginLeft:'30px'}}></img>
              )
              }
                
                <img src={cart} height="30" alt="cart" className="logo" style={{marginLeft:'20px', marginRight:'10px'}}></img>
                {((localStorage.getItem("loggedUser") !== null && localStorage.getItem("loggedUser") !== "") ? <img onClick={handleLogout} src={logout} height="30" alt="cart" className="logo" style={{marginLeft:'20px', marginRight:'10px'}}></img> : <div />)}
        </Form>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavbarPage;