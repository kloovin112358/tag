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
                                        <div style={{fontSize: '25px', justifyContent: 'center', display: 'flex', alignItems: 'center', backgroundColor:player.color, minHeight:'42px', maxHeight:'42px', height: '42px', minWidth: '42px', maxWidth: '42px', width: '42px', borderRadius: "50%"}}>{player.emoji}</div>
                                        <h5 className="ms-3 h-100 mb-0">{player.nickname}</h5>
                                    </div>
                                    <div style={{fontSize: '25px'}} className="d-flex justify-content-center">
                                        <Badge pill bg="info">{player.score}</Badge>
                                    </div>
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

