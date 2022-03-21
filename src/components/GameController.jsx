// The game controller is the puppet master behind which
// stage of the game we are playing, etc.
// gameplay starts with the waiting room and progresses through to the credits
import { SocketContext } from '../socket';
import { useContext, useState, useEffect } from 'react';
import CircleLoader from "react-spinners/CircleLoader";
import { useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

//TODO import GameScreen from './GameScreen';

function GameController() {

    let [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState([]);

    //TODO track whether the user is the host

    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const gameUrlId = window.location.pathname.split('/')[1]

    const loadingAnimCSSOverride = `
        display: block;
        margin: 0 auto;
        margin-top: 3rem;
    `;

    useEffect(() => {
        // if the game does not exist, redirect to join menu
        // and give invalid game message
        socket.on('gameInvalid', () => {
            navigate('/?gameInvalid=true')
        })
        socket.on('joinGamePrefill', () => {
            navigate('/?gameCodePrefill=' + gameUrlId)
        })
        // if the game is active and valid, we are sent over the players list
        socket.on('updatePlayersList', data => {
            setPlayers(data)
        })
    }, [socket]);

    useEffect(() => {
        // on page load, we want to verify that the game is active and valid
        socket.emit("checkValidGame", gameUrlId)
    }, []);

    if (loading) {
        return (
            <>
                <p className="display-6 text-center text-muted mt-3">Game Code: <i className="fw-bold">{gameUrlId}</i></p>
                <CircleLoader loading={loading} color={'#EF476F'} speedMultiplier={0.25} css={loadingAnimCSSOverride} size={250}/>
                <div className="d-flex justify-content-center flex-wrap mt-5">
                    {/* players up top */}
                    
                    {
                        players.map(player => (
                            player[0] === 'P' ? (
                                <p className="display-4 mx-4 text-danger">{player[1]}</p>
                            ) : null)
                        )
                    }
                </div>
                <div className="d-flex justify-content-center flex-wrap mt-3">
                    {/* audience down here, smaller */}
                    {
                        players.map(player => (
                            player[0] === 'A' ? (
                                <p className="display-6 mx-4 fst-italic text-secondary">{player[1]}</p>
                            ) : null)
                        )
                    }
                </div>
            </>
        )
    }

    // TODO actually render the game
    return (
        <>
        
        </>
    )

}

export default GameController;