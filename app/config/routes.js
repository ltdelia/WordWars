// Dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

module.exports = function(app){
	app.get('/', function(req, res){
		res.sendFile(path.join(__dirname + '/../public/index.html'));
	})
	app.get('/menu', function(req, res){
		res.sendFile(path.join(__dirname + '/../public/menu.html'));
	})
	app.get('/game', function(req, res){
		res.sendFile(path.join(__dirname + '/../public/game.html'));
	})
	app.get('/scores', function(req, res){
		res.sendFile(path.join(__dirname + '/../public/scores.html'));
	})
}