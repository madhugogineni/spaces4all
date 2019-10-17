var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getNews: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from news order by datetime DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getNewsById: function (newsId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from news where news_id='" + newsId + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                if (result) {
                    resolve({success: true, data: result[0]});
                } else {
                    resolve({success: false});
                }
            });
        });
    },
    getNewsLimit: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from news order by datetime DESC limit 10", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    addNews: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into news set ?", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    updateNews: function (data, id) {
        return new Promise(function (resolve, reject) {
            con.query("update news set ? where news_id='" + id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deleteNews: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from news where news_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    }
}