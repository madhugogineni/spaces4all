var con = require("../database");
module.exports = {
    getContacts: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from contact order by datetime DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    deleteContact: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from contact where contact_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        });
    }
}