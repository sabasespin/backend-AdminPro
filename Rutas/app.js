var express = require('express');

var app = express();

// Rutas
app.get('/', (req, resp) => {
    resp.status(200).json({
        ok: true,
        mensaje: 'Peticion procesada correctamente'
    })
});

module.exports = app;