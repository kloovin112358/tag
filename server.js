const express = require('express'); //Line 1
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3

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
    round_nums: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false
    }
});

sequelize.sync()
  .then(() => {
    console.log(`Database & tables created!`);
  });

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
    res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
}); //Line 11