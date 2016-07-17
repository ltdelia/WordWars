// Dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var firebase = require('firebase');
var Games = require('../models/games.js');

firebase.initializeApp({
	databaseURL: "https://wordwars-b7992.firebaseio.com",
	serviceAccount: "WordWarsServiceAccount.json"
})

var app = express();

module.exports = function(app){
	app.get('/', function(req, res){
		res.render('index');
	})
	app.get('/menu', function(req, res){
		res.render('menu');
	})
	app.get('/game', function(req, res){
		res.render('game');
	})
	app.get('/scores', function(req, res){
		res.render('scores');
	})	
	
	app.get('/api/:username?', function(req, res){
		// res.json(req.body);
		// console.log("server data: ", req.body);



		if(req.params.username){

			// Then display the JSON for ONLY that character.
			// (Note how we're using the ORM here to run our searches)
			Games.findAll({
				where: {
					username: req.params.username
				}
			}).then(function(result){
				res.json(result);
			})
		}

		// Otherwise...
		else{
			// Otherwise display the data for all of the characters.
			// (Note how we're using Sequelize here to run our searches)
			Games.findAll().then(function(result){
				res.json(result);

			})
		};
	})

	app.post('/api/:username?', function(req, res){
		// console.log('Data sent to the server. ', req.body);

		Games.findAll().then(function(result) {
			console.log(result);
			
			Games.create({
				username: "analben",
				points: req.body.points,
				level: req.body.finalWave,
				enemies: req.body.enemies,
				wordsTyped: req.body.words,
				missedWords: req.body.missedWords
			});

			res.json(true)
		})
	})
}