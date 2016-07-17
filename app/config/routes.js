// Dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var Games = require('../models/games.js');

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

		Games.findAll().then(function(result){
			res.json(result);

		})
	})

	app.post('/api/:username?', function(req, res){
		console.log('Data sent to the server. ', req.body);

		Games.findAll().then(function(result) {
			console.log(result);
			
			Games.create({
				username: "matt",
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