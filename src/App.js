import React, { useEffect, useContext, useState, useRef } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Welcome from './components/Welcome'
import JoinMenu from './components/JoinMenu'
import Particles from "react-tsparticles";
import GameScreen from './components/GameScreen';
// import SocketCookieSetup from './components/SocketCookieSetup';
import {SocketContext, socket} from './socket';
import socketIOClient from "socket.io-client";

import Cookies from 'universal-cookie';

const ENDPOINT = "http://127.0.0.1:5000";

function App() {
  const cookies = new Cookies();

  // in this top-level App component, we reference socket directly
  // in lower-level components, we use socketContext
  useEffect(() => {
    // if the client is returning, we want to send over their existing socket ID
    socket.emit('oldSocketIDTransfer', cookies.get('socketID'))

    socket.on("newSocketIDTransfer", data => {
      // after connection, the socket ID will be set as a cookie with expiration after 4 hours
      cookies.set('socketID', data, { path: '/', maxAge: 4 * 60 * 60 })
    });

  }, [socket]);

  return (
    <>
    <SocketContext.Provider value={socket}>
      {/* <SocketCookieSetup /> */}
    <BrowserRouter>
      <Navbar bg="danger" variant="dark" style={{zIndex:'999'}}>
        <Container>
          <Navbar.Brand href="/" className="fw-bold text-light">The Acronym Game</Navbar.Brand>
          <a href="https://github.com/kloovin112358/tag"><i className="bi-github text-white"></i></a>
        </Container>
      </Navbar>
      <Particles
        id="tsparticles"
        options={{
          fpsLimit: 120,
          particles: {
            color: {
              value: "#ffffff",
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outMode: "bounce",
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 20,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              random: true,
              value: 5,
            },
          },
          detectRetina: true,
        }}
      />
      <Routes>
        <Route exact path="/" element={<JoinMenu/>}/>
        <Route exact path="/welcome" element={<Welcome/>}/>
        <Route exact path=":id" element={<GameScreen/>}/>
        {/* <Route exact path="/credits" element={<CreditsScreen/>}/> */}
        {/* Potential archive route, using ID here */}
      </Routes>
      </BrowserRouter>
      </SocketContext.Provider>
    </>
  );
}

export default App;
