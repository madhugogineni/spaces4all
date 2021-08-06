var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    add: function (data) {
        return new Promise(function (resolve, reject) {
            data['created_at'] = data['updated_at'] = moment().format(dateFormat);
            con.query("insert into stock_data set ?", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
}