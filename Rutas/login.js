var express = require('express');

var app = express();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');


// ggogle
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library'); // npm install google-auth-library --save
const client = new OAuth2Client(CLIENT_ID);

// Autenticacion con google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}

app.post('/google', async(req, res) => {
    var token = req.body.token;
    var googleUser = await verify(token)
        .catch(err => {
            res.status(403).json({
                ok: false,
                mensaje: 'Token no valido',
                error: err
            })
        })

    Usuario.findOne({ email: googleUser.email }, (err, usuariodb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el email usuarios',
                error: err
            });
        }

        if (usuariodb.google === false) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Debe usar su autenticacion normal'
            });
        } else {
            var token = jwt.sign({ usuario: usuariodb }, SEED, { expiresIn: 200000 });
            res.status(200).json({
                ok: true,
                usuario: usuariodb,
                id: usuariodb._id,
                token: token
            });
        }
        if (usuariodb.google === true) {
            usuario = new Usuario();
            usuario.nombre = googleUser.name;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.nombre = googleUser.name;
            usuario.password = '(..)';

        }

        usuario.save((err, usuariodb) => {
            var token = jwt.sign({ usuario: usuariodb }, SEED, { expiresIn: 200000 });
            res.status(200).json({
                ok: true,
                usuario: usuariodb,
                id: usuariodb._id,
                token: token
            });

        })




    });

    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'OK !!!',
    //     googleUser: googleUser
    // })
});



// autenticacion normal
app.post('/', (req, res) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
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
        var token = jwt.sign({ usuario: usuarioGuardado }, SEED, { expiresIn: 200000 });
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            id: usuarioGuardado.id,
            token: token
        })

    });

});
module.exports = app;