
module.exports = function(sequelize, DataTypes) {
  const Game = sequelize.define('Game', {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    round_nums: {
      type: DataTypes.INTEGER,
      defaultValue: 2,
      allowNull: false
    }
  }, {
    // Other model options go here
  });
  return Game
}

// Game.sync()
// // `sequelize.define` also returns the model
// console.log(Game === sequelize.models.Game); // true