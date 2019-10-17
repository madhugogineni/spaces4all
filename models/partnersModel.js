var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getPartners: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from partners order by partner_id DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getPartnerById: function (partnerId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from partners where partner_id='" + partnerId + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    addPartner: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into partners set ?", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deletePartner: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from partners where partner_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true})
            });
        });
    },
    updatePartner: function (data, id) {
        return new Promise(function (resolve, reject) {
            con.query("update partners set ? where partner_id='" + id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
}