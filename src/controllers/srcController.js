const srcService = require('../services/srcService.js');

exports.getAllJedi = (req, res) => {
    res.status(200).json({jedis: srcService.readAllJedi()});
}