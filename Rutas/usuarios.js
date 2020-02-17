var express = require('express');

var app = express();
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var mdAutentication = require('../middlewares/autenticacion');

var Usuario = require('../models/usuario');

// Get Usuarios
app.get('/', (req, res) => {
    Usuario.find({}, 'nombre email role img')
        .exec(
            (err, resp) => {
                if (err) {

                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error al cargar usuarios',
                        error: err
                    });
                };
                res.status(200).json({
                    ok: true,
                    usuario: resp
                })
            });

});


// Actualizar usuario

app.put('/:id', mdAutentication.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al obtener el usuario',
                error: err
            });
        };

        if (!usuario) {
            return res.status(400).json({
                ok: true,
                mensaje: 'El usuario con el ' + id + ' no existe',
                error: { message: 'No existe usuario con ese id' }
            });
        };

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Error al actualizar el usuario',
                    error: err
                });
            };
            usuarioGuardado.password = '(..)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            })
        })

    })

});


// Crear usuario

app.post('/', mdAutentication.verificarToken, (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuadado) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Error al crear usuarios',
                error: err
            });
        };
        res.status(201).json({
            ok: true,
            usuario: usuarioGuadado
        })
    });

})

// Borrar un usuario

app.delete('/:id', mdAutentication.verificarToken, (req, res) => {
    var id = req.params.id;
    console.log('Id a borrar', id);
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al borrar usuarios',
                error: err
            });
        };

        if (!usuarioBorrado) {
            return res.status(500).json({
                ok: true,
                mensaje: 'No hay usuario con ese id',
                error: { message: 'No existe un usuario con ese Id' }
            });
        };
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })
    });
})

module.exports = app;