var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "db_user",
    password: "db_user_pass",
    database: "app_db"
});

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;
