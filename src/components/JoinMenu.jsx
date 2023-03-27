import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Fade from 'react-reveal/Fade';
import { SocketContext } from '../socket';

function JoinMenu() {
    
    const navigate = useNavigate();
    const cookies = new Cookies();
    const socket = useContext(SocketContext);
    const [searchParams, setSearchParams] = useSearchParams();
    // the url will have the search parameter ?gameInvalid=true if the user went to a link like /352352 and 352352 was not a valid game code
    const [showGameInvalidWarning, setShowGameInvalidWarning] = useState(searchParams.get("gameInvalid"))
    // for the case where a user used a game URL that was valid but they were not in the game
    const [showJoinGameMessage, setShowJoinGameMessage] = useState(searchParams.get("gameCodePrefill"))
    // provides feedback as to whether the game code is valid
    const [gameCodeInvalid, setGameCodeInvalid] = useState(false);
    // gamecode is only used in the case that the random game button is used
    const [gameCode, setGameCode] = useState(null)
    // controls alert that there is no random game available
    const [noRandomGame, setNoRandomGame] = useState(false);

    // for a user to join a random public game
    function joinRandom() {
        socket.emit('getRandomCode')
    }

    function joinGame(e) {
        e.preventDefault()
        const form = e.currentTarget
        socket.emit('joinGame', {
            'url_id': form.urlId.value,
            'nickname': form.joinNickname.value
        })
    }

    function createGame(e) {
        e.preventDefault();
        const form = e.currentTarget
        //TODO verify that these are being sent properly
        socket.emit('createGame', {
            'round_nums': form.numRounds.value,
            'nickname': form.createNickname.value,
            'public_game': form.publicGame.value
        })
    }

    useEffect(() => {

        socket.on("joinGameOnClient", data => {
            cookies.set('gameCode', data.gameCode, { path: '/', maxAge: 3 * 60 * 60 })
            cookies.set('clientPlayerNickname', data.clientPlayerNickname, { path: '/', maxAge: 3 * 60 * 60 })
            navigate(`/${data.gameCode}`)
        });

        socket.on("gameNotFound", () => {
            setGameCodeInvalid(true)
        })

        socket.on('randomCodeFound', data => {
            setGameCode(data)
        })

        socket.on('noRandomCodeFound', () => {
            setNoRandomGame(true)
        })

        socket.on('receiveSocketID', data => {
            cookies.set('returningUser', data, { path: '/', maxAge: 14 * 24 * 60 * 60 })
            socket.emit('attemptToJoinGameFromCookie', {'gameCode': cookies.get('gameCode'), 'nickname': cookies.get('clientPlayerNickname')})
        })

    }, [socket]);

    // on first page load
    useEffect(() => {
        
        if (showJoinGameMessage) {
            setGameCode(showJoinGameMessage)
        }

        // three scenarios:
        // 1) new user, needs to see welcome page
        // 2) not a new user, not in a game
        // 3) not a new user, in a game and should be sent into the game
        
        // 1)
        if (!cookies.get('returningUser')) {
            // redirect to welcome page if they are a new user
            navigate('/welcome')
        // 2) and 3)
        } else {
            socket.emit('oldSocketIDTransfer', cookies.get('returningUser'))
        }
    }, []);

    return (
        <>
            <Container>
                <div className="pb-5 pt-3">
                    {showGameInvalidWarning ?
                        <Alert variant="danger" onClose={() => setShowGameInvalidWarning(false)} dismissible>
                            <Alert.Heading>Error: game code invalid.</Alert.Heading>
                        </Alert> : null
                    }
                    {noRandomGame ?
                        <Alert variant="danger" onClose={() => setNoRandomGame(false)} dismissible>
                            <Alert.Heading>Error: there were no public games available to join. Create a game to play.</Alert.Heading>
                        </Alert> : null
                    }
                    {showJoinGameMessage ?
                        <Alert variant="info" onClose={() => setShowJoinGameMessage(false)} dismissible>
                            <Alert.Heading>You navigated to an active game that you did not join. Provide a nickname and click "Join" to join this game.</Alert.Heading>
                        </Alert> : null
                    }
                    <div className="row">
                        <div className="col-md">
                            <Fade>
                                <Card
                                    text="secondary"
                                >
                                    <Card.Body>
                                        <p className="display-6">Join Existing</p><hr></hr>
                                        <Form onSubmit={joinGame}>
                                            <Form.Group controlId="gameID" className="mb-3">
                                                <Form.Label>Game ID</Form.Label>
                                                <Form.Control required type="text" placeholder="Ex: 610841" name="urlId" maxLength={6} minLength={6} isInvalid={gameCodeInvalid} value={gameCode} />
                                                <Form.Control.Feedback type="invalid">
                                                    Error: game not found.
                                                </Form.Control.Feedback>
                                                <Button variant="link" className='px-0' type="button" onClick={joinRandom}>Want to join a random game?</Button>
                                            </Form.Group>
                                            <Form.Group controlId="nicknameExisting" className="mb-4">
                                                <Form.Label>Nickname</Form.Label>
                                                <Form.Control required type="text" placeholder="Ex: Kramer" maxLength={15} name="joinNickname" />
                                            </Form.Group>
                                            <Button variant="danger" className="text-white" type="submit">Join</Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Fade>
                        </div>
                        <div className="col-md mt-3 mt-md-0">
                            <Fade>
                                <Card
                                    text="secondary"
                                >
                                    <Card.Body>
                                        <p className="display-6">Create Game</p><hr></hr>
                                        <Form onSubmit={createGame}>
                                            <Form.Group controlId="nicknameNew" className="mb-3">
                                                <Form.Label>Nickname</Form.Label>
                                                <Form.Control name="createNickname" type="text" required placeholder="Ex: Jerry" maxLength={15} />
                                            </Form.Group>
                                            <Form.Group controlId="numRounds" className="mb-3">
                                                <Form.Label>Number of Rounds</Form.Label>
                                                <Form.Control type="number" name="numRounds" required placeholder="Number of Rounds" defaultValue={2} min={1} max={10} />
                                                <Form.Text muted>
                                                    Total game with 2 rounds takes approximately 10 minutes. Each additional round adds approximately 3 minutes.
                                                </Form.Text>
                                            </Form.Group>
                                            <Form.Group controlId="publicPrivate" className="mb-4">
                                                <Form.Check
                                                    type="switch"
                                                    label="Public game"
                                                    name="publicGame"
                                                />
                                                <Form.Text muted>
                                                    A public game allows anyone to join; a private one restricts members to people you invite.
                                                </Form.Text>
                                            </Form.Group>
                                            <Button variant="primary" className="text-white" type="submit">Create</Button>
                                        </Form>
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