var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getUserCount: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("select count(*) as count from admin where email='" + data.email + "' and password='" + data.password + "'", data, function (error, result) {
                if (error) {
                    resolve({success: false, message: error});
                } else {
                    resolve({success: true, count: result[0].count});
                }
            });
        });
    }
};