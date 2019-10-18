var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
var utils = require('../services/utils');
module.exports = {
    getPriceTrends: function () {
        return new Promise(function (resolve, reject) {
            con.query("SELECT price_trends.*,city.city AS city_name, locality.locality as locality_name FROM " +
                "price_trends inner join city on price_trends.city = city.city_id inner join locality on " +
                "price_trends.locality = locality.locality_id order by datetime DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getPriceTrendById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from price_trends where price_trend_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    addPriceTrends: function (data) {
        return new Promise(function (resolve, reject) {
            data.datetime = utils.getDate();
            con.query("insert into price_trends set ?", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    updatePriceTrends: function (data, id) {
        return new Promise(function (resolve, reject) {
            con.query("update price_trends set ? where price_trend_id='" + id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deletePriceTrends: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from price_trends where price_trend_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    }
}