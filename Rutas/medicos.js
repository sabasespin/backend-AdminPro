var express = require('express');

var app = express();
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var mdAutentication = require('../middlewares/autenticacion');

var Medico = require('../models/medico');

// Get Medicos
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5)
        .exec(
            (err, resp) => {
                if (err) {

                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error al cargar Medicos',
                        error: err
                    });
                };
                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medico: resp,
                        total: conteo
                    })
                })

            });

});


// Actualizar Medico

app.put('/:id', mdAutentication.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                mensaje: 'Error al obtener el Medico',
                error: err
            });
        };

        if (!medico) {
            return res.status(400).json({
                ok: true,
                mensaje: 'El Medico con el ' + id + ' no existe',
                error: { message: 'No existe Medico con ese id' }
            });
        };

        medico.nombre = body.nombre;
        medico.usuario = req.usuario.id;
        medico.hospital = body.hospital;

        medico.save((err, MedicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Error al actualizar el Medico',
                    error: err
                });
            };
            MedicoGuardado.password = '(..)';
            res.status(200).json({
                ok: true,
                medico: MedicoGuardado
            })
        })

    })

});


// Crear Medico

app.post('/', mdAutentication.verificarToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, MedicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Medicos',
                error: err
            });
        };
        res.status(201).json({
            ok: true,
            medico: MedicoGuardado
        })
    });

})

// Borrar un Medico

app.delete('/:id', mdAutentication.verificarToken, (req, res) => {
    var id = req.params.id;
    // console.log('Id a borrar', id);
    Medico.findByIdAndRemove(id, (err, MedicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Medicos',
                error: err
            });
        };

        if (!MedicoBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No hay Medico con ese id',
                error: { message: 'No existe un Medico con ese Id' }
            });
        };
        res.status(200).json({
            ok: true,
            medico: MedicoBorrado
        })
    });
})

module.exports = app;