var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getPropertyType: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_type order by property_type_id DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },

    getPropertyTypeById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select type from property_type where property_type_id=" + id, function (error, result) {
                if (error)
                    console.log({success: false, message: error});
                resolve({success: true, type: result[0].type});
            });
        });
    },
    addPropertyType: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into property_type set ? ", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deletePropertyType: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from property_type where property_type_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        });
    },
    updatePropertyType: function (data, id) {
        return new Promise(function (resolve, reject) {
            con.query("update property_type set ? where property_type_id='" + id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
}