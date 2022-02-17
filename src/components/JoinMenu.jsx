import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import React, { useEffect, useRef } from 'react';
import Fade from 'react-reveal/Fade';

function JoinMenu() {
    return (
        <>
            <Container>
                <div className="pb-5 pt-3">


                    <div className="row">
                        <div className="col-md">
                            <Fade duration={2500}>
                                <Card
                                    text="secondary"
                                >
                                    <Card.Body>
                                        <p className="display-6">Join Existing</p><hr></hr>
                                        <Form>
                                            <Form.Group controlId="gameID" className="mb-3">
                                                <Form.Label>Game ID</Form.Label>
                                                <Form.Control type="text" placeholder="Ex: 610841" />
                                            </Form.Group>
                                            <Form.Group controlId="nicknameExisting" className="mb-4">
                                                <Form.Label>Nickname</Form.Label>
                                                <Form.Control type="text" placeholder="Ex: Kramer" maxLength={15} />
                                            </Form.Group>
                                        </Form>
                                        <Button variant="danger" className="text-white">Join</Button>
                                    </Card.Body>
                                </Card>
                            </Fade>
                        </div>
                        <div className="col-md mt-3 mt-md-0">
                            <Fade duration={2500} delay={1000}>
                                <Card
                                    text="secondary"
                                >
                                    <Card.Body>
                                        <p className="display-6">Create Game</p><hr></hr>
                                        <Form>
                                            <Form.Group controlId="nicknameNew" className="mb-3">
                                                <Form.Label>Nickname</Form.Label>
                                                <Form.Control type="text" placeholder="Ex: Jerry" maxLength={15} />
                                            </Form.Group>
                                            <Form.Group controlId="numRounds" className="mb-4">
                                                <Form.Label>Number of Rounds</Form.Label>
                                                <Form.Control type="number" placeholder="Number of Rounds" defaultValue={2} min={1} max={10} />
                                                <Form.Text muted>
                                                    Total game with 2 rounds takes approximately 10 minutes. Each additional round adds approximately 3 minutes.
                                                </Form.Text>
                                            </Form.Group>

                                        </Form>
                                        <Button variant="primary" className="text-white">Create</Button>
                                    </Card.Body>
                                </Card>
                            </Fade>
                        </div>

                    </div>

                </div>
            </Container>
        </>
    );
}

export default JoinMenu;