import React, {useEffect, useState, useRef} from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { gsap } from "gsap";
import Welcome from './components/Welcome'

function App() {

  const cardRef = useRef();

  useEffect(() => {
    gsap.to(cardRef.current, { rotation: "+=360" });
  });

  return (
    <>
      <Navbar bg="danger" variant="dark">
        <Container>
          <Navbar.Brand href="/" className="fw-bold text-light">T.A.G.</Navbar.Brand>
        </Container>
      </Navbar>
      <Welcome />
      {/* <Container>
        <div className="pt-3 pb-5">
          <Row>
            <Col lg={10}>
              <Card>
                <Card.Body>
                  <Card.Text>
                  What does HTML stand for?
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col className="mt-3 mt-lg-0">
              <Card ref={cardRef}>
                <ListGroup variant="flush">
                  <ListGroup.Item>Player 1 - 100 pts</ListGroup.Item>
                  <ListGroup.Item>Player 2 - 200 pts</ListGroup.Item>
                  <ListGroup.Item>Player 3 - 300 pts</ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>

          </Row>
        </div>
      </Container> */}
    </>
  );
}

export default App;
