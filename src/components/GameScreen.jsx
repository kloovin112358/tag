import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import React, { useEffect, useRef } from 'react';
import Fade from 'react-reveal/Fade';
import Bounce from 'react-reveal/Bounce';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Players from './Players'
import Form from 'react-bootstrap/Form'

function GameScreen() {
    return (
        <>
            <Container>
                <div className="pt-3 pb-5">
                    <Row>
                        <Col lg={10}>
                            <Card>
                                <Card.Body className="text-center">
                                    <p className="display-1 fw-bold p-5">HTML</p>
                                    
                                </Card.Body>
                                <Card.Footer>
                                    <div className="d-flex justify-content-center">
                                    <Form.Control type="text" placeholder="Don't be boring now" maxLength={25} style={{maxWidth:'25rem'}} />
                                    <Button variant="info" className="text-white ms-2">Submit</Button>
                                    </div>
                                    
                                </Card.Footer>
                            </Card>
                        </Col>
                        <Col className="mt-3 mt-lg-0">
                            <Card>
                                <Players />

                            </Card>
                        </Col>

                    </Row>
                </div>
            </Container>
        </>
    );
}

export default GameScreen;