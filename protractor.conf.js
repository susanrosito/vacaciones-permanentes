var config = require('./config');

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['tests/integration/**/*.js'], // agregas el path donde estan los test de integracion.
};

