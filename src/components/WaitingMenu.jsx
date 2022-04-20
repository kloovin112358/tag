import React, { useContext, useState } from 'react';
import PuffLoader from "react-spinners/PuffLoader";
import Pulse from 'react-reveal/Pulse';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { SocketContext } from '../socket';
import Alert from 'react-bootstrap/Alert'

function WaitingMenu(props) {

    const socket = useContext(SocketContext);
    const [showMorePlayersWarning, setShowMorePlayersWarning] = useState(false)
    const loadingAnimCSSOverride = `
        display: block;
        margin: 0 auto;
        margin-top: 3rem;
    `;

    // when a user pushes the "start" or "continue" button
    function nextStage() {
        // if the nextStage function serves to start the game, 
        // we need to make sure there are enough people in the game first
        console.log(props.status)
        console.log(props.players.length)
        if (props.status === 'W' && props.players.length < 4) {
            console.log("SAEFSSS")
            setShowMorePlayersWarning(true)
        } else {
            socket.emit("nextStage", props.gameUrlId)
        }
        
    }

    return (
        <>
        <Container>
            <div className="pb-5 pt-3">
                {/* TODO remove warning and make "start"/update button smarter */}
            {showMorePlayersWarning ?
                <Alert variant="danger" onClose={() => setShowMorePlayersWarning(false)} dismissible>
                    <Alert.Heading>Error: game must have at least 3 players before beginning.</Alert.Heading>
                </Alert> : null
            }
            <p className="display-6 text-center text-secondary mt-3">Game Code: <i className="fw-bold">{props.gameUrlId}</i></p>
            {
                props.host ? (
                    <div className="text-center">
                        <Button variant="info" className="text-white" onClick={nextStage}>Start</Button>
                    </div>
                ) : null
            }
            
            <PuffLoader loading={props.loading} color={'#EF476F'} speedMultiplier={0.75} css={loadingAnimCSSOverride} size={250}/>
            <div className="d-flex justify-content-center flex-wrap mt-5">
                {/* players up top */} 
                {
                    props.players.map(player => (
                        player[0] === 'P' ? (
                            <Pulse forever duration={3000}><p className="display-4 mx-4 text-danger">{player[1]}</p></Pulse>
                        ) : null)
                    )
                }
            </div>
            <div className="d-flex justify-content-center flex-wrap mt-3">
                {/* audience down here, smaller */}
                {
                    props.players.map(player => (
                        player[0] === 'A' ? (
                            <Pulse forever duration={4000}><p className="display-6 mx-4 fst-italic text-secondary">{player[1]}</p></Pulse>
                        ) : null)
                    )
                }
            </div>
            </div>
        </Container>
        </>
    );
}

export default WaitingMenu;