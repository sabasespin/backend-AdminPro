var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// Verificar Token

exports.verificarToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {

            return res.status(401).json({
                ok: false,
                mensaje: 'Error en token',
                error: err
            });
        };
        req.usuario = decoded.usuario;
        next();
    });

}