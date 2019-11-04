var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {

    getAmenities: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from amenities", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false})
                }
                resolve({success: true, data: result});
            });
        });
    },
    getAmenitiesById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from amenities where amenity_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getAmenityNames: function (amenitiesList) {
        return new Promise(function (resolve, reject) {
            if (amenitiesList) {
                con.query("SELECT amenity,amenity_icon FROM `amenities` WHERE amenity_id IN (" + amenitiesList + ")", function (error, result) {
                    if (error) {
                        console.log(error);
                        resolve({success: false, message: error});
                    } else {
                        resolve({success: true, data: result});
                    }
                })
            } else {
                resolve({success: true, data: []});
            }

        })
    },
    addAmenity: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into amenities set ? ", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deleteAmenity: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from amenities where amenity_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        });
    },
    updateAmenity: function (data, id) {
        return new Promise(function (resolve, reject) {
            con.query("update amenities set ? where amenity_id='" + id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
};