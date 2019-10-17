var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getProjectSubTypes: function () {
        return new Promise(function (resolve, reject) {
            con.query("select project_sub_type.*,project_type.type as project_type from project_sub_type inner " +
                "join project_type on project_sub_type.project_type_id = project_type.project_type_id", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },

    getProjectSubTypeById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_sub_type where project_sub_type_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },

    getProjectSubTypeByProject: function (projectId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_sub_type where project_type_id=" + projectId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    addProjectSubType: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into project_sub_type set ? ", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deleteProjectSubType: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from project_sub_type where project_sub_type_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        });
    },
    updateProjectSubType: function (data, id) {
        return new Promise(function (resolve, reject) {
            con.query("update project_sub_type set ? where project_sub_type_id='" + id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
}