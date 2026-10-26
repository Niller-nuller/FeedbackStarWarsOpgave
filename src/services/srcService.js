const dataJedi = require('../data/jedi.js');

function readAllJedi() {
    return dataJedi.jedis;
}


module.exports = {readAllJedi};