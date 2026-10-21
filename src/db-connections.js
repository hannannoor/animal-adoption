var mysql = require('mysql2');

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'REPLACE_WITH_DEMO_PASSWORD',
    database: 'animal_adoption'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('connected to DB');
});

module.exports = connection;