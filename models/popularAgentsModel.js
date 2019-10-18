var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
var utils = require('../services/utils');
module.exports = {
    getPopularAgents: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from popular_agents order by datetime DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getPopularAgentById: function (agentId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from popular_agents where agent_id=" + agentId, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    addPopularAgents: function (data) {
        return new Promise(function (resolve, reject) {
            data.datetime = utils.getDate();
            con.query("insert into popular_agents set ?", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    updatePopularAgents: function (data, id) {
        return new Promise(function (resolve, reject) {
            con.query("update popular_agents set ? where agent_id='" + id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    },
    deletePopularAgents: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from popular_agents where agent_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    }
}