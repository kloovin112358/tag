import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import React, { useEffect, useContext, useState } from 'react';
import Fade from 'react-reveal/Fade';
import Bounce from 'react-reveal/Bounce';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Players from './Players';
import GameContent from './GameContent';
import Form from 'react-bootstrap/Form'
import CircleLoader from "react-spinners/CircleLoader";
import {dummyPlayers} from '../dummy';
import { socket, SocketContext } from '../socket';

function GameScreen(props) {

    const socket = useContext(SocketContext);
    let [loading, setLoading] = useState(false);
    const [players, setPlayers] = useState(dummyPlayers);
    const gameUrlId = window.location.pathname.split('/')[1]

    const renderTooltip = () => (
        <Tooltip>
          wagewge
        </Tooltip>
      );
    
    useEffect(() => {
        socket.on('gotPlayers', data => {
            setPlayers(data)
        })
    }, [socket]);

    // useEffect(() => {
    //     socket.emit("getPlayers", gameUrlId)
    // }, []);

    // players example:

    
    return (
        <>
            <Container>
                <div className="pt-3 pb-5">
                    <Row>
                        <Col xl={10}>
                            <Card>
                                <GameContent 

                                />
                                <Card.Footer>

                                    <div className="d-flex justify-content-center">
                                        {/* TODO overlay is broken */}
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
                            <Players 
                                players={players}
                            />
                        </Col>

                    </Row>
                </div>
            </Container>
        </>
    );
}

export default GameScreen;