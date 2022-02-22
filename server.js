const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});


const { Sequelize } = require('sequelize');

// Option 1: Passing a connection URI
const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/tag') // Example for postgres

try {
    sequelize.authenticate().then(console.log('Connection has been established successfully.'));
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

const Game = sequelize.define('Game', {
    // Model attributes are defined here
    id: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    url_id: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      defaultValue: createURLID()
    },
    round_nums: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false
    },
});

// creates a 6-digit unqiue numeric game ID/code for the front-end
// for the URL, like .../208131
function createURLID() {
  // NOTE that this is not recommended for large scale applications -
  // we are simply going to generate a random string number and hope there are 
  // no conflicts
  return (Math.floor(100000 + Math.random() * 900000)).toString()
}

// sequelize.sync( {force: true })
//   .then(() => {
//     console.log(`Database & tables created!`);
//   });

// (async () => {
//   await sequelize.sync({force: true });
//   const testy = await Game.create({
//     round_nums: 5
//   });
//   console.log(testy.toJSON());
// })();

app.get('/', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

async function createGame(hostSocketID) {
  
}


io.on('connection', (socket) => {

  // client tells server whether they have a socket ID cookie
  socket.on('oldSocketIDTransfer', function(data) { 
    if (data) {
      // TODO - check for existing game, push that data to client
      // TODO - swap out game user's socket ID for the new one
    }
    socket.emit('newSocketIDTransfer', socket.id)
  })

  socket.on('joinGame', function() {
    // TODO - check if the game has started already
    // if it has, and they were not one of the original participants,
    // join them as an audience member


  })

  socket.on('createGame', function() {
    createGame()
  })
  
});

server.listen(port, () => {
  console.log('listening on port ' + port);
});