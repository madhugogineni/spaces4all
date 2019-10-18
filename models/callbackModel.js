var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getCallBack: function () {
        return new Promise(function (resolve, reject) {
            con.query("SELECT call_back.*,projects.project_name FROM `call_back` inner join projects on " +
                "call_back.project_id = projects.project_id order by datetime DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    deleteCallback: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from call_back where call_back_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    }
}