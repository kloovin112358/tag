import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

function App() {
  return (
    <>
      <Navbar bg="light" className="border-bottom">
        <Container>
          <Navbar.Brand href="/">T.A.G.</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
        <div className="pt-3 pb-5">
          <Row>
            <Col>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>Player 1 - 100 pts</ListGroup.Item>
                  <ListGroup.Item>Player 2 - 200 pts</ListGroup.Item>
                  <ListGroup.Item>Player 3 - 300 pts</ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
            <Col lg={10} className="mt-3 mt-lg-0">
              <Card>
                <Card.Body>
                  <Card.Text>
                    <p className='display-1'>What does HTML stand for?</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </div>
      </Container>
    </>
  );
}

export default App;
