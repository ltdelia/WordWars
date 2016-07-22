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

// var roomRef = firebase.database.ref('rooms');

module.exports = function(app){

	//PAGES

	app.get('/', function(req, res){
		res.render('index');
	})
	app.get('/menu', function(req, res){
		res.render('menu');
	})
	app.get('/game:roomID?', function(req, res){
		res.render('game');
	})
	app.get('/scores', function(req, res){
		Games.findAll({
			order: 'points DESC',
			limit: 10
		}).then(function(highScores){
			console.log(highScores);

			res.render('scores', {highScores});
		})
	})	


	app.get('/profile/:username', function(req,res){
		

		Games.findAll({
			where: {
				username: req.params.username
			}
		}).then(function(userData){
			console.log(userData);

			res.render('profile', {userData});
		})

	})


	//DATA

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
			}).then(function(userData){
				res.json(userData);
			})
		}

		// Otherwise...
		else{
			// Otherwise display the data for all of the characters.
			// (Note how we're using Sequelize here to run our searches)
			Games.findAll().then(function(allUserData){
				res.json(allUserData);

			})
		};
	})


	app.post('/api/:username?', function(req, res){
		console.log('Data sent to the server. ', req.body);

		Games.findAll().then(function(gameData) {
			console.log(gameData);
			
			Games.create({
				username: req.body.username,
				points: req.body.points,
				level: req.body.finalWave,
				enemies: req.body.enemies,
				wordsTyped: req.body.words,
				missedWords: req.body.missedWords,
				timeElapsed: req.body.timeElapsed
			});

			res.json(true)
		})
	})
}