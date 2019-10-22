var con = require("../database");
var utils = require('../services/utils');
module.exports = {
    getHomeAds: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from home_ads", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getHomeAdById: function (homeAdId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from home_ads where home_ad_id='" + homeAdId + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result[0]});
            });
        });
    },
    addHomeAds: function (data) {
        return new Promise(function (resolve, reject) {
            data.datetime = utils.getDate();
            con.query("insert into home_ads set ?", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deleteHomeAds: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from home_ads where home_ad_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    }
}