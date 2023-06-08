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
const maxPlayersInGame = 8

// Option 1: Passing a connection URI
const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/tag') // Example for postgres

try {
    sequelize.authenticate().then(console.log('Connection has been established successfully.'));
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

const Acronym = sequelize.define('Acronym', {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  acronym: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  expansion: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
});

const Game = sequelize.define('Game', {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  // in the URL bar, to access the game
  url_id: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
    defaultValue: createURLID()
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
  },
  //string, like "NANANANANAAA" where N is noun round, A is acronym round. Generated after game object creation, accessible by current_round index
  round_seq_str: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true
  },
  //nullable numeric field to access round_seq_str, 0 indexed
  current_round: {
    type: Sequelize.DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  // Acronym round -> "WA" means writing. "VA1" means voting on first set. "DA1" means displaying authors of first set. "VA2", "DA2", "SA" means showing scores.
  // Noun round -> "WN" means writing. "VN" means voting. "DN" means displaying authors, "SN" means showing scores 
  round_status: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true
  },
});

const Round = sequelize.define('Round', {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  // which round in the round seq we are at
  number: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  // type has two choices, 'A' and 'N'
  // 'A' denotes an acronym round, 'N' is a "noun" round
  type: {
    type: Sequelize.DataTypes.STRING,
    defaultValue: 'A',
    allowNull: false
  },
  // if acronym round, this is the first to display
  acronym_round_acronym_1: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true
  },
  // if acronym round, this is the second to display
  acronym_round_acronym_2: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true
  },
  // if noun round, this is the noun to display
  noun_round_noun: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true
  },
});

const Player = sequelize.define('Player', {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  socket_id: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  nickname: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  emoji: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  // html color code for their vibe
  color: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  // players have three types: Players and Ghosts and Audience,
  // denoted by 'P' and 'G' and 'A'
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

// Acronym round:
// give a player an acronym and ask for them
// to guess what it actually is, and also to provide
// a funny spoof of what it could be
// ex: acronym: NASA
// real expansion guess: National Aeronautics and Space Administration
// funny expansion guess: Not A Science Administration

// Noun round:
// give them a noun and make them come up with 
// a funny acronym and explanation of what it stands for
// ex: noun: hamburger
// acronym: CGW
// expansion: Cows Gone Wild

const RoundInput = sequelize.define('RegularRoundInput', {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  score: {
    type: Sequelize.DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  // THESE ARE FOR ACRONYM ROUNDS ONLY
  // |
  // |
  // v
  funny_expansion_acronym_1: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
  real_expansion_acronym_1: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
  funny_expansion_acronym_2: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
  real_expansion_acronym_2: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
  //THESE ARE FOR NOUN ROUNDS ONLY
  // |
  // |
  // v
  funny_acronym_noun: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
  funny_expansion_noun: {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  },
});

Player.belongsTo(Game)
Round.belongsTo(Game)
RoundInput.belongsTo(Round)
RoundInput.belongsTo(Player)

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
  const testGame = await Game.create({
    round_seq_str: 'NANANANANANNANA'
  });
  const testRound = await Round.create({
    GameId: testGame.id,
    acronym_round_acronym_1: 'TL;DR',
    acronym_round_acronym_2: 'PGA'
  })
  const testPlayer = await Player.create({
    GameId: testGame.id,
    socket_id: '23523_a3520938_a520987098',
    nickname: 'Geoffrey',
    emoji: '👨‍💼',
    color: '#4169e1',
  })
  const testRoundInput = await RoundInput.create({
    RoundId: testRound.id,
    PlayerId: testPlayer.id,
    score: 30,
    funny_expansion_acronym_1: 'Too Long; Didnt Ride',
    real_expansion_acronym_1: 'Too Long; didnt read',
    funny_expansion_acronym_2: 'PowerPuff Girls Association',
    real_expansion_acronym_2: 'Professional Golf Association',
  })
  console.log(testGame.toJSON());
  console.log(testRound.toJSON())
  console.log(testPlayer.toJSON())
  console.log(testRoundInput.toJSON())
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

async function findHostOfGame(gameInst) {
  var playerInst = await Player.findOne({
    where: {
      [Sequelize.Op.and]: [
        {GameId: gameInst.id},
        {host: true}
      ]
    },
  })
  return playerInst.nickname
}

io.on('connection', (socket) => {

  // update each waiting lobby screen with the player list
  async function updateLobbyScreens(playersList, gameInst) {
    // update each screen with the current players
    io.to(gameInst.id).emit('validGame', {'playersList': playersList, 'status': gameInst.status, 'host': await findHostOfGame(gameInst)})
  }

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

    var gameInst = await Game.findOne({
      where: {
        id: gameId
      }
    })

    await updateLobbyScreens(playersList, gameInst)

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

      if (playerInst) {
        playerInst.socket_id = socket.id
        await playerInst.save()
        socket.join(playerInst.GameId)
      }

      socket.emit("receiveSocketID", socket.id)
      
    })(); 
  })

  // if a player gets disconnected from a game, we want to 
  // be able to return them to that game
  socket.on('attemptToJoinGameFromCookie', function(data) {
    (async () => {
      // we only want to search for games that are "in progress" (if they want to rejoin a lobby, they'll just enter the code again)
      if (data.gameCode) {
        var gameInst = await Game.findOne({
          where: {
            [Sequelize.Op.and]: [
              {url_id: data.gameCode},
              {status: 'I'}
            ]
          },
        })
        if (gameInst) {
          socket.emit('joinGameOnClient', {'gameCode': gameInst.url_id, 'clientPlayerNickname': data.nickname})
        }
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
        socket.emit('joinGameOnClient', {'gameCode': gameInst.url_id, 'clientPlayerNickname': data.nickname})
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
      socket.emit('joinGameOnClient', {'gameCode': gameInst.url_id, 'clientPlayerNickname': data.nickname})
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

          await updateLobbyScreens(playersList, gameInst)

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

  socket.on('nextStage', function(data) {
    (async () => {

      // query for the game instance
      var gameInst = await Game.findOne({
        where: {
          url_id: data
        },
      })

      // now we can determine what stage the game is at,
      // and where it needs to go

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