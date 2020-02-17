var express = require('express');

var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al buscar el email usuarios',
                error: err
            });
        };

        if (!usuarioGuardado) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Credencials incorrectas - email',
                error: err

            });
        };

        if (!bcrypt.compareSync(body.password, usuarioGuardado.password)) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Credencials incorrectas - password',
                error: err
            });
        }

        // Crear un token
        usuarioGuardado.password = '(..)';
        var token = jwt.sign({ usuario: usuarioGuardado }, SEED, { expiresIn: 2000 });
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            id: usuarioGuardado.id,
            token: token
        })

    });

});
module.exports = app;