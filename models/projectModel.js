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
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    addProjectPhotos: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into project_photos(project_id,photo) values ?", [data], function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                } else {
                    resolve({success: true});
                }
            });
        });
    },
    deleteProjectPhoto: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from project_photos  where photo_id = '" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        });
    },
    getProjectPhotoById: function (photoId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_photos where photo_id=" + photoId, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result[0]});
            });
        });
    },
    getLatestPhotoByProject: function (projectId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_photos where project_id=" + projectId + " order by photo_id ASC limit 1", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result[0]});
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
                "project_sub_type.sub_type as project_sub_type_name,city.city as city_name, locality.locality as locality_name FROM `projects` " +
                "inner join project_type as project_type on projects.project_type = project_type.project_type_id " +
                "inner join project_sub_type on projects.project_sub_type = project_sub_type.project_sub_type_id " +
                "inner join city on projects.city = city.city_id inner join locality as locality projects.locality " +
                "= locality.locality_id order by datetime DESC", function (error, result) {
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
    getProjectsSearch: function (parameters = {}, from, limit) {

        var query = "SELECT projects.*,project_type.type as project_type_name, " +
            "project_sub_type.sub_type as project_sub_type_name,city.city as city_name, locality.locality as locality_name FROM `projects` " +
            "inner join project_type as project_type on projects.project_type = project_type.project_type_id " +
            "inner join project_sub_type on projects.project_sub_type = project_sub_type.project_sub_type_id " +
            "inner join city on projects.city = city.city_id inner join locality as locality on projects.locality = locality.locality_id where project_id !=0 and project_status=1";

        if (parameters.project_type != "" && parameters.project_type != undefined) {
            if (parameters.project_type != 0) {
                query += " AND projects.project_type='" + parameters.project_type + "'";
            }
        }
        if (parameters.project_sub_type != "" && parameters.project_sub_type != undefined) {
            query += " AND projects.project_sub_type='" + parameters.project_sub_type + "'";
        }
        if (parameters.city != "" && parameters.city != undefined) {
            query += " AND projects.city='" + parameters.city + "'";
        }
        if (parameters.locality != "" && parameters.locality != undefined) {
            query += " AND projects.locality='" + parameters.locality + "'";
        }
        if (parameters.bedrooms != "" && parameters.bedrooms != undefined) {
            query += " AND FIND_IN_SET('" + parameters.bedrooms + "',projects.plans) > 0";
        }
        if (parameters.posted_by != "" && parameters.posted_by != undefined) {
            query += " AND projects.posted_by='" + parameters.posted_by + "'";
        }
        if (parameters.min_price != "" && parameters.min_price != undefined) {
            query += " AND projects.min_price >='" + parameters.min_price + "'";
        }
        if (parameters.max_price != "" && parameters.max_price != undefined) {
            query += " AND projects.max_price <='" + parameters.max_price + "'";
        }

        if (parameters.search_field != "" && parameters.search_field != undefined) {
            query += " AND (projects.project_name LIKE '%" + parameters.search_field + "%'";
            query += " OR projects.rera_id LIKE '%" + parameters.search_field + "%'";
            query += " OR projects.group_name LIKE '%" + parameters.search_field + "%' )";
        }
        // if (searchType != "") {
        //     query += " AND want_to ='" + searchType + "'";
        // }
        // console.log(query);
        query += " ORDER BY datetime DESC ";
        if (!from || from < 0) {
            from = '0';
        }

        if (limit) {
            query += " limit " + from + "," + limit;
        }
        // console.log(query);
        return new Promise(function (resolve, reject) {
            con.query(query, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
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
    getProjectsSearchCount: function (parameters = {}) {
        var query = "SELECT count(*) as count FROM projects " +
            "inner join project_type as project_type on projects.project_type = project_type.project_type_id " +
            "inner join project_sub_type on projects.project_sub_type = project_sub_type.project_sub_type_id " +
            "inner join city on projects.city = city.city_id inner join locality as locality on projects.locality = locality.locality_id where project_id !=0 and project_status=1";

        if (parameters.project_type != "" && parameters.project_type != undefined) {
            if (parameters.project_type != 0) {
                query += " AND projects.project_type='" + parameters.project_type + "'";
            }
        }
        if (parameters.project_sub_type != "" && parameters.project_sub_type != undefined) {
            query += " AND projects.project_sub_type='" + parameters.project_sub_type + "'";
        }
        if (parameters.city != "" && parameters.city != undefined) {
            query += " AND projects.city='" + parameters.city + "'";
        }
        if (parameters.locality != "" && parameters.locality != undefined) {
            query += " AND projects.locality='" + parameters.locality + "'";
        }
        if (parameters.bedrooms != "" && parameters.bedrooms != undefined) {
            query += " AND FIND_IN_SET('" + parameters.bedrooms + "',projects.plans) > 0";
        }
        if (parameters.posted_by != "" && parameters.posted_by != undefined) {
            query += " AND projects.posted_by='" + parameters.posted_by + "'";
        }
        if (parameters.min_price != "" && parameters.min_price != undefined) {
            query += " AND projects.min_price >='" + parameters.min_price + "'";
        }
        if (parameters.max_price != "" && parameters.max_price != undefined) {
            query += " AND projects.max_price <='" + parameters.max_price + "'";
        }
        if (parameters.search_field != "" && parameters.search_field != undefined) {
            query += " AND (projects.project_name LIKE '%" + parameters.search_field + "%'";
            query += " OR projects.rera_id LIKE '%" + parameters.search_field + "%'";
            query += " OR projects.group_name LIKE '%" + parameters.search_field + "%')";
        }
        query += " ORDER BY datetime DESC ";
        return new Promise(function (resolve, reject) {
            con.query(query, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result[0]});
            });
        });
    },
}