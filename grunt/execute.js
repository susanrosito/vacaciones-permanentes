module.exports = function() {
    return {
        createDB: { src: ['tests/data/createDatabase.js'] },
        deleteDB: { src: ['tests/data/deleteDatabase.js'] }
    };
};
