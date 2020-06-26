const express = require('express');
const app = express();
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const session = require('express-session');
//const multer = require('multer');
//const upload = multer({dest: '/estatico'});
//const rutas = require('./rutas');

const rutas = require('./rutas');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('estatico'));
app.use(express.urlencoded());
app.use(session({secret: "usdb3shtr21jn"}));
//app.use('/', rutas);



// exports para rutas?
//module.exports = LibroModel;
app.use('/', rutas);

app.listen(3000, function(req,res){
	console.log('App corriendo en localhost 3000');
});