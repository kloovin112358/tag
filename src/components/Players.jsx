import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

function Players() {
    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item><Badge bg="info">1200</Badge> JerrySeinfield1</ListGroup.Item>
                <ListGroup.Item><Badge bg="info">1000</Badge> Go</ListGroup.Item>
                <ListGroup.Item><Badge bg="info">900</Badge> Elaine</ListGroup.Item>
                <ListGroup.Item><Badge bg="info">700</Badge> Kramer</ListGroup.Item>
                <ListGroup.Item><Badge bg="danger">600</Badge> Bob</ListGroup.Item>
                <ListGroup.Item><Badge bg="info">400</Badge> Thomas</ListGroup.Item>
                <ListGroup.Item><Badge bg="info">100</Badge> KevinLauer12</ListGroup.Item>
                <ListGroup.Item><Badge bg="info">100</Badge> BillyJones5</ListGroup.Item>
                <ListGroup.Item variant="secondary"><i>BrianLauer</i></ListGroup.Item>
            </ListGroup>
        </>
    );
}

export default Players;

