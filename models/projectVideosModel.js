var con = require("../database");
module.exports = {
    getProjectVideos: function (type) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_videos where type='" + type + "' order by datetime DESC limit 1", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result[0]});
            });
        });
    },
    getProjectVideosCheck: function (type) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_videos where type='" + type + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result.length);
            });
        });
    },
    updateProjectVideos: function (data, type) {
        return new Promise(function (resolve, reject) {
            con.query("update project_videos set ? where type='" + type + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
};