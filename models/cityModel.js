var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getCity: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from city order by city ASC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getCityLimit: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from city order by city_id ASC limit 1", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getCityById: function (id) {
        console.log(id);
        return new Promise(function (resolve, reject) {
            con.query("select * from city where city_id=" + id, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result[0]});
            });
        });
    },
    addCity: function (data) {
        return new Promise(function (resolve, reject) {
            con.query('insert into city set ?', data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        });
    },
    updateCity: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("update city set ? where city_id='" + data.city_id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        })
    },
    deleteCity: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from city where city_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    }
}