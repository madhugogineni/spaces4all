var mysql = require('mysql');
const DBConfig = require('./external-config/db');
var con = mysql.createConnection({
    host: 'localhost',
    user: DBConfig.username,
    password: DBConfig.password,
    database: DBConfig.database,
});
con.connect(function (error) {
    if (error)
        console.log(error);
    else
        console.log("connection successful");
});
module.exports = con;