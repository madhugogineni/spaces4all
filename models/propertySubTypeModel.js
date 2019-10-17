var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getPropertySubType: function () {
        return new Promise(function (resolve, reject) {
            con.query("select property_sub_type.*,property_type.type as property_type from property_sub_type inner " +
                "join property_type on property_sub_type.property_type_id = property_type.property_type_id", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getPropertySubTypeById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select sub_type from property_sub_type where property_sub_type_id=" + id, function (error, result) {
                if (error)
                    console.log({success: false, message: error});
                resolve({success: true, sub_type: result[0].sub_type});
            })
        });
    },
    getPropertySubTypeByProperty(propertyId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_sub_type where property_type_id=" + propertyId, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    addPropertySubType: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into property_sub_type set ? ", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deletePropertySubType: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from property_sub_type where property_sub_type_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        });
    },
    updatePropertySubType: function (data, id) {
        return new Promise(function (resolve, reject) {
            con.query("update property_sub_type set ? where property_sub_type_id='" + id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
}