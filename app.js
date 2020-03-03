// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Variables
var app = express();

// Cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OOPTIONS");
    next();
});


// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar archivos
var appRoute = require('./Rutas/app');
var appRouteUsuarios = require('./Rutas/usuarios');
var appRouteLogin = require('./Rutas/login');
var appRouteHospital = require('./Rutas/hospitales');
var appRouteMedico = require('./Rutas/medicos');
var appRouteBusqueda = require('./Rutas/busqueda');
var appRouteUpload = require('./Rutas/upload');
var appRouteImagenes = require('./Rutas/imagenes');

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, resp) => {
    if (err) throw err;
    console.log('Base de datos conectada: \x1b[32m%s\x1b[0m', 'online');

});

app.use('/usuarios', appRouteUsuarios);
app.use('/login', appRouteLogin);
app.use('/hospital', appRouteHospital);
app.use('/medico', appRouteMedico);
app.use('/busqueda', appRouteBusqueda);
app.use('/upload', appRouteUpload);
app.use('/img', appRouteImagenes);
app.use('/', appRoute);


//Escuchar
app.listen(3000, () => {
    console.log('Servidor express corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});