var Sequelize = require("sequelize");

// Lists out connection options
var source = {

    localhost: {
        port: 3306,
        host: 'localhost',
        user: 'root',
        password: '04051997',
        database: "WordWars"
    },

    jawsdb: {
        port: 3306,
        host: 'nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'rt9caklslwvyov39',
        password: 'nfqnfo6l6u5u8znw',
        database: 'e7y3gjqvlivsf87l'
    }
}

// Selects a connection (can be changed quickly as needed)
var selectedSource = source.jawsdb;

// Creates mySQL connection using Sequelize
var sequelize = new Sequelize(selectedSource.database, selectedSource.user, selectedSource.password, {
  host: selectedSource.host,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

// Exports the connection for other files to use
module.exports = sequelize;