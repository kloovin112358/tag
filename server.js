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
  // a public game allows anyone to join, while private
  // restricts members to those given the join code
  public_game: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  // whether a game is complete or not
  done: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
});

const Player = sequelize.define('Player', {
  socket_id: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  nickname: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  // players have two types: Players and Audience,
  // denoted by 'P' and 'A'
  type: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    defaultValue: 'P'
  },
  // audience members won't need a score
  score: {
    type: Sequelize.DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: true
  },
})

const Round = sequelize.define('Round', {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  number: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  // type has two choices, 'R' and 'T'
  // 'R' denotes a regular round, 'T' is a "thing" round
  type: {
    type: Sequelize.DataTypes.STRING,
    defaultValue: 'R',
    allowNull: false
  },
});

const RoundVotes = sequelize.define('RoundVotes', {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  // votes are the main way of scoring
  votes_received: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // emojis are an additional fun way of scoring --
  // audience members and other players can give players
  // emojis marking appreciation aside from votes
  emojis_received: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
});

// regular rounds give a player an acronym and ask for them
// to guess what it actually is, and also to provide
// a funny spoof of what it could be
// ex: acronym: NASA
// guess: National Aeronautics and Space Administration
// description: Not A Science Administration
const RegularRoundInput = sequelize.define('RegularRoundInput', {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  guess: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
});

// // thing rounds - TODO need to figure out what this is
// const ThingRoundInput = sequelize.define('ThingRoundInput', {
//   id: {
//     type: Sequelize.DataTypes.UUID,
//     defaultValue: Sequelize.DataTypes.UUIDV4,
//     allowNull: false,
//     primaryKey: true
//   },
//   guess: {
//     type: Sequelize.DataTypes.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.DataTypes.STRING,
//     allowNull: false,
//   },
// });

Player.belongsTo(Game)
Round.belongsTo(Game)
RoundVotes.belongsTo(Round)
RoundVotes.belongsTo(Player)
RegularRoundInput.hasOne(RoundVotes)


// creates a 6-digit unqiue numeric game ID/code for the front-end
// for the URL, like .../208131
function createURLID() {
  // NOTE that this is not recommended for large scale applications -
  // we are simply going to generate a random string number and hope there are 
  // no conflicts
  return (Math.floor(100000 + Math.random() * 900000)).toString()
}

(async () => {
  await sequelize.sync({force: true});
  // const testy = await Game.create({
  //   round_nums: 5
  // });
  // const test_player = await Player.create({
  //   nickname: 'Tom',
  //   GameId: testy.id
  // })
  // console.log(testy.toJSON());
  // console.log(test_player.toJSON())
})();

app.get('/', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

// creating the game instance from the game options dictionary
async function createGame(gameOptions) {
  return await Game.create({
    round_nums: gameOptions['round_nums'],
    public_game: gameOptions['public_game']
  })
}

//TODO - check for number of players in game,
// if there are over the allowed amount, join them as audience
async function joinGame(gameId, socketId, nickname) {
  return await Player.create({
    socket_id: socketId,
    nickname: nickname, 
    GameId: gameId
  })
}


io.on('connection', (socket) => {

  // on connection, we want to send the socket ID
  socket.emit("receiveSocketIDNewPlayer", socket.id)

  // client tells server whether they have a socket ID cookie
  socket.on('oldSocketIDTransfer', function(data) {
    (async () => {

      // looking for active game
      var playerInst = await Player.findOne({
        where: {
          socket_id: data
        },
        // include: [{
        //   model: Game,
        //   as: 'Game',
        //   through: {where: {done: false}}
        // }]
      })

      if (playerInst) {
        playerInst.socket_id = socket.id
        await playerInst.save()
        socket.join(playerInst.GameId)
      }
      
      socket.emit("receiveSocketID", socket.id)

    })(); 
  })

  socket.on('joinGame', function(data) {
    (async () => {

      // query for the game instance
      var gameInst = await Game.findOne({
        limit: 1,
        where: {
          url_id: data.url_id
        },
        done: false
      })

      // if the game doesn't exist, tell the user
      if (!gameInst) {
        socket.emit('gameNotFound')
      // otherwise, join the game from client
      } else {
        await joinGame(gameInst.id, socket.id, data.nickname)
        socket.join(gameInst.id)
        socket.emit('joinGameOnClient', gameInst.url_id)
      }

    })();
  })

  socket.on('createGame', function(data) {
    (async () => {
      var gameInst = await createGame({'round_nums': data.round_nums, 'public_game': data.public_game})
      // player joins socket room
      socket.join(gameInst.id)
      await joinGame(gameInst.id, socket.id, data.nickname)
      // we want to return the game url name
      socket.emit('joinGameOnClient', gameInst.url_id)
    })();
  })

  // getting a random public game for a player to join
  socket.on('getRandomCode', function() {
    (async () => {

      // query for the game instance
      var gameInst = await Game.findOne({
        limit: 1,
        where: {
          public_game: true
        },
        done: false
        // TODO-- get random order
        // order: Sequelize.literal('rand()')
      })

      // if the game doesn't exist, tell the user
      if (!gameInst) {
        socket.emit('noRandomCodeFound')
      // otherwise, join the game from client
      } else {
        socket.emit('randomCodeFound', gameInst.url_id)
      }

    })();
  })

  socket.on('getPlayers', function(data) {
    (async () => {
      var gameInst = await Game.findOne({
        where: {
          url_id: data
        }
      })
      // todo handle nonexistent game
      if (gameInst) {
        var players = await Player.findAll({
          where: {
            GameId: gameInst.id
          }
        })
        var playersList = []
        players.forEach(player => playersList.push([player.type, player.nickname, player.score]));
        socket.emit("gotPlayers", playersList)
      }
    })();
  })

  // socket.on('disconnect', function() {
  //   console.log('Got disconnect!');

  //   var i = allClients.indexOf(socket);
  //   delete allClients[i];
  // });
  
});

server.listen(port, () => {
  console.log('listening on port ' + port);
});