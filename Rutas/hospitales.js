var express = require('express');

var app = express();
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var mdAutentication = require('../middlewares/autenticacion');

var Hospital = require('../models/hospital');

// Get Hospitals
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .exec(
            (err, resp) => {
                if (err) {

                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar Hospitals',
                        error: err
                    });
                };
                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        hospital: resp,
                        total: conteo
                    })
                })
            });

});


// Actualizar Hospital

app.put('/:id', mdAutentication.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al obtener el Hospital',
                error: err
            });
        };

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El Hospital con el ' + id + ' no existe',
                error: { message: 'No existe Hospital con ese id' }
            });
        };

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, HospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el Hospital',
                    error: err
                });
            };
            HospitalGuardado.password = '(..)';
            res.status(200).json({
                ok: true,
                hospital: HospitalGuardado
            })
        })

    })

});


// Crear Hospital

app.post('/', mdAutentication.verificarToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, HospitalGuadado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Hospital',
                error: err
            });
        };
        res.status(201).json({
            ok: true,
            hospital: HospitalGuadado
        })
    });

})

// Borrar un Hospital

app.delete('/:id', mdAutentication.verificarToken, (req, res) => {
    var id = req.params.id;
    console.log('Id a borrar', id);
    Hospital.findByIdAndRemove(id, (err, HospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Hospitals',
                error: err
            });
        };

        if (!HospitalBorrado) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No hay Hospital con ese id',
                error: { message: 'No existe un Hospital con ese Id' }
            });
        };
        res.status(200).json({
            ok: true,
            Hospital: HospitalBorrado
        })
    });
})

module.exports = app;