module.exports = function() {
    return {
        develop: {
            NODE_ENV: 'development',
            NODE_HOST: 'http://localhost',
            NODE_PORT: 3000,
            MONGO_URI: 'localhost',
            MONGO_DB: 'vacaciones_permanentes',
            APP_SECRET: 'SOMESECRET'
        },
        test: {
            NODE_ENV: 'test',
            NODE_HOST: 'http://localhost',
            NODE_PORT: 3000,
            MONGO_URI: 'localhost',
            MONGO_DB: 'vacaciones_permanentes_test',
            APP_SECRET: 'SOMESECRET'
        },
        prod: {
            NODE_ENV: 'production',
            NODE_HOST: 'http://localhost',
            NODE_PORT: 3000,
            MONGO_URI: 'localhost',
            MONGO_DB: 'vacaciones_permanentes',
            APP_SECRET: 'SOMESECRET'
        }
    };
};
