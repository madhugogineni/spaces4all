var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getTestimonial: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from testimonial order by datetime DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getTestimonialLimit: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from testimonial order by datetime DESC limit 1", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getTestimonialById: function (testimonialId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from testimonial where testimonial_id='" + testimonialId + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    addTestimonial: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into testimonial set ?", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deleteTestimonial: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from testimonial where testimonial_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true})
            });
        });
    },
    updateTestimonial: function (data, id) {
        return new Promise(function (resolve, reject) {
            con.query("update testimonial set ? where testimonial_id='" + id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
}