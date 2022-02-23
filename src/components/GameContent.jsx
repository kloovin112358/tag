import Bounce from 'react-reveal/Bounce';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

function GameContent(props) {
    // in the game content, we have three 
    return (
        <>
            {/* <Card.Body className="text-center">
                <Bounce top cascade>
                    <p className="display-1 fw-bold p-5">HTML</p>
                </Bounce>                   
            </Card.Body> */}

            {/* card-based for desktop screens */}
            <Card.Body className="d-none d-lg-block">
            <div className="d-flex flex-wrap align-items-start">
                <Card 
                    className="shadow m-2 p-2 lead "
                    style={{ width:'25%', maxWidth: '20rem', minWidth:'15rem' }}
                > 
                    <Card.Body>
                        High Troopers Meet Lemons
                    </Card.Body>
                </Card>
                <Card 
                    className="shadow m-2 p-2 lead"
                    style={{ width:'25%', maxWidth: '20rem', minWidth:'15rem' }}
                > 
                    <Card.Body>
                        Merry Christmas, Big Guy
                    </Card.Body>
                </Card>
                <Card 
                    className="shadow m-2 p-2 lead"
                    style={{ width:'25%', maxWidth: '20rem', minWidth:'15rem' }}
                > 
                    <Card.Body>
                        Potato Soup for the Soul
                    </Card.Body>
                </Card>
            </div>
            </Card.Body>
            {/* line-item based for mobile */}
            <ListGroup variant="flush" className="d-lg-none lead">
                <ListGroup.Item>High Troopers Meet Lemons</ListGroup.Item>
                <ListGroup.Item>Merry Christmas, Big Guy</ListGroup.Item>
                <ListGroup.Item>Potato Soup for the Soul</ListGroup.Item>
            </ListGroup>
        </>
    );
}

export default GameContent;