var con = require("../database");
var utils = require('../services/utils');
module.exports = {
    getStampDuty: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from stamp_duty order by state ASC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false})
                }
                resolve({success: true, data: result});
            });
        });
    },
    getStampDutyById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from stamp_duty where stamp_duty_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    addStampDuty: function (data) {
        return new Promise(function (resolve, reject) {
            data.datetime = utils.getDate();
            con.query("insert into stamp_duty set ?", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    updateStampDuty: function (data, stateId) {
        return new Promise(function (resolve, reject) {
            con.query("update stamp_duty set ? where stamp_duty_id='" + stateId + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deleteStampDuty: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from stamp_duty where stamp_duty_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    }
}