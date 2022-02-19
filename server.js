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
// const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/tag') // Example for postgres

// try {
//     sequelize.authenticate().then(console.log('Connection has been established successfully.'));
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }

// const Game = sequelize.define('Game', {
//     // Model attributes are defined here
//     id: {
//       type: Sequelize.DataTypes.UUID,
//       defaultValue: Sequelize.DataTypes.UUIDV4,
//       allowNull: false,
//       primaryKey: true
//     },
//     urlID :{
//       type: Sequelize.DataTypes.String,
//       allowNull: false,
//     },
//     round_nums: {
//       type: Sequelize.DataTypes.INTEGER,
//       defaultValue: 2,
//       allowNull: false
//     }
// });

// sequelize.sync( {force: true })
//   .then(() => {
//     console.log(`Database & tables created!`);
//   });

app.get('/', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

io.on('connection', (socket) => {

  // we want to check if they are a returning user
  socket.emit('areExistingUser')

  socket.on('amIExistingUser', function(data) {
    console.log(data)
  })
  
});

server.listen(port, () => {
  console.log('listening on port ' + port);
});