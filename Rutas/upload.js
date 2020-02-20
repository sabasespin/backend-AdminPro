var express = require('express');

var app = express();

var fileUpload = require('express-fileupload');
var fs = require('fs');

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// middleware
app.use(fileUpload());

// Rutas
app.put('/:tipo/:id', (req, resp) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    var tiposValidos = ['usuarios', 'medicos', 'hospitales'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'Ruta no valida',
            error: { message: 'Los tipos validos son ' + tiposValidos.join(' ,') }
        });
    }

    if (!req.files) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'No se selecciono una imagen',
            error: { message: 'Debe seleccionar una imagen' }
        });
    }
    // extencion del archivo

    var archivo = req.files.imagen;
    var cortado = archivo.name.split('.');
    var extencion = cortado[cortado.length - 1];

    // exxtenciones validas
    var extencionesValidas = ['jpg', 'gif', 'png', 'jpeg'];

    if (extencionesValidas.indexOf(extencion) < 0) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'Archivo no valido',
            error: { message: 'Valido solo extenciones ' + extencionesValidas.join(' , ') }
        });
    }

    // nombre del archivo 
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;

    // mover el archivo a una ruta

    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'No se pudo guardar el archivo',
                error: err
            });
        }
    })

    subirPortipo(tipo, id, nombreArchivo, resp);

});

function subirPortipo(tipo, id, nombreArchivo, resp) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    error: { mensage: 'No existe el Usuario' }
                });

            }

            var pathviejo = './uploads/usuarios/' + usuario.img;
            // si existe ya una imagen la elimina
            // if (fs.existsSync(pathviejo)) {
            //     fs.unlink(pathviejo);
            // }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        error: err
                    })

                }
                return resp.status(200).json({
                    ok: true,
                    mensaje: 'Usuario Actualizado',
                    usuario: usuarioActualizado
                })

            });

        })
    }

    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {
            if (!medico) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe',
                    error: { mensage: 'No existe el Medico' }
                });

            }
            var pathviejo = './uploads/medicos/' + medico.img;
            // si existe ya una imagen la elimina
            // if (fs.existsSync(pathviejo)) {
            //     fs.unlink(pathviejo);
            // }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        error: err
                    })

                }
                return resp.status(200).json({
                    ok: true,
                    mensaje: 'Medico Actualizado',
                    medicoactualizado: medicoActualizado
                })

            });

        })

    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    error: { mensage: 'No existe el Hospital' }
                });

            }
            var pathviejo = './uploads/hospitales/' + hospital.img;
            // si existe ya una imagen la elimina
            // if (fs.existsSync(pathviejo)) {
            //     fs.unlink(pathviejo);
            // }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        error: err
                    })

                }
                return resp.status(200).json({
                    ok: true,
                    mensaje: 'Hospital Actualizado',
                    hospitalActualizado: hospitalActualizado
                })

            });

        })
    }
}

module.exports = app;