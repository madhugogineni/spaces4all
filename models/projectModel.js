var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
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
            con.query("SELECT projects.*,project_configurations.size,project_configurations.plan, " +
                "project_configurations.configuration_id,project_configurations.price as config_price, " +
                "project_type.type as project_type_name,project_photos.photo as project_photo, " +
                "project_sub_type.sub_type as project_sub_type_name,city.city as city_name,locality.locality as " +
                "locality_name FROM `projects` inner join project_type as project_type on projects.project_type = " +
                "project_type.project_type_id inner join project_sub_type on projects.project_sub_type = " +
                "project_sub_type.project_sub_type_id inner join city on projects.city = city.city_id inner join " +
                "locality on projects.locality = locality.locality_id left join(select * from project_photos where photo != null limit 1) " +
                "project_photos on projects.project_id = project_photos.project_id left join project_configurations " +
                "on projects.project_id = project_configurations.project_id where " +
                "projects.project_id in (" + projectId + ")", function (error, result) {
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
}