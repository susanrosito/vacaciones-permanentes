module.exports = function() {
    return {
        develop: {
            ENV: 'development',
            HOST: 'http://localhost',
            PORT: 3000,
            MONGO_URI: 'mongodb://localhost/vacaciones_permanentes',
            APP_UUID: 'SOMESECRET'
        },
        test: {
            ENV: 'test',
            HOST: 'http://localhost',
            PORT: 3000,
            MONGO_URI: 'mongodb://localhost/vacaciones_permanentes_test',
            APP_UUID: 'SOMESECRET'
        },
        prod: {
            ENV: 'production'
            // Set other app variables directly in OpenShift for security reasons
        }
    };
};
