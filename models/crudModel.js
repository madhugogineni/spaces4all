var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";

var rentModule = require('./rentModel');
var cityModule = require('./cityModel');
var localityModule = require('./localityModel');
var stateModule = require('./stateModel');
var bankModule = require('./bankModel');
var amenitiesModule = require('./amenitiesModel');
var projectTypeModule = require('./projectTypeModel');
var projectSubTypeModule = require('./projectSubTypeModel');
var propertyTypeModule = require('./propertyTypeModel');
var propertySubTypeModule = require('./propertySubTypeModel');
var contactsModule = require('./contactsModel');
var feedbackModule = require('./feedbackModel');
var scheduleSiteVisit = require('./scheduleSiteVisit');
var newsLetterModule = require('./newsLetterModel');
var testimonialModule = require('./testimonialModel');
var partnerModule = require('./partnersModel');
var newsModule = require('./newsModel');
var callbackModule = require('./callbackModel');
var popularAgentsModule = require('./popularAgentsModel');
var priceTrendsModule = require('./priceTrendsModel');
var serviceRequestsModule = require('./serviceRequestsModel');
var loanRequestsModule = require('./loanRequestsModel');
var postRequirementModule = require('./postRequirementModel');
var stampDutyModule = require('./stampDutyModel');
var projectVideoModule = require('./projectVideosModel');
var homeAdsModule = require('./homeAdsModel');
var homeSlideModule = require('./homeSlidesModel');
var enquiryModule = require('./enquiryModel');
var propertyModule = require('./propertyModel');
var projectModule = require('./projectModel');

module.exports = {

    getAdminByEmail: function (emailId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from admin where email='" + emailId + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },

    getSimilarProjects: function (projectId, projectType, city) {
        return new Promise(function (resolve, reject) {
            console.log("select * from projects where project_type like '%" + projectType + "%' and city like '%" + city + "%' and project_id !='" + projectId + "' and project_status='1' order by datetime DESC limit 4");
            con.query("select * from projects where project_type like '%" + projectType + "%' and city like '%" + city + "%' and project_id !='" + projectId + "' and project_status='1' order by datetime DESC limit 4", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getSimilarRentProperties: function (rentId, propertyType, city) {
        return new Promise(function (resolve, reject) {
            console.log("select * from projects where property_type like '%" + propertyType + "%' and city like '%" + city + "%' and rent_id !='" + rentId + "' and status='1' order by datetime DESC limit 4");
            con.query("select * from projects where property_type like '%" + propertyType + "%' and city like '%" + city + "%' and rent_id !='" + rentId + "' and status='1' order by datetime DESC limit 4", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },

    getHomeSlide: function () {
        return new Promise(function (resolve, reject) {
            con.query('select * from home_slide limit 5', function (error, result) {
                if (error) {
                    console.log(error)
                    resolve({ success: false });
                }
                resolve({ success: true, data: result });
            });
        });
    },

    getPriceTrendsSearch: function (type, city, locality) {
        var query = "select * from price_trends where type='" + type + "' and city='" + city + "'";
        if (locality != null || locality != '') {
            query += " and locality='" + locality + "'";
        }
        query += " order by datetime DESC";

        return new Promise(function (resolve, reject) {
            con.query(query, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getCompare(type, ip) {
        return new Promise(function (resolve, reject) {
            con.query("select * from compare where type='" + type + "' and ip='" + ip + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getCompareCount(type, ip) {
        return new Promise(function (resolve, reject) {
            con.query("select * from compare where type='" + type + "' and ip='" + ip + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result.length);
            });
        });
    },
    getCompareCountCheck: function (type, ip, id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from compare where type='" + type + "' and ip='" + ip + "' and id='" + id + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result.length);
            });
        });
    },


    insertContact: function (name, email, phone, message) {
        var datetime = moment().format(dateFormat);
        return new Promise(function (resolve, reject) {
            con.query("insert into contact(name,email,phone,message,datetime) values('" + name + "','" + email + "'," + phone + ",'" + message + "','" + datetime + "')", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false });
                } else {
                    resolve({ success: true, insertId: result.insertId });
                    // con.query("select * from contact where contact_id=" + result.insertId, function (error1, result1) {
                    //     if (error1) {
                    //         console.log(error1);
                    //     } else {
                    //         resolve(result1);
                    //     }
                    // });
                }

            })
        });
    },
    insertNewLetterSubscriber: function (email) {
        var datetime = moment().format(dateFormat);
        return new Promise(function (resolve, reject) {
            con.query("insert into news_letter(email,datetime) values('" + email + "','" + datetime + "')", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false, message: error });
                } else {
                    resolve({ success: true });
                    // con.query("select * from news_letter where news_letter_id=" + result.insertId, function (error1, result1) {
                    //     if (error1) {
                    //         console.log(error1);
                    //     } else {
                    //         resolve({result1});
                    //     }
                    // });
                }

            })
        });
    },
    insertLoanRequest: function (purpose, bank, loanAmount, annualIncome, name, mobile, email, dob, city) {
        var datetime = moment().format(dateFormat);
        return new Promise(function (resolve, reject) {
            con.query("insert into loan_requests(purpose,bank,loan_amount,annual_income,name,mobile,email,dob,city,datetime) values('" + purpose + "'," + bank + ",'" + loanAmount + "','" + annualIncome + "','" + name + "','" + mobile + "','" + email + "','" + dob + "','" + city + "','" + datetime + "')", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false });
                } else {
                    con.query("select * from loan_requests where loan_id=" + result.insertId, function (error1, result1) {
                        if (error1) {
                            console.log(error1);
                            resolve({ success: false });
                        }
                        resolve({ success: true, data: result1 });
                    });
                }
            });
        });
    },
    addPropertyCallback: function (propertyId, name, phone) {
        var datetime = moment().format(dateFormat);
        return new Promise(function (resolve, reject) {
            con.query("insert into property_call_back(property_id,name,phone,datetime) values(" + propertyId + ",'" + name + "','" + phone + "','" + datetime + "')", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false });
                }
                resolve({ success: true, result: result });
            });
        });
    },
    addProjectCallback: function (projectId, name, phone) {
        var datetime = moment().format(dateFormat);
        return new Promise(function (resolve, reject) {
            con.query("insert into call_back(project_id,name,phone,datetime) values(" + projectId + ",'" + name + "','" + phone + "','" + datetime + "')", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({ success: false });
                }
                resolve({ success: true, result: result });
            });
        });
    },


};
for (var key in rentModule) {
    if (rentModule.hasOwnProperty(key)) {
        module.exports[key] = rentModule[key];
    }
}
for (var key in cityModule) {
    if (cityModule.hasOwnProperty(key)) {
        module.exports[key] = cityModule[key];
    }
}
for (var key in localityModule) {
    if (localityModule.hasOwnProperty(key)) {
        module.exports[key] = localityModule[key];
    }
}
for (var key in stateModule) {
    if (stateModule.hasOwnProperty(key)) {
        module.exports[key] = stateModule[key];
    }
}
for (var key in bankModule) {
    if (bankModule.hasOwnProperty(key)) {
        module.exports[key] = bankModule[key];
    }
}
for (var key in amenitiesModule) {
    if (amenitiesModule.hasOwnProperty(key)) {
        module.exports[key] = amenitiesModule[key];
    }
}
for (var key in projectTypeModule) {
    if (projectTypeModule.hasOwnProperty(key)) {
        module.exports[key] = projectTypeModule[key];
    }
}
for (var key in projectSubTypeModule) {
    if (projectSubTypeModule.hasOwnProperty(key)) {
        module.exports[key] = projectSubTypeModule[key];
    }
}
for (var key in propertyTypeModule) {
    if (propertyTypeModule.hasOwnProperty(key)) {
        module.exports[key] = propertyTypeModule[key];
    }
}
for (var key in propertySubTypeModule) {
    if (propertySubTypeModule.hasOwnProperty(key)) {
        module.exports[key] = propertySubTypeModule[key];
    }
}
for (var key in contactsModule) {
    if (contactsModule.hasOwnProperty(key)) {
        module.exports[key] = contactsModule[key];
    }
}
for (var key in feedbackModule) {
    if (feedbackModule.hasOwnProperty(key)) {
        module.exports[key] = feedbackModule[key];
    }
}
for (var key in scheduleSiteVisit) {
    if (scheduleSiteVisit.hasOwnProperty(key)) {
        module.exports[key] = scheduleSiteVisit[key];
    }
}
for (var key in newsLetterModule) {
    if (newsLetterModule.hasOwnProperty(key)) {
        module.exports[key] = newsLetterModule[key];
    }
}
for (var key in testimonialModule) {
    if (testimonialModule.hasOwnProperty(key)) {
        module.exports[key] = testimonialModule[key];
    }
}
for (var key in partnerModule) {
    if (partnerModule.hasOwnProperty(key)) {
        module.exports[key] = partnerModule[key];
    }
}
for (var key in newsModule) {
    if (newsModule.hasOwnProperty(key)) {
        module.exports[key] = newsModule[key];
    }
}
for (var key in callbackModule) {
    if (callbackModule.hasOwnProperty(key)) {
        module.exports[key] = callbackModule[key];
    }
}
for (var key in popularAgentsModule) {
    if (popularAgentsModule.hasOwnProperty(key)) {
        module.exports[key] = popularAgentsModule[key];
    }
}
for (var key in priceTrendsModule) {
    if (priceTrendsModule.hasOwnProperty(key)) {
        module.exports[key] = priceTrendsModule[key];
    }
}
for (var key in serviceRequestsModule) {
    if (serviceRequestsModule.hasOwnProperty(key)) {
        module.exports[key] = serviceRequestsModule[key];
    }
}
for (var key in loanRequestsModule) {
    if (loanRequestsModule.hasOwnProperty(key)) {
        module.exports[key] = loanRequestsModule[key];
    }
}
for (var key in postRequirementModule) {
    if (postRequirementModule.hasOwnProperty(key)) {
        module.exports[key] = postRequirementModule[key];
    }
}
for (var key in stampDutyModule) {
    if (stampDutyModule.hasOwnProperty(key)) {
        module.exports[key] = stampDutyModule[key];
    }
}
for (var key in projectVideoModule) {
    if (projectVideoModule.hasOwnProperty(key)) {
        module.exports[key] = projectVideoModule[key];
    }
}
for (var key in homeAdsModule) {
    if (homeAdsModule.hasOwnProperty(key)) {
        module.exports[key] = homeAdsModule[key];
    }
}
for (var key in homeSlideModule) {
    if (homeSlideModule.hasOwnProperty(key)) {
        module.exports[key] = homeSlideModule[key];
    }
}
for (var key in enquiryModule) {
    if (enquiryModule.hasOwnProperty(key)) {
        module.exports[key] = enquiryModule[key];
    }
}
for (var key in propertyModule) {
    if (propertyModule.hasOwnProperty(key)) {
        module.exports[key] = propertyModule[key];
    }
}
for (var key in projectModule) {
    if (projectModule.hasOwnProperty(key)) {
        module.exports[key] = projectModule[key];
    }
}