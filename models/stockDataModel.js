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
                    resolve({ success: false });
                }
                resolve({ success: true });
            })
        });
    },

    getLastMonthStockData: function (stockId) {
        var monthAgoDate = moment().subtract(1, 'months').format('YYYY-MM-DD');
        return new Promise(function (resolve, reject) {
            con.query("SELECT sd1.* FROM stock_data sd1 LEFT JOIN stock_data sd2  ON (sd1.stock_id = sd2.stock_id AND sd1.cur_date = sd2.cur_date AND sd1.id < sd2.id) WHERE sd2.id IS NULL and sd1.stock_id = " + stockId + " and sd1.cur_date > '" + monthAgoDate + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false });
                }
                resolve({ success: true, data: result });
            })
        });
    },

    getMetricStockData: function (metric) {
        var monthAgoDate = moment().subtract(1, 'months').format('YYYY-MM-DD');
        return new Promise(function (resolve, reject) {
            con.query("SELECT sd1." + metric + ",sd1.stock_id, sd1.cur_date, s.code, s.name FROM stock_data sd1 LEFT JOIN stock_data sd2  ON (sd1.stock_id = sd2.stock_id AND sd1.cur_date = sd2.cur_date AND sd1.id < sd2.id) inner join stocks as s on s.id = sd1.stock_id WHERE sd2.id IS NULL and sd1.cur_date > '" + monthAgoDate + "' order by cur_date desc", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false });
                }
                resolve({ success: true, data: result });
            })
        });
    }
}