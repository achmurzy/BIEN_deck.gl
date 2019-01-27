import React, {Component} from 'react';
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
  DropdownItem } from 'reactstrap';

export default class Header extends Component
{
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return(
      <Navbar color="light" light expand="md">
        {/*<NavbarToggler onClick={this.toggle}/>*/}
        <NavbarBrand href="/">Home</NavbarBrand>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="http://bien.nceas.ucsb.edu/bien/">BIEN</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="http://bien.nceas.ucsb.edu/bien/biendata/bien-4/">About</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="http://biendata.nceas.ucsb.edu/methods.php">Methods</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="http://biendata.nceas.ucsb.edu/newLogR.php">Report Issues</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="http://biendata.nceas.ucsb.edu/newLog.php">Login</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}