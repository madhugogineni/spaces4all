var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getFeedback: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from feedback order by datetime DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getFeedbackById: function (feedbackId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from feedback where feedback_id='" + feedbackId + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({sucess: false});
                }
                // console.log(result);
                if (result) {
                    resolve({success: true, data: result[0]});
                } else {
                    resolve({sucess: false});
                }
            });
        });
    },
    deleteFeedback: function (id) {
        return new Promise(function (resolve, reject) {
                con.query("delete from feedback where feedback_id='" + id + "'", function (error, result) {
                    if (error) {
                        console.log(error);
                        resolve({success: false});
                    }
                    resolve({success: true});
                });
            }
        )
            ;
    }
}
;