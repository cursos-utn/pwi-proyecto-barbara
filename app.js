const express = require('express');
const app = express();
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const session = require('express-session');
//const multer = require('multer');
//const upload = multer({dest: '/estatico'});
//const rutas = require('./rutas');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('estatico'));
app.use(express.urlencoded());
app.use(session({secret: "usdb3shtr21jn"}));
//app.use('/', rutas);

async function conectarme() {
    try {
        await mongoose.connect("mongodb+srv://pwi:covid2020@pwi-qlcyv.gcp.mongodb.net/tpfinal?retryWrites=true&w=majority", {
          useUnifiedTopology: true,
          useNewUrlParser: true
        });
        console.log('Conectado a la base de datos');
    } catch(error) {
        console.log('No conecta con la base de datos!');
    }
}
conectarme();


const LibroSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
    sinopsis: String,
    editorial: String,
    //imagen: String
    genero: String
    
});

const UsuarioSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const LibroModel = mongoose.model('Libros', LibroSchema);
const UsuarioModel = mongoose.model('Usuarios', UsuarioSchema);


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
      editorial: req.body.editorial,
      genero: req.body.genero
    });
	res.redirect('/');
});


//Ver más --> ver cómo hacer con rutas.js 
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


//búsqueda por libro



//Form registro nuevo usuario
app.get('/signup', function(req,res){
  res.render('signup');
});

//Registro usuario
app.post('/signup', async function(req,res){
  await UsuarioModel.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  res.redirect('/login'); //render('login', req.body) levanta login con los datos recién
});                       // completados pero queda en url signup y no funciona para   
                          //iniciar sesión. Cómo hago?

//Form login usuario
app.get('/login', function(req,res){
  res.render('login');
});

//Inicio de sesión
app.post('/login', async function(req,res){ //validación
  const usuario = await UsuarioModel.findOne({email: req.body.email, password: req.body.password});
  if(usuario){
    req.session.usuario_ok = true;
    req.session.email = req.body.email;
    req.session.user_id = usuario._id;
    res.redirect('/');
  } else
    res.redirect('/login');
});

//Logout
app.get('/logout', function(req,res){
  req.session.destroy();
  res.redirect('/login');
});


//Perfil Usuario
app.get('/perfil', async function (req,res){
  //const perfil = await UsuarioModel.findOne({email: req.body.email}).lean(); // {perfil: perfil}
  if (!req.session.usuario_ok){
     res.redirect('/login');
     return; 
  }
  res.render('perfil');
});

// exports para rutas?
//module.exports = LibroModel;

app.listen(3000, function(req,res){
	console.log('App corriendo en localhost 3000');
});