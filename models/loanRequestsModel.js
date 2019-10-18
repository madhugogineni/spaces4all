var con = require("../database");
module.exports = {
    getLoanRequests: function () {
        return new Promise(function (resolve, reject) {
            con.query("SELECT loan_requests.*,banks.bank_name FROM `loan_requests` inner join banks on " +
                "loan_requests.bank = banks.bank_id order by datetime ASC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    deleteLoanRequests: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from loan_requests where loan_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    }
}