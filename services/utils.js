var moment = require('moment');
var dateFormat = "YYYY-MM-DD HH:mm:ss";
var fs = require('fs');
var crudModel = require('../models/crudModel');
var ejs = require('ejs');
var urls = require('../external-config/url-config');
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
    },
    uploadImages: async function (photoFiles, propertyId, path) {
        if (photoFiles.length) {
            var imagesToUpload = [];
            var fileNames = [];
            for (var i = 0; i < photoFiles.length; i++) {
                var fileName = photoFiles[i].originalname;//propertyId + "|" +
                var uploadResponse = await this.writeFile(
                    fileName,
                    photoFiles[i].buffer,
                    path
                );
                if (uploadResponse.success) {
                    fileNames.push(fileName);
                    var photoFile = [propertyId, fileName, this.getDate()];
                    imagesToUpload.push(photoFile);
                }
            }
            var response = await crudModel.addPropertyPhotos(imagesToUpload);
            if (response.success) {
                return {success: true, fileNames: fileNames};
            } else {
                return {success: false};
            }
        }
    },
    writeFile: function (fileName, fileBuffer, path) {
        return new Promise(function (resolve, reject) {
            fs.appendFile(path + fileName, fileBuffer, function (error) {
                if (error) {
                    console.log("file not saved");
                    resolve({success: false});
                } else {
                    resolve({success: true});
                }
            });
        });
    },
    deleteFile: function (fileName, filePath) {
        return new Promise(function (resolve, reject) {
            fs.unlinkSync(filePath + fileName, function (error) {
                if (error) {
                    console.log("file deletion not successful");
                    resolve({success: false});
                } else {
                    resolve({success: true});
                }
            });
        });
    },
    getTemplateForMail: function (fileName, parameters) {
        var result = ejs.compile(fs.readFileSync(__dirname + '/../views/mailers/' + fileName, 'utf8'));
        parameters.base_url = urls.base_url;
        var html = result(parameters);
        return html;
    }
}