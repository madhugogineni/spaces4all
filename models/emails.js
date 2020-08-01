var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    insertEmail: function (params) {
        return new Promise(function (resolve, reject) {
            params['created_at'] = params['updated_at'] = moment().format(dateFormat);
            con.query("insert into emails set ?", params, function (error, result) {
                if (error) {
                    resolve({ success: false, message: error });
                }

                resolve({ success: true, id: result.insertId })
            })

        })
    }
}