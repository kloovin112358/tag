import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

function Players(props) {
    return (
        <>
            <ListGroup variant="flush">
            {props.players.map(player => {
                return (<ListGroup.Item><Badge bg="info">{player[1]}</Badge> {player[0]}</ListGroup.Item>)
            })}
            {props.audience.map(member => {
                return (<ListGroup.Item variant="secondary"><i>{member}</i></ListGroup.Item>)
            })}
            </ListGroup>
        </>
    );
}

export default Players;

