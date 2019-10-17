var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getScheduleSiteVisit: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from schedule_site_visit order by datetime DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    deleteScheduleSiteVisit: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from schedule_site_visit where visit_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        });
    }
}