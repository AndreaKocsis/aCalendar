import React, { Component, useEffect, useState } from 'react';
import axios from "axios";
import {Login} from './auth/Login'
import {Logout} from './auth/Logout'
import {Nav, Navbar, NavItem, NavDropdown, Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';


// function Navigation(props) {
class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password : '',
      msg: "",
      isLoading: false,
      redirect: false,
      errMsg: "",
      show : false,
      ifnotrender : false,
      isLoading: true 
    }

    this.onChangehandler = this.onChangehandler.bind(this);
    this.loginHandler = this.loginHandler.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
  }

  onChangehandler(e){
    let name = e.target.name;
    let value = e.target.value;
    let data = {};
    data[name] = value;
    data['errMsg'] = false;
    data['msg'] = false;
    this.setState(prevState => data);
  };

  loginHandler(){
    axios.post(`${process.env.MIX_DOMAIN}/api/user-login`, {
      email: this.state.email,
      password: this.state.password,
    })
    .then((response) => {
      this.setState({ isLoading: false });
      if (response.data.status === 200) {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userData", JSON.stringify(response.data.data));
        this.setState({msg : response.data.message})
        this.setState({redirect : true})

      } if (response.data.status === "failed" &&response.data.success === undefined) {
        this.setState({errMsg : 'Nem megfelelő a felhasználónév vagy a jelszó!'})

      } else if ( response.data.status === "failed" && response.data.success === false) {
        this.setState({errMsg : response.data.message})
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  logoutHandler(){
    localStorage.clear();
    this.setState({redirect : true})
  }


  render(){
    const login = localStorage.getItem("isLoggedIn");
    return (
      <Navbar collapseOnSelect expand="lg" bg={this.props.bg} variant="dark">
        <Navbar.Brand href="/" className="logo">
          ACalendar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav">
          {/* középső menü */}
          {login ? (
            <Nav className="mr-auto">
              <Nav.Link className="navlink-btn" href="/calendar">NAPTÁR</Nav.Link>
              <Nav.Link className="navlink-btn" href="/categories">KATEGÓRIÁK</Nav.Link>
              <Nav.Link className="navlink-btn" href="/tags">CÍMKÉK</Nav.Link>
            </Nav>

          ) : ( 
            <Nav className="mr-auto">
            </Nav>
          )}

          {/* jobbszélső menü */}
          {login ? (
            <Nav>
            <Nav.Link href="#" variant="primary"  onClick={() => this.logoutHandler()}>Kijelentkezés</Nav.Link>
            </Nav>
          ):(
            <Nav>
              <Nav.Link href="#" variant="primary"  onClick={() => this.setState(state => ({ show: !this.state.show }))}>Bejelentkezés</Nav.Link>


              <Modal show={this.state.show} onHide={() => this.setState({ show: !this.state.show })}>
                <Modal.Header closeButton>
                  <Modal.Title>Bejelentkezés</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                  <Form.Row>
                    <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label>Email cím:</Form.Label>
                      <Form.Control type="email" name="email" value={this.state.email || ''} onChange={this.onChangehandler}/>
                      <span className="text-danger">{this.state.msg}</span>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                      <Form.Label>Jelszó:</Form.Label>
                      <Form.Control type="password" name="password"  value={this.state.password || ''} onChange={this.onChangehandler}/>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <p className="text-danger">{this.state.errMsg}</p>
                  </Form.Row>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.setState({ show: !this.state.cshow })}>
                    Mégse
                  </Button>
                  <Button variant="primary" onClick={() => this.loginHandler()}>
                    Bejelentkezés
                  </Button>
                </Modal.Footer>
              </Modal>

            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
      
  )};
}
  
export default Navigation;