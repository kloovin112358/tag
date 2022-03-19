// The game controller is the puppet master behind which
// stage of the game we are playing, etc.
// gameplay starts with the waiting room and progresses through to the credits
import { SocketContext } from '../socket';
import { useContext, useState, useEffect } from 'react';
import CircleLoader from "react-spinners/CircleLoader";
import { useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

function GameController() {

    let [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState([]);

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
        // if the game is active and valid, we are sent over the players list
        socket.on('gameValid', data => {
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
            <CircleLoader loading={loading} color={'#EF476F'} speedMultiplier={0.25} css={loadingAnimCSSOverride} size={250}/>
            {/* TODO make these more pretty */}
            <ListGroup variant="flush">
                {
                    players.map(player => (
                        <ListGroup.Item variant="secondary">
                            <i>{player[1]}</i>
                        </ListGroup.Item>
                    ))
                }
            </ListGroup>
            </>
        )
    }

    return (
        <>
        
        </>
    )

}

export default GameController;