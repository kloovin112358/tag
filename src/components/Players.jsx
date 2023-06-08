import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';

function Players(props) {
    return (
        <>
            <Card>
                <ListGroup variant="flush">
                    {
                        props.players.map(player =>
                            player.type == 'P' || player.type == 'G'? (
                                <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <div className="d-flex align-items-center">
                                        <div style={{fontSize: '30px', justifyContent: 'center', display: 'flex', alignItems: 'center', backgroundColor:player.color, minHeight:'50px', maxHeight:'50px', height: '50px', minWidth: '50px', maxWidth: '50px', width: '50px', borderRadius: "50%"}}>{player.emoji}</div>
                                        <h3 className="ms-3 h-100 mb-0">{player.nickname}</h3>
                                    </div>
                                    <Badge bg="info"><h3>{player.score}</h3></Badge> 
                                </ListGroup.Item>
                            ) : null)
                    }
                </ListGroup>
            </Card>
            {props.players.filter((player) => player.type == "A").length > 0 &&
            <Card className="mt-1">
                <Card.Body className="py-0">Audience</Card.Body>
                <ListGroup variant="flush">
                    {
                        props.players.map(player =>
                            player.type == 'A' ? (
                                <ListGroup.Item variant="secondary">
                                    <i>{player.nickname}</i>
                                </ListGroup.Item>
                            ) : null)
                    }
                </ListGroup>
            </Card>
            }
            
        </>
    );
}

export default Players;

