var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {

    getNewsLetter() {
        return new Promise(function (resolve, reject) {
            con.query("select * from news_letter order by datetime DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getNewsLetterAvailable: function (email) {
        return new Promise(function (resolve, reject) {
            con.query("select * from news_letter where email='" + email + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result.length);
            });
        });
    },
    deleteNewsLetter: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from news_letter where news_letter_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true})
            });
        });
    }
}