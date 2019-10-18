var con = require("../database");
module.exports = {
    getServicesRequests: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from services_requests order by datetime ASC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    deleteServicesRequests: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from services_requests where request_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    }
}