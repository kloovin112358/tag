import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import React, { useEffect, useRef } from 'react';
import Fade from 'react-reveal/Fade';
import Bounce from 'react-reveal/Bounce';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Players from './Players'
import Form from 'react-bootstrap/Form'

function GameScreen() {
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
          Placeholder TOOD TODO TODO OTDO ODTO ODO OOD O put tstuff hiere
        </Tooltip>
      );
    return (
        <>
            <Container>
                <div className="pt-3 pb-5">
                    <Row>
                        <Col xl={10}>
                            <Card>
                                <Card.Body className="text-center">
                                    <p className="display-1 fw-bold p-5">HTML</p>

                                </Card.Body>
                                <Card.Footer>

                                    <div className="d-flex justify-content-center">
                                        <OverlayTrigger
                                            placement="bottom"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={renderTooltip}
                                        >
                                            <i className="bi bi-question-circle pe-2 align-self-center"></i>
                                        </OverlayTrigger>
                                            <Form.Control type="text" placeholder="Don't be boring now" maxLength={35} style={{ maxWidth: '25rem' }} />
                                            <Button variant="info" className="text-white ms-2">Submit</Button>
                                    </div>

                                </Card.Footer>
                            </Card>
                        </Col>
                        <Col className="mt-3 mt-xl-0">
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