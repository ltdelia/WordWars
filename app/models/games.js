var Sequelize = require('sequelize');
var sequelize = require('../config/connection.js');


var Games = sequelize.define('games', {
	username: {
		type: Sequelize.STRING,
		required: true
	},
	points: {
		type: Sequelize.INTEGER
	},
	level: {
		type: Sequelize.INTEGER
	},
	enemies: {
		type: Sequelize.INTEGER
	},
	missedWords: {
		type: Sequelize.INTEGER
	},
	timeElapsed: {
		type: Sequelize.INTEGER
	}

},
	{timestamps: false}
);


Games.sync()

module.exports = Games;