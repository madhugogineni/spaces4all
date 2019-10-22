var con = require("../database");
var utils = require('../services/utils');
module.exports = {
    getHomeSlide: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from home_slide limit 5", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getHomeSlideById: function (homeSlideId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from home_slide where home_slide_id='" + homeSlideId + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result[0]});
            });
        });
    },
    addHomeSlide: function (data) {
        return new Promise(function (resolve, reject) {
            data.datetime = utils.getDate();
            con.query("insert into home_slide set ?", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deleteHomeSlide: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from home_slide where home_slide_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    }
}