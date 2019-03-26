var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'madhu',
    password: 'madhu',
    database: 'spaces4all'
});
con.connect(function (error) {
    if (error)
        console.log(error);
    else
        console.log("connection successful");
});
module.exports = con;