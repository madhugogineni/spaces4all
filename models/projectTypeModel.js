var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getProjectType: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_type", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getProjectTypeById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_type where project_type_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            })
        });
    },
    addProjectType: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into project_type set ? ", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deleteProjectType: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from project_type where project_type_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        });
    },
    updateProjectType: function (data, id) {
        return new Promise(function (resolve, reject) {
            con.query("update project_type set ? where project_type_id='" + id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
};