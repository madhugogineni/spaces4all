var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getStates: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from state", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                } else {
                    resolve({success: true, data: result});
                }
            });
        });
    },
    getStateById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from state where state_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    addState: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into state set ?", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
}