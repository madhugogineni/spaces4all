var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getBanks: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from banks", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getBanksById: function (banksList) {
        return new Promise(function (resolve, reject) {
            con.query("select * from banks where bank_id in (" + banksList + ")", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                } else {
                    resolve({success: true, data: result});
                }
            });
        })
    },
    getBankById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from banks where bank_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    addBank: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into banks set ? ", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deleteBank: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from banks where bank_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        });
    },
    updateBank: function (data, id) {
        return new Promise(function (resolve, reject) {
            con.query("update banks set ? where bank_id='" + id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
};