// Requires
var express = require('express');
var mongoose = require('mongoose');


// Variables
var app = express();


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (err, resp) => {
    if (err) throw err;
    console.log('Base de datos conectada: \x1b[32m%s\x1b[0m', 'online');

});

// Rutas
app.get('/', (req, resp) => {
    resp.status(200).json({
        ok: true,
        mensaje: 'Peticion procesada correctamente'
    })
});



//Escuchar
app.listen(3000, () => {
    console.log('Servidor express corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});