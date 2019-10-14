var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getLocality: function () {
        return new Promise(function (resolve, reject) {
            con.query("SELECT locality.*,city.city FROM `locality` inner join city where locality.city_id = city.city_id order by locality.locality ASC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getLocalityById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from locality where locality_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getLocalityByCity: function (cityId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from locality where city_id=" + cityId + " order by locality ASC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    addLocality: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into locality set ? ", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deleteLocality: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from locality where locality_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        });
    },
    updateLocality: function (data, id) {
        return new Promise(function (resolve, reject) {
            con.query("update locality set ? where locality_id='" + id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    test: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },

};