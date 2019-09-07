var moment = require('moment');
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getPrice: function (price) {
        var responsePrice;
        if (price) {
            if (price > 10000000) {
                responsePrice = Math.round(parseFloat(price) / 10000000, 2);
                responsePrice = responsePrice + " Cr";
            } else if (price > 100000) {
                responsePrice = Math.round(parseFloat(price) / 100000, 2);
                responsePrice = responsePrice + " Lac";
            } else {
                responsePrice = price;
            }
            responsePrice = "Rs. " + responsePrice;
        } else {
            responsePrice = "Price on request"
        }
        return responsePrice;
    },
    getDate: function () {
        return moment().format(dateFormat);
    }
}