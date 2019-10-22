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

    getProjectConfigurationsById: function (configurationId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_configurations where configuration_id=" + configurationId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPhotosByProject: function (projectId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_photos where project_id=" + projectId + " order by photo_id ASC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getProjectPhotoById: function (photoId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_photos where photo_id=" + photoId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getLatestPhotoByProject: function (projectId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_photos where project_id=" + projectId + " order by photo_id ASC limit 1", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getProjectById: function (projectId) {
        return new Promise(function (resolve, reject) {
            con.query("SELECT projects.*,project_type.type as project_type_name," +
                "project_sub_type.sub_type as project_sub_type_name,city.city as city_name,locality.locality as locality_name FROM `projects` " +
                "inner join project_type as project_type on projects.project_type = project_type.project_type_id " +
                "inner join project_sub_type on projects.project_sub_type = project_sub_type.project_sub_type_id " +
                "inner join city on projects.city = city.city_id inner join locality on projects.locality = locality.locality_id where project_id=" + projectId, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false})
                }
                resolve({success: true, data: result[0]});
            });
        });
    },
    getProjectByIds: function (projectId) {
        return new Promise(function (resolve, reject) {
            con.query("SELECT projects.*,project_configurations.size,project_configurations.plan,project_configurations.configuration_id," +
                "project_configurations.price as config_price,project_type.type as project_type_name," +
                "project_photos.photo as project_photo,project_sub_type.sub_type as project_sub_type_name,city.city " +
                "as city_name,locality.locality as locality_name FROM `projects` inner join project_type as " +
                "project_type on projects.project_type = project_type.project_type_id inner join project_sub_type on " +
                "projects.project_sub_type = project_sub_type.project_sub_type_id inner join city on projects.city = " +
                "city.city_id inner join locality on projects.locality = locality.locality_id left join project_photos " +
                "on projects.project_id = project_photos.project_id left join project_configurations on " +
                "projects.project_id = project_configurations.project_id where projects.project_id " +
                "in (" + projectId + ")", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false})
                }
                resolve({success: true, data: result});
            });
        });
    },
    getLatestProjects: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from featured_projects order by featured_project_id ASC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getLatestProjectDetails: function () {
        return new Promise(function (resolve, reject) {
            con.query("select projects.project_id as project_id,project_photos.photo as project_photo,city.city as city, locality.locality as locality," +
                " project_type.type as project_type, project_sub_type.sub_type as project_sub_type,projects.plans as plans,projects.min_builtup_area as min_builtup_area," +
                " projects.max_builtup_area as max_builtup_area, projects.group_name as group_name,projects.total_units as total_units, projects.total_area" +
                " as total_area,projects.project_name as project_name, projects.min_price as min_price from featured_projects inner join projects on featured_projects.project_id = projects.project_id inner join city on" +
                " projects.city = city.city_id inner join locality on projects.locality = locality.locality_id inner join project_type on" +
                " projects.project_type = project_type.project_type_id inner join project_sub_type on projects.project_sub_type = project_sub_type.project_sub_type_id" +
                " left join project_photos on projects.project_id = project_photos.project_id order by featured_project_id ASC", function (error, result) {
                if (error) {
                    console.log(error);
                }
                // console.log(result);
                resolve(result);
            });
        });
    },
    getProjectDetailsById: function (projectId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from projects where project_id=" + projectId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getProjects: function () {
        return new Promise(function (resolve, reject) {
            con.query("SELECT projects.*,project_type.type as project_type_name, " +
                "project_sub_type.sub_type as project_sub_type_name,city.city as city_name FROM `projects` " +
                "inner join project_type as project_type on projects.project_type = project_type.project_type_id " +
                "inner join project_sub_type on projects.project_sub_type = project_sub_type.project_sub_type_id " +
                "inner join city on projects.city = city.city_id order by datetime DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false})
                } else {
                    resolve({success: true, data: result});
                }
            });
        });
    },
    getProjectConfigurations: function (projectId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_configurations where project_id='" + projectId + "' order by project_id ASC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false})
                }
                resolve({success: true, data: result});
            });
        });
    },
    getProjectsSearch: function (projectType, projectSubType, city, locality, bedrooms, postedBy, minPrice, maxPrice, searchType) {
        var query = "SELECT * FROM projects where project_id !=0 and project_status=1";

        if (projectType != "") {
            if (projectType != 0) {
                query += " AND project_type='" + projectType + "'";
            }
        }
        if (projectSubType != "") {
            query += " AND project_sub_type='" + projectSubType + "'";
        }
        if (city != "") {
            query += " AND city='" + city + "'";
        }
        if (locality != "") {
            query += " AND locality='" + locality + "'";
        }
        if (bedrooms != "") {
            query += " AND FIND_IN_SET('" + bedrooms + "',plans) > 0";
        }
        if (postedBy != "") {
            query += " AND posted_by='" + postedBy + "'";
        }
        if (minPrice != "") {
            query += " AND min_price >='" + minPrice + "'";
        }
        if (maxPrice != "") {
            query += " AND max_price <='" + maxPrice + "'";
        }
        if (searchType != "") {
            query += " AND want_to ='" + searchType + "'";
        }
        query += " ORDER BY datetime DESC ";
        console.log(query);
        return new Promise(function (resolve, reject) {
            con.query(query, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getExclusiveProjects: function (city) {
        return new Promise(function (resolve, reject) {
            con.query("SELECT * FROM projects where project_id !=0 and project_status=1 and exclusive='1' and city='" + city + "' ORDER BY datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getExclusiveProjectDetails: function (city) {
        return new Promise(function (resolve, reject) {
            con.query("SELECT projects.*, project_type.type as project_type_name, project_sub_type.sub_type as project_sub_type_name, city.city as city_name," +
                " locality.locality as locality_name,project_photos.photo as project_photo FROM projects inner join project_type on" +
                " projects.project_type = project_type.project_type_id inner join project_sub_type on projects.project_sub_type = project_sub_type.project_sub_type_id" +
                " inner join city on projects.city = city.city_id inner join locality on projects.locality = locality.locality_id left join project_photos on" +
                " projects.project_id = project_photos.project_id where projects.project_id !=0 and projects.project_status=1 and projects.exclusive='1' and" +
                " projects.city=" + city + " ORDER BY datetime DESC;", function (error, result) {
                if (error) {
                    console.log(error);
                }
                resolve(result);
            });
        });
    },
    getProjectsSearchCount: function (projectType, projectSubType, city, locality, bedrooms, postedBy, minPrice, maxPrice, searchType) {
        var query = "SELECT * FROM projects where project_id !=0 and project_status=1";

        if (projectType != "" && projectType != null && projectType != undefined) {
            if (projectType != 0) {
                query += " AND project_type='" + projectType + "'";
            }
        }
        if (projectSubType != "" && projectSubType != null && projectSubType != undefined) {
            query += " AND project_sub_type='" + projectSubType + "'";
        }
        if (city != "" && projectSubType != null && projectSubType != undefined) {
            query += " AND city='" + city + "'";
        }
        if (locality != "" && projectSubType != null && projectSubType != undefined) {
            query += " AND locality='" + locality + "'";
        }
        if (bedrooms != "" && projectSubType != null && projectSubType != undefined) {
            query += " AND FIND_IN_SET('" + bedrooms + "',plans) > 0";
        }
        if (postedBy != "" && postedBy != null && postedBy != undefined) {
            query += " AND posted_by='" + postedBy + "'";
        }
        if (minPrice != "" && minPrice != null && minPrice != undefined) {
            query += " AND min_price >='" + minPrice + "'";
        }
        if (maxPrice != "" && maxPrice != null && maxPrice != undefined) {
            query += " AND max_price <='" + maxPrice + "'";
        }
        if (searchType != "" && searchType != null && searchType != undefined) {
            query += " AND want_to ='" + searchType + "'";
        }
        query += " ORDER BY datetime DESC ";
        // console.log(query);
        return new Promise(function (resolve, reject) {
            con.query(query, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result.length);
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
                    resolve({success: false});
                } else {
                    resolve({success: true, insertId: result.insertId});
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
                    resolve({success: false, message: error});
                } else {
                    resolve({success: true});
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
                    resolve({success: false});
                } else {
                    con.query("select * from loan_requests where loan_id=" + result.insertId, function (error1, result1) {
                        if (error1) {
                            console.log(error1);
                            resolve({success: false});
                        }
                        resolve({success: true, data: result1});
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
                    resolve({success: false});
                }
                resolve({success: true, result: result});
            });
        });
    },
    addProjectCallback: function (projectId, name, phone) {
        var datetime = moment().format(dateFormat);
        return new Promise(function (resolve, reject) {
            con.query("insert into call_back(project_id,name,phone,datetime) values(" + projectId + ",'" + name + "','" + phone + "','" + datetime + "')", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, result: result});
            });
        });
    },

    updateColumnInProjects: function (column, value, projectId) {
        return new Promise(function (resolve, reject) {
            console.log("update projects set " + column + " = " + value + " where project_id = " + projectId)
            con.query('update projects set ' + column + ' = ' + value + ' where project_id = ' + projectId, function (error, result) {
                if (error) {
                    resolve({success: false});
                } else {
                    resolve({success: true})
                }
            });
        })
    },
    deleteProject: function (projectId) {
        return new Promise(function (resolve, reject) {
            console.log('delete from projects where project_id=' + projectId)
            con.query('delete from projects where project_id=' + projectId, function (error, result) {
                if (error) {
                    console.log(error)
                } else {
                    resolve({success: true, message: error});
                }
            })
        });
    },
    deleteProjectConfiguration: function (configurationId) {
        return new Promise(function (resolve, reject) {
            con.query('delete from project_configurations where configuration_id = ' + configurationId, function (error, result) {
                if (error) {
                    console.log(error)
                    resolve({success: false});
                }
                resolve({success: true})
            });
        });
    },
    updateProjectConfigurations: function (data, configurationId) {
        var query = "";
        if (configurationId) {
            query = 'update project_configurations set ? where configuration_id = ' + configurationId
        } else {
            query = 'insert into project_configurations set ? '
        }
        return new Promise(function (resolve, reject) {
            con.query(query, data, function (error, result) {
                if (error) {
                    console.log(error)
                    resolve({success: false});
                } else {
                    resolve({success: true});
                }
            });
        })
    },
    addProject: function (data, projectId) {
        var query = "";
        if (projectId) {
            query = "update projects set ? where project_id='" + projectId + "'";
        } else {
            query = "insert into projects set ?";
            data.datetime = moment().format(dateFormat);
        }
        return new Promise(function (resolve, reject) {
            con.query(query, data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                } else {
                    resolve({success: true});
                }
            });
        });
    },
    getProjectNames: function () {
        return new Promise(function (resolve, reject) {
            con.query('select project_name,project_id from projects', function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    }

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