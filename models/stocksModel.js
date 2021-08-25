var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getStocks: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from stocks order by name asc", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false });
                } else {
                    resolve({ success: true, data: result });
                }
            });
        });
    },
    getEnabledStocks: function () {
        return new Promise(function (resolve, reject) {
            con.query("select id,name,code from stocks where is_deleted = 0", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false });
                } else {
                    resolve({ success: true, data: result });
                }
            });
        });
    },
    getStockById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from stocks where id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getStockByCode: function (code) {
        return new Promise(function (resolve, reject) {
            con.query("select * from stocks where is_deleted = 0 and code='" + code + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false });
                } else {
                    if (result[0].id) {
                        resolve({ success: true, data: result });
                    } else {
                        resolve({ success: false });
                    }
                }
            });
        });
    },
    add: function (data) {
        return new Promise(function (resolve, reject) {
            data['created_at'] = data['updated_at'] = moment().format(dateFormat);
            con.query("insert into stocks set ?", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false });
                }
                resolve({ success: true });
            })
        });
    },
    updateStock: function (data, stocksId) {
        return new Promise(function (resolve, reject) {
            con.query("update stocks set ? where id='" + stocksId + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false });
                }
                resolve({ success: true });
            })
        });
    },
    deleteStock: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from stocks where id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false });
                }
                resolve({ success: true });
            })
        });
    }
}