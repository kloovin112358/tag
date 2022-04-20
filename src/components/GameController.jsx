// The game controller is the puppet master behind which
// stage of the game we are playing, etc.
// gameplay starts with the waiting room and progresses through to the credits
import { SocketContext } from '../socket';
import { useContext, useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import GameScreen from './GameScreen';
import WaitingMenu from './WaitingMenu';

function GameController() {

    let [loading, setLoading] = useState(true);
    let [status, setStatus] = useState(null);
    let [players, setPlayers] = useState([]);
    let [host, setHost] = useState(true);

    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const gameUrlId = window.location.pathname.split('/')[1]

    useEffect(() => {
        // if the game does not exist, redirect to join menu
        // and give invalid game message
        socket.on('gameInvalid', () => {
            navigate('/?gameInvalid=true')
        })
        socket.on('joinGamePrefill', () => {
            navigate('/?gameCodePrefill=' + gameUrlId)
        })
        // if the game is active and valid, we are sent over some game information to 
        // set us up
        socket.on('validGame', data => {
            setPlayers(data.playersList)
            setStatus(data.status)
            setHost(data.host)
        })

        // updating the players in the game
        socket.on('updatePlayersList', data => {
            setPlayers(data)
        })

        // here we have each of the stages of the game
        // starts with the beginning of the game
        socket.on('startGame', data => {
            setLoading(false)
        })

    }, [socket]);

    useEffect(() => {
        // on page load, we want to verify that the game is active and valid
        socket.emit("checkValidGame", gameUrlId)
    }, []);

    if (loading) {
        return (
            <WaitingMenu loading={loading} players={players} gameUrlId={gameUrlId} host={host} status={status}/>
        )
    } else {
        return (
            <GameScreen />
        )
    }

}

export default GameController;