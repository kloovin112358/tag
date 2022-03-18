import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

function Players(props) {
    return (
        <>
            <ListGroup variant="flush">
                {
                    props.players.map(player =>
                        player[0] == 'P' ? (
                            <ListGroup.Item>
                                <Badge bg="info">{player[2]}</Badge> {player[1]}
                            </ListGroup.Item>
                        ) : null)
                }
                {
                    props.players.map(player =>
                        player[0] == 'A' ? (
                            <ListGroup.Item variant="secondary">
                                <i>{player[1]}</i>
                            </ListGroup.Item>
                        ) : null)
                }
            </ListGroup>
        </>
    );
}

export default Players;

