import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import React, { useEffect, useRef } from 'react';
import Fade from 'react-reveal/Fade';
import Bounce from 'react-reveal/Bounce';

function Welcome() {
    return (
        <>
            <Container>
                <div className="pb-5 pt-3">
                    <Bounce top>
                        <p className="display-1 fw-bold text-secondary">Howdy folks!</p>
                    </Bounce>
                    <Bounce top delay={1000}>
                        <p className="display-6 text-secondary">
                            You're playing The Acronym Game. It's your job to come up with fun alternatives for common acronyms.
                        </p>
                    </Bounce>
                    <Fade left delay={3500}>
                        <p className="display-6 text-primary mt-4"><span className="fw-bold text-danger">NASA</span>: <span className="fw-bold">N</span>ot <span className="fw-bold">A</span> <span className="fw-bold">S</span>cience <span className="fw-bold">A</span>dministration?</p>
                    </Fade>
                    <Fade left delay={4000}>
                        <p className="display-6 text-primary"><span className="fw-bold text-danger">BRB</span>: <span className="fw-bold">B</span>ring <span className="fw-bold">R</span>ed <span className="fw-bold">B</span>alloons?</p>
                    </Fade>
                    <Fade left delay={4500}>
                        <p className="display-6 text-primary"><span className="fw-bold text-danger">NBA</span>: <span className="fw-bold">N</span>ice <span className="fw-bold">B</span>ison and <span className="fw-bold">A</span>ntelopes?</p>
                    </Fade>
                    <Fade delay={6500} duration={2000}>
                        <Button variant="info" className="mt-4 text-white" size="lg">Begin</Button>
                    </Fade>
                </div>
            </Container>
        </>
    );
}

export default Welcome;