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
  DropdownItem
} from 'reactstrap';

import {Form, FormControl, Button} from "react-bootstrap"

import "./styles.css"
import logo from "./img/logo.png"

const NavbarPage = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

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
            <NavItem>
              <NavLink href="/product_stock_page" style={{color:"white"}}>Products</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret style={{color:"white"}}>
                My account
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem style={{color:"red"}}>
                  Option 1
                </DropdownItem>
                <DropdownItem style={{color:"red"}}>
                  Option 2
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem style={{color:"red"}}>
                  Login
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <Form inline>
      <FormControl type="search" placeholder="Search product..." className="mr-sm-2" />
      <Button variant="outline-light">Search</Button>
    </Form>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavbarPage;