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
        var monthAgoDate = moment().subtract(2, 'months').format('YYYY-MM-DD');
        return new Promise(function (resolve, reject) {
            con.query("select * from stock_data where id in (select max(id) from stock_data where stock_id = " + stockId + " and created_at > '" + monthAgoDate + "' group by cur_date) and created_at > '" + monthAgoDate + "' order by cur_date desc", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false });
                }
                resolve({ success: true, data: result });
            })
        });
    },

    getMetricStockData: function (metric) {
        var monthAgoDate = moment().subtract(2, 'months').format('YYYY-MM-DD');
        return new Promise(function (resolve, reject) {
            var query = "select sd." + metric + ",sd.stock_id,sd.cur_date,s.code,s.name from stock_data as sd inner join stocks as s on sd.stock_id = s.id where sd.id in (select max(id) from stock_data group by cur_date,stock_id) and sd.cur_date > '" + monthAgoDate + "' order by s.name asc"
            con.query(query, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false });
                }
                resolve({ success: true, data: result });
            })
        });
    }
}