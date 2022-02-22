import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

function JoinMenu() {

    const navigate = useNavigate();
    const cookies = new Cookies();

    function joinGame(e) {
        e.preventDefault()
        // TODO - send socket to join existing game
    }
    function createGame(e) {
        e.preventDefault();
        // TODO - send socket to create game
    }

    // want to save the fact that the user has visited the site
    function setReturningUserCookie() {
        // cookie set to expire after 2 weeks
        cookies.set('returningUser', true, { path: '/', maxAge: 14 * 24 * 60 * 60 })
    }

    // redirect to welcome page if they are a new user
    useEffect(() => {
        if (!cookies.get('returningUser')) {
            setReturningUserCookie()
            navigate('/welcome')
        } else {
            // if they are existing, we still want to update the cookie expiration
            setReturningUserCookie()
        }
    }, []);

    return (
        <>
            <Container>
                <div className="pb-5 pt-3">
                    <div className="row">
                        <div className="col-md">
                            <Card
                                text="secondary"
                            >
                                <Card.Body>
                                    <p className="display-6">Join Existing</p><hr></hr>
                                    <Form onSubmit={joinGame}>
                                        <Form.Group controlId="gameID" className="mb-3">
                                            <Form.Label>Game ID</Form.Label>
                                            <Form.Control type="text" placeholder="Ex: 610841" maxLength={6} minLength={6} />
                                            <Button variant="link" className='px-0'>Want to join a random game?</Button>
                                        </Form.Group>
                                        <Form.Group controlId="nicknameExisting" className="mb-4">
                                            <Form.Label>Nickname</Form.Label>
                                            <Form.Control type="text" placeholder="Ex: Kramer" maxLength={15} />
                                        </Form.Group>
                                        <Button variant="danger" className="text-white" type="submit">Join</Button>
                                    </Form>
                                </Card.Body>
                            </Card>

                        </div>
                        <div className="col-md mt-3 mt-md-0">

                            <Card
                                text="secondary"
                            >
                                <Card.Body>
                                    <p className="display-6">Create Game</p><hr></hr>
                                    <Form onSubmit={createGame}>
                                        <Form.Group controlId="nicknameNew" className="mb-3">
                                            <Form.Label>Nickname</Form.Label>
                                            <Form.Control type="text" placeholder="Ex: Jerry" maxLength={15} />
                                        </Form.Group>
                                        <Form.Group controlId="numRounds" className="mb-3">
                                            <Form.Label>Number of Rounds</Form.Label>
                                            <Form.Control type="number" placeholder="Number of Rounds" defaultValue={2} min={1} max={10} />
                                            <Form.Text muted>
                                                Total game with 2 rounds takes approximately 10 minutes. Each additional round adds approximately 3 minutes.
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group controlId="publicPrivate" className="mb-4">
                                            <Form.Check
                                                type="switch"

                                                label="Public game"
                                            />
                                            <Form.Text muted>
                                                A public game allows anyone to join; a private one restricts members to people you invite.
                                            </Form.Text>
                                        </Form.Group>
                                    </Form>
                                    <Button variant="primary" className="text-white" type="submit">Create</Button>
                                </Card.Body>
                            </Card>

                        </div>

                    </div>

                </div>
            </Container>
        </>
    );
}

export default JoinMenu;