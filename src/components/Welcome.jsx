import Container from 'react-bootstrap/Container'
import React, {useEffect, useState, useRef} from 'react';
import { gsap } from "gsap";
import Fade from 'react-reveal/Fade';

function Welcome() {
    const welcomeRef = useRef();
    const splashRef = useRef();

    useEffect(() => {
        gsap.to(welcomeRef.current, { duration: 1.5, ease: "bounce.out", y: 50 });
        gsap.to(splashRef.current, { duration: 1.5, ease: "bounce.out", y: 75 });

    });
    return (
        <>
            <Container>
                <div className="pb-5">
            <p className="display-1 fw-bold text-secondary" ref={welcomeRef}>Welcome!</p>
            <div ref={splashRef}>
                <p className="display-6 text-secondary">
                    You're playing The Acronym Game. It's your job to come up with fun alternatives for common acronyms.
                </p>
                <Fade left delay={2500}>
                    <p className="display-6 text-primary mt-5"><span className="fw-bold text-danger">NASA</span>: <span className="fw-bold">N</span>ot <span className="fw-bold">A</span> <span className="fw-bold">S</span>cience <span className="fw-bold">A</span>dministration?</p>
                </Fade>
                <Fade left delay={3000}>
                    <p className="display-6 text-primary"><span className="fw-bold text-danger">BRB</span>: Bring Red Balloons?</p>
                </Fade>
                <Fade left delay={3500}>
                    <p className="display-6 text-primary"><span className="fw-bold text-danger">NBA</span>: Nice Baboons and Antelopes?</p>
                </Fade>
            </div>
            
            </div>
            </Container>
        </>
    );
}

export default Welcome;