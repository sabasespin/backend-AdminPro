// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Variables
var app = express();

// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar archivos
var appRoute = require('./Rutas/app');
var appRouteUsuarios = require('./Rutas/usuarios');
var appRouteLogin = require('./Rutas/login');


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, resp) => {
    if (err) throw err;
    console.log('Base de datos conectada: \x1b[32m%s\x1b[0m', 'online');

});

app.use('/usuarios', appRouteUsuarios);
app.use('/login', appRouteLogin);
app.use('/', appRoute);


//Escuchar
app.listen(3000, () => {
    console.log('Servidor express corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});