import React, { Component, useEffect, useState } from 'react';
import {Nav, Navbar, NavItem, NavDropdown, Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';


// function Navigation(props) {
class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputs : [{
        email : '',
        password : '',
      }],
      show : false
    }
    // const [show, setShow] = useState(false);
  
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    // const 
  }

  loginSend(event) {
    event.preventDefault()
    fetch("https://api.staticman.net/...", {
      method: "POST",
      body: this.state.inputs
    })
  }

  render(){return (
      <Navbar collapseOnSelect expand="lg" bg={this.props.bg} variant="dark">
        <Navbar.Brand href="/" className="logo">
          ACalendar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link className="navlink-btn" href="/calendar">NAPTÁR</Nav.Link>
            <Nav.Link className="navlink-btn" href="/categories">KATEGÓRIÁK</Nav.Link>
            <Nav.Link className="navlink-btn" href="/tags">CÍMKÉK</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="#deets" variant="primary"  onClick={() => this.setState({ show: !this.state.show })}>Bejelentkezés</Nav.Link>


            <Modal show={this.state.show} onHide={() => this.setState({ show: !this.state.show })}>
              <Modal.Header closeButton>
                <Modal.Title>Bejelentkezés</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Form>
                <Form.Row>
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Email cím:</Form.Label>
                    <Form.Control type="email" name="email" value="" onChange={(input) => this.setState({ imputs:[{email:input.target.value}] })}/>
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Jelszó:</Form.Label>
                    <Form.Control type="password" name="password"  value="" onChange={(input) => this.setState({ imputs:[{password:input.target.value}] })}/>
                  </Form.Group>
                </Form.Row>
              </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => this.setState({ show: !this.state.cshow })}>
                  Mégse
                </Button>
                <Button variant="primary" onClick={this.loginSend}>
                  Bejelentkezés
                </Button>
              </Modal.Footer>
            </Modal>


          </Nav>
        </Navbar.Collapse>
      </Navbar>
      
  )};
}
  
export default Navigation;