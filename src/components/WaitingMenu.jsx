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

function WaitingMenu() {
    return (
        <>
            <Container>
                <div className="pt-3 pb-5">
                    <Card>
                        <Card.Body className="text-center">
                            <p className="display-5">Waiting for players...</p><hr className="mb-3"></hr>
                            <div className="d-flex justify-content-center flex-wrap">
                                <Bounce forever='true' duration={5000}>
                                <p className="display-5 py-3 px-5 fw-bold">Bob</p>
                                </Bounce>
                                <Bounce forever='true' duration={5000}>
                                <p className="display-5 py-3 px-5 fw-bold">Joiupoiu</p>
                                </Bounce>
                                <Bounce forever='true' duration={5000}>
                                <p className="display-5 py-3 px-5 fw-bold">Joiupoiu</p>
                                </Bounce>
                                <Bounce forever='true' duration={5000}>
                                <p className="display-5 py-3 px-5 fw-bold">Joiupoiu</p>
                                </Bounce>
                                <Bounce forever='true' duration={5000}>
                                <p className="display-5 py-3 px-5 fw-bold">Joiupoiu</p>
                                </Bounce>
                                <Bounce forever='true' duration={5000}>
                                <p className="display-5 py-3 px-5 fw-bold">Joiupoiu</p>
                                </Bounce>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </>
    );
}

export default WaitingMenu;