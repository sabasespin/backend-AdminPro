var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// Busqueda por coleccion

app.get('/coleccion/:tabla/:busqueda', (req, resp) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;

    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospital':
            promesa = buscarHospitales(busqueda, regex);
            break;

        default:
            return resp.status(400).json({
                ok: false,
                mensaje: 'Las rutas de busqueda son por usuarios, medicos y hospitales',
                error: { mensaje: 'Error en la busqueda' }
            })
    }

    promesa.then(data => {
        resp.status(200).json({
            ok: true,
            [tabla]: data
        })
    })

});

// Busquedas general
app.get('/todo/:busqueda', (req, resp) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(repuestas => {
            resp.status(200).json({
                ok: true,
                hospitales: repuestas[0],
                medicos: repuestas[1],
                usuarios: repuestas[2]
            })
        })
});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex }, (err, hospitales) => {
            if (err) {
                reject('Error al cargar hospitales', err);
            } else {
                resolve(hospitales);
            }
        });
    });
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex }, (err, medicos) => {
            if (err) {
                reject('Error al cargar medicos', err);
            } else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'usuario': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            })
    });
}

module.exports = app;