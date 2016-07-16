// Dependencies
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

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

	

	app.get('/api/:id?', function(req, res){
		res.json(req.body);
		console.log("server data: ", req.body);
	})

	app.post('/api/:id?', function(req, res){
		console.log('Data sent to the server. ', req.body)
	})
}