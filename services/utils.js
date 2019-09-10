var moment = require('moment');
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getPrice: function (price, isProject) {
        var responsePrice;
        if (!isProject) {
            responsePrice = this.convertPrice(price)
        } else {
            responsePrice = {
                min_price: this.convertPrice(price.min_price),
                max_price: this.convertPrice(price.max_price)
            }
        }
        return responsePrice;
    },
    convertPrice: function (price) {
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
        return responsePrice
    },
    getDate: function () {
        return moment().format(dateFormat);
    }
}