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
const maxPlayersInGame = 3

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
  // three statuses of a game:
  // 1) waiting for players ('W')
  // 2) in progress ('I')
  // 3) complete ('C')
  status: {
    type: Sequelize.DataTypes.STRING,
    defaultValue: 'W',
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
  // the host has control of navigation for the game
  host: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
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
  // there are three statuses:
  // 1) not started ('N')
  // 2) in progress ('I')
  // 3) completed ('C')
  status: {
    type: Sequelize.DataTypes.STRING,
    defaultValue: 'N',
    allowNull: false
  }
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

// this function checks if a legacy socket ID is
// a player in a specific active game
async function oldSocketID(socketID, gameID) {
  return await Player.findOne({
    where: {
      [Sequelize.Op.and]: [
        {GameId: gameID},
        {socket_id: socketID}
      ]
    },
  })
}

io.on('connection', (socket) => {

  // if there are over the allowed amount, join them as audience
  async function joinGame(gameId, socketId, nickname, host = false) {

    var numPlayers = await Player.count({
      where: {
        GameId: gameId
      },
    })

    if (numPlayers >= maxPlayersInGame) {
      var playerType = 'A'
    } else {
      var playerType = 'P'
    }

    socket.join(gameId)

    var newPlayer = await Player.create({
      socket_id: socketId,
      nickname: nickname, 
      GameId: gameId,
      type: playerType,
      host: host
    })

    // querying for all players in the game
    var players = await Player.findAll({
      where: {
        GameId: gameId
      }
    })
    var playersList = []
    players.forEach(player => playersList.push([player.type, player.nickname, player.score]));

    // update each screen with the current players
    io.to(gameId).emit('updatePlayersList', playersList)

    return newPlayer
  }

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

      socket.emit("receiveSocketID", socket.id)

      if (playerInst) {
        playerInst.socket_id = socket.id
        await playerInst.save()
        socket.join(playerInst.GameId)
        // TODO get game inst from player inst
        // socket.emit('joinGameOnClient', gameInst.url_id)
      }

    })(); 
  })

  socket.on('joinGame', function(data) {
    (async () => {

      // query for the game instance
      var gameInst = await Game.findOne({
        where: {
          [Sequelize.Op.and]: [
            {url_id: data.url_id},
            {status: 'W'}
          ]
        },
      })

      // if the game doesn't exist, tell the user
      if (!gameInst) {
        socket.emit('gameNotFound')
      // otherwise, join the game from client
      } else {
        await joinGame(gameInst.id, socket.id, data.nickname)
        socket.emit('joinGameOnClient', gameInst.url_id)
      }

    })();
  })

  socket.on('createGame', function(data) {
    (async () => {
      var gameInst = await createGame({'round_nums': data.round_nums, 'public_game': data.public_game})
      // player joins socket room
      socket.join(gameInst.id)
      await joinGame(gameInst.id, socket.id, data.nickname, true)
      // we want to return the game url name
      socket.emit('joinGameOnClient', gameInst.url_id)
    })();
  })

  socket.on('checkValidGame', function(data) {
    (async () => {
      // there are two invalid game scenarios here:
      // 1) game code doesn't exist
      // 2) game has already ended
      var gameInst = await Game.findOne({
        where: {
          [Sequelize.Op.and]: [
            {url_id: data},
            {status: {
              [Sequelize.Op.ne]: 'C'
            }}
          ]
        }
      })
      if (!gameInst) {
        socket.emit('gameInvalid')
      } else {
        var playerInst = await oldSocketID(socket.id, gameInst.id)

        // if the player is in the game, we just have to update their socket ID
        if (playerInst) {
          playerInst.socket_id = socket.id
          await playerInst.save()
          // we have to update their players in the waiting screen
          var players = await Player.findAll({
            where: {
              GameId: gameInst.id
            }
          })
          var playersList = []
          players.forEach(player => playersList.push([player.type, player.nickname, player.score]));
          // updating the specific client with the players
          socket.emit('updatePlayersList', playersList)
        // otherwise, we want them to redirect them to the join page with
        // a message to input a username
        } else {
          socket.emit('joinGamePrefill')
        }
      }
    })();
  })

  // getting a random public game for a player to join
  socket.on('getRandomCode', function() {
    (async () => {

      // query for the game instance
      var gameInst = await Game.findOne({
        where: {
          [Sequelize.Op.and]: [
            {public_game: true},
            {status: 'W'}
          ]
        },
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

  // socket.on('getPlayers', function(data) {
  //   (async () => {
  //     var gameInst = await Game.findOne({
  //       where: {
  //         url_id: data
  //       }
  //     })
  //     // todo handle nonexistent game
  //     if (gameInst) {
  //       var players = await Player.findAll({
  //         where: {
  //           GameId: gameInst.id
  //         }
  //       })
  //       var playersList = []
  //       players.forEach(player => playersList.push([player.type, player.nickname, player.score]));
  //       socket.emit("gotPlayers", playersList)
  //     }
  //   })();
  // })

  socket.on('disconnect', function() {
    // TODO if the user is in a lobby, they will be removed from the game

  });
  
});

server.listen(port, () => {
  console.log('listening on port ' + port);
});