const express = require ('express');
const mongoose = require('mongoose'); // lleva mongoose?
const app = express.Router();
const LibroModel = require('./app'); //cómo se importa?


//Todos los libros
app.get('/', async function (req, res) {
    const biblioteca = await LibroModel.find().lean();
    res.render('biblioteca', {biblioteca: biblioteca});
});


//Agregar libro (mostrar formulario)
app.get('/agregar', function(req,res){
  	res.render('cargarlibro');
});

//Recibir info nuevo libro
app.post('/agregar', async function(req,res){
	await LibroModel.create({
      titulo: req.body.titulo,
      autor: req.body.autor,
      sinopsis: req.body.sinopsis,
      editorial: req.body.editorial
    });
	res.redirect('/');
});


//Ver más  
app.get('/vermas/:id', async function(req,res){
  const vermas = await LibroModel.findById(req.params.id).lean();
  res.render('vermas', {info: vermas});
});


//Borrar libro
app.get('/borrar/:id', async function(req,res){
  await LibroModel.findByIdAndRemove(req.params.id);
  res.redirect('/');
});


//Mostrar formulario de edición
app.get('/editar/:id', async function(req, res){
  const parametros = await LibroModel.findById(req.params.id).lean();
  res.render('cargarlibro', {datos: parametros});
});

//Guardar libro editado
app.post('/editar/:id', async function(req, res){
  await LibroModel.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/');
});



module.exports = app;