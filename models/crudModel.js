var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
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
    getPropertyType: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_type order by property_type_id DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },

    getPropertyTypeById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select type from property_type where property_type_id=" + id, function (error, result) {
                if (error)
                    console.log({success: false, message: error});
                resolve({success: true, type: result[0].type});
            });
        });
    },
    getPropertySubType: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_sub_type", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPropertySubTypeById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select sub_type from property_sub_type where property_sub_type_id=" + id, function (error, result) {
                if (error)
                    console.log({success: false, message: error});
                resolve({success: true, sub_type: result[0].sub_type});
            })
        });
    },
    getPropertySubTypeByProperty(propertyId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_sub_type where property_type_id=" + propertyId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getProjectType: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_type", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getProjectTypeById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_type where project_type_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            })
        });
    },
    getProjectSubType: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_sub_type", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },

    getProjectSubTypeById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_sub_type where project_sub_type_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },

    getProjectSubTypeByProject: function (projectId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_sub_type where project_type_id=" + projectId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getBanks: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from banks", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getBankById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from banks where bank_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getAmenities: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from amenities", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getAmenitiesById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from amenities where amenity_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getCity: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from city order by city ASC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getCityLimit: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from city order by city_id ASC limit 1", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getCityById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from city where city_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getLocality: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from locality order by locality ASC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getLocalityById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from locality where locality_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getLocalityByCity: function (cityId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from locality where city_id=" + cityId + " order by locality ASC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },

    getStates: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from state", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getStateById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from state where state_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getListProperty: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from list_property order by datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPropertyId: function (name, email, property_type, property_sub_type, city, locality, date) {
        return new Promise(function (resolve, reject) {
            con.query("select list_property_id from list_property where name='" + name + "' and email='" + email + "' and property_type=" + property_type + " and property_sub_type=" + property_sub_type + " and city=" + city + " and locality=" + locality + " and datetime='" + date + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getListPropertyById: function (propertyId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from list_property where list_property_id=" + propertyId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPlotDetails(propertyId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from residential_plot_details where list_property_id=" + propertyId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getListPropertyLatest: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from latest_property order by latest_property_id ASC limit 6", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getLatestPropertyDetails: function () {
        return new Promise(function (resolve, reject) {
            con.query("select list_property.list_property_id as property_id, city.city as city_name,locality.locality as locality_name,property_type.type as property_type," +
                "property_sub_type.sub_type as property_sub_type,list_property.quoted_price as quoted_price,list_property.saleable_area as area," +
                "list_property.bedrooms as bedrooms ,list_property.property_type as property_type_id,list_property.property_sub_type as property_sub_type_id, property_photos.photo as property_photo from latest_property " +
                " inner join list_property on latest_property.list_property_id = list_property.list_property_id " +
                " inner join city on list_property.city = city.city_id " +
                " inner join locality on list_property.locality = locality.locality_id " +
                " inner join property_type on list_property.property_type = property_type.property_type_id " +
                " inner join property_sub_type on list_property.property_sub_type = property_sub_type.property_sub_type_id " +
                " left join property_photos on list_property.list_property_id = property_photos.property_id", function (error, result) {
                if (error) {
                    console.log(error);
                }
                resolve(result);
            });
        });
    },
    getLatestPropertyPhotos: function (propertyIdList) {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_photos where FIND_IN_SET(property_id,'" + propertyIdList + "') > 0", function (error, result) {
                if (error) {
                    console.log(error);
                }
                resolve(result);
            });
        });
    },
    // getPropertyDetailsById: function (id) {
    //     return new Promise(function (resolve, reject) {
    //         con.query("select * from list_property where list_property_id=" + id, function (error, result) {
    //             if (error)
    //                 console.log(error);
    //             resolve(result);
    //         });
    //     });
    // },
    getPropertyPhotosLimit: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_photos where property_id=" + id + " limit 1", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPropertyPhotos: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_photos where property_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPropertyPhotoById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_photos where photo_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPostRequirement: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from post_requirement order by datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPostRequirementCount: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from post_requirement", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result.length);
            });
        });
    },
    getPostRequirementById(postRequirementId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from post_requirement where post_requirement_id=" + postRequirementId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result.length);
            });
        });
    },
    getProperties: function (propertyType, propertySubType, city, locality, bedrooms, postedBy, minPrice, maxPrice, possession) {
        var query = "SELECT * FROM list_property where list_property_id !=0";

        if (propertyType != "") {
            if (propertyType != 0) {
                query += " AND property_type='" + propertyType + "'";
            }
        }
        if (propertySubType != "") {
            query += " AND property_sub_type='" + propertySubType + "'";
        }
        if (city != "") {
            query += " AND city='" + city + "'";
        }
        if (locality != "") {
            query += " AND locality='" + locality + "'";
        }
        if (bedrooms != "") {
            query += " AND bedrooms='" + bedrooms + "'";
        }
        if (postedBy != "") {
            query += " AND posted_by='" + postedBy + "'";
        }
        if (minPrice != "") {
            query += " AND quoted_price >='" + minPrice + "'";
        }
        if (maxPrice != "") {
            query += " AND quoted_price <='" + maxPrice + "'";
        }
        if (possession != "") {
            query += " AND possession ='" + possession + "'";
        }
        query += " AND status='1' ORDER BY datetime DESC ";
        // console.log(query);
        return new Promise(function (resolve, reject) {
            con.query(query, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPropertiesCount: function (propertyType, propertySubType, city, locality, bedrooms, postedBy, minPrice, maxPrice, possession) {
        var query = "SELECT list_property_id FROM list_property where list_property_id !=0";

        if (propertyType != "") {
            if (propertyType != 0) {
                query += " AND property_type='" + propertyType + "'";
            }
        }
        if (propertySubType != "") {
            query += " AND property_sub_type='" + propertySubType + "'";
        }
        if (city != "") {
            query += " AND city='" + city + "'";
        }
        if (locality != "") {
            query += " AND locality='" + locality + "'";
        }
        if (bedrooms != "") {
            query += " AND bedrooms='" + bedrooms + "'";
        }
        if (postedBy != "") {
            query += " AND posted_by='" + postedBy + "'";
        }
        if (minPrice != "") {
            query += " AND quoted_price >='" + minPrice + "'";
        }
        if (maxPrice != "") {
            query += " AND quoted_price <='" + maxPrice + "'";
        }
        if (possession != "") {
            query += " AND possession ='" + possession + "'";
        }
        query += " AND status='1' ORDER BY datetime DESC ";
        // console.log(query);
        return new Promise(function (resolve, reject) {
            con.query(query, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result.length);
            });
        });
    },
    getHotProperties: function (city) {
        return new Promise(function (resolve, reject) {
            con.query("SELECT * FROM list_property where list_property_id !=0 and hot_property='1' and city='" + city + "' ORDER BY datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getHotPropertyDetails: function (city) {
        return new Promise(function (resolve, reject) {
            con.query("SELECT list_property.*,city.city,locality.locality,property_sub_type.sub_type as property_sub_type_name, property_type.type as property_type_name, property_photos.photo as" +
                " property_photo,residential_plot_details.east,residential_plot_details.west,residential_plot_details.north,residential_plot_details.south,residential_plot_details.open_slides FROM list_property inner join city on list_property.city = city.city_id inner join locality on list_property.locality = locality.locality_id inner join property_sub_type on" +
                " list_property.property_sub_type = property_sub_type.property_sub_type_id inner join property_type on list_property.property_type = property_type.property_type_id left join residential_plot_details on list_property.list_property_id =  residential_plot_details.list_property_id left join property_photos" +
                " on list_property.list_property_id = property_photos.property_id where list_property.list_property_id !=0 and hot_property='1' and list_property.city=" + city +
                " ORDER BY datetime DESC;", function (error, result) {
                if (error) {
                    console.log(error);
                }
                resolve(result);
            });
        });
    },
    getSimilarProperties: function (listPropertyId, propertyType, city) {
        return new Promise(function (resolve, reject) {
            console.log("select * from list_property where property_type like '%" + propertyType + "%' and city like '%" + city + "%' and list_property_id !='" + listPropertyId + "' and status='1' order by datetime DESC limit 4");
            con.query("select * from list_property where property_type like '%" + propertyType + "%' and city like '%" + city + "%' and list_property_id !='" + listPropertyId + "' and status='1' order by datetime DESC limit 4", function (error, result) {
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
            con.query("select * from projects where project_id=" + projectId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
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
    getRentAll: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from rent order by datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getRentDetailsById: function (rentId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from rent where rent_id=" + rentId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getRentAdd: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from rent_add", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getRentAddAvailable: function (rentId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from rent_add where rent_id=" + rentId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result.length);
            });
        });
    },
    getProjects: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from projects order by datetime DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false})
                }else {
                    resolve({success: true, data: result});
                }
            });
        });
    },
    getProjectConfigurations: function (projectId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_configurations where project_id='" + projectId + " order by project_id ASC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
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
    getStampDutyById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from stamp_duty where stamp_duty_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getLoanRequests: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from loan_requests order by datetime ASC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getServicesRequests: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from services_requests order by datetime ASC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPopularAgents: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from popular_agents order by datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPopularAgentById: function (agentId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from popular_agents where agent_id=" + agentId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getCallBack: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from call_back order by datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPriceTrends: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from price_trends order by datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPriceTrendById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from price_trends where price_trend_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPropertyEnquiry: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from property_enquiry", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getProjectEnquiry: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_enquiry", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getRentEnquiry: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from rent_enquiry", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getStampDuty: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from stamp_duty order by state ASC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },

    getRent: function (propertyType, propertySubType, city, locality, bedrooms, postedBy, minPrice, maxPrice) {

        var query = "SELECT * FROM rent where rent_id !=0";
        if (propertyType != "") {
            if (propertyType != 0) {
                query += " AND property_type='" + propertyType + "'";
            }
        }
        if (propertySubType != "") {
            query += " AND property_sub_type='" + propertySubType + "'";
        }
        if (city != "") {
            query += " AND city='" + city + "'";
        }
        if (locality != "") {
            query += " AND locality='" + locality + "'";
        }
        if (bedrooms != "") {
            query += " AND bedrooms='" + bedrooms + "'";
        }
        if (postedBy != "") {
            query += " AND posted_by='" + postedBy + "'";
        }
        if (minPrice != "") {
            query += " AND price >='" + minPrice + "'";
        }
        if (maxPrice != "") {
            query += " AND price <='" + maxPrice + "'";
        }

        query += " AND status='1' ORDER BY datetime DESC ";
        console.log(query);
        return new Promise(function (resolve, reject) {
            con.query(query, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getRentCount: function (propertyType, propertySubType, city, bedrooms, postedBy, minPrice, maxPrice) {
        var query = "SELECT * FROM rent where rent_id !=0";
        if (propertyType != "") {
            if (propertyType != 0) {
                query += " AND property_type='" + propertyType + "'";
            }
        }
        if (propertySubType != "") {
            query += " AND property_sub_type='" + propertySubType + "'";
        }
        if (city != "") {
            query += " AND city='" + city + "'";
        }
        if (bedrooms != "") {
            query += " AND bedrooms='" + bedrooms + "'";
        }
        if (postedBy != "") {
            query += " AND posted_by='" + postedBy + "'";
        }
        if (minPrice != "") {
            query += " AND price >='" + minPrice + "'";
        }
        if (maxPrice != "") {
            query += " AND price <='" + maxPrice + "'";
        }

        query += " AND status='1'";
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
    getNews: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from news order by datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getNewsById: function (newsId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from news where news_id='" + newsId, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getNewsLimit: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from news order by datetime DESC limit 10", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getHomeSlide: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from home_slide limit 5", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getHomeSliceById: function (homeSlideId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from home_slide where home_slide_id='" + homeSlideId + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getHomeAds: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from home_ads", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getHomeAdById: function (homeAdId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from home_ads where home_ad_id='" + homeAdId + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },

    getProjectVideos: function (type) {
        return new Promise(function (resolve, reject) {
            con.query("select * from project_videos where type='" + type + "' order by datetime DESC limit 1", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
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
    getTestimonial: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from testimonial order by datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getTestimonialLimit: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from testimonial order by datetime DESC limit 1", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getTestimonialById: function (testimonialId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from testimonial where testimonial_id='" + testimonialId + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getScheduleSiteVisit: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from schedule_site_visit order by datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPartners: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from partners order by partner_id DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getPartnerById: function (partnerId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from partners where partner_id='" + partnerId + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getContact: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from contact order by datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getNewsLetter() {
        return new Promise(function (resolve, reject) {
            con.query("select * from news_letter order by datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getNewsLetterAvailable: function (email) {
        return new Promise(function (resolve, reject) {
            con.query("select * from news_letter where email='" + email + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result.length);
            });
        });
    },
    getFeedback: function () {
        return new Promise(function (resolve, reject) {
            con.query("select * from feedback order by datetime DESC", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
    getFeedbackById: function (feedbackId) {
        return new Promise(function (resolve, reject) {
            con.query("select * from feedback where feedback_id='" + feedbackId + "'", function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
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
    addResidentialPlotToListProperty: function (name, email, phone, propertyName, propertyType, subType, facing, city, locality, state, quotedPrice, plotArea, floors, description, amenities, postedBy, latitude, longitude, posession, status, propertyId) {
        var datetime = moment().format(dateFormat);
        var query = ""
        if (!propertyId) {
            query = "insert into list_property set ?";
        } else {
            query = "update list_property set ? where list_property_id = '" + propertyId + "'";
        }
        return new Promise(function (resolve, reject) {
            con.query(query, {
                name: name,
                email: email,
                phone: phone,
                property_name: propertyName,
                property_type: propertyType,
                property_sub_type: subType,
                facing: facing,
                city: city,
                locality: locality,
                state: state,
                quoted_price: quotedPrice,
                saleable_area: plotArea,
                floors: floors,
                description: description,
                amenities: amenities,
                posted_by: postedBy,
                lat: latitude,
                lan: longitude,
                possession: "",
                status: 0,
            }, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, propertyId: propertyId ? propertyId : result.insertId});
            })
        });

    },

    addResidentialPlotDetails: function (propertyId, direction, openSlides, width, constructionDone, boundaryWall, gatedColony,forUpdate) {
        return new Promise(function (resolve, reject) {
            var query = ''
            var dataObject = {
                east: direction.east,
                west: direction.west,
                north: direction.north,
                south: direction.south,
                open_slides: openSlides,
                width: width,
                construction_done: constructionDone,
                boundary_wall: boundaryWall,
                gated_colony: gatedColony
            }
            if(forUpdate) {
                query = "update residential_plot_details set ? where list_property_id='"+propertyId+"'"
            }else {
                dataObject.list_property_id = propertyId,
                query= "insert into residential_plot_details set ?"
            }
            con.query(query,dataObject, function (error, result) {
                    if (error) {
                        console.log(error);
                        resolve({success: false});
                    } else {
                        resolve({success: true});
                    }
                })
        });
    },
    addPropertyPhotos: function (files) {
        console.log(files);
        return new Promise(function (resolve, reject) {
            con.query("insert into property_photos(property_id,photo,datetime) values ?", [files], function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                } else {
                    resolve({success: true});
                }
            });
        });
    },
    addListProperty: function (name, email, phone, propertyName, propertyType, subType, facing, bedrooms, bathrooms, city, locality, state, carParking, quotedPrice, saleableArea, age, floorNo, floors, description, amenities1, furnishing, postedBy, latitude, longitude, posession, status,propertyId) {
        var datetime = moment().format(dateFormat);
        var query = ""
        if (!propertyId) {
            query = "insert into list_property set ?";
        } else {
            query = "update list_property set ? where list_property_id = '" + propertyId + "'";
        }
        return new Promise(function (resolve, reject) {
            con.query(query, {
                name: name,
                email: email,
                phone: phone,
                property_name: propertyName,
                property_type: propertyType,
                property_sub_type: subType,
                facing: facing,
                bedrooms: bedrooms,
                bathrooms: bathrooms,
                city: city,
                locality: locality,
                state: state,
                car_parking: carParking,
                quoted_price: quotedPrice,
                saleable_area: saleableArea,
                construction_age: age,
                floor_no: floorNo,
                floors: floors,
                description: description,
                amenities: amenities1,
                furnishing_status: furnishing,
                posted_by: postedBy,
                lat: latitude,
                lan: longitude,
                possession: posession,
                status: status,
                datetime: datetime,
            }, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, propertyId: propertyId ? propertyId : result.insertId});
            });
        });
    },
    getRentInDetails: function () {
        return new Promise(function (resolve, reject) {
            con.query("select locality.locality as locality_name, city.city as city_name,property_type.property_type_id as property_type,rent.property_sub_type as property_sub_type,property_sub_type.sub_type as property_sub_type_name," +
                "rent.property_name,rent.rent_id as rent_id,rent.price as price,rent.bedrooms as bedrooms,rent.photos as image,rent.builtup_area as builtup_area from rent_add inner join rent on rent_add.rent_id = rent.rent_id inner join " +
                "property_type on rent.property_type = property_type.property_type_id inner join property_sub_type on rent.property_sub_type = property_sub_type.property_sub_type_id inner join city on rent.city = city.city_id inner join " +
                "locality on rent.locality = locality.locality_id", function (error, result) {
                if (error) {
                    resolve({success: false});
                } else {
                    resolve({success: true, data: result[0]});
                }
            });
        });
    },
    getRentDetails: function (propertyType, propertySubType, city, locality, bedrooms, postedBy, minPrice, maxPrice) {
        return new Promise(function (resolve, reject) {

            var query = "SELECT rent.*,property_type.type as property_type_name,property_sub_type.sub_type as property_sub_type_name, city.city as city_name, locality.locality as locality_name from rent inner join property_type on " +
                "rent.property_type = property_type.property_type_id inner join property_sub_type on rent.property_sub_type = property_sub_type.property_sub_type_id inner join city on rent.city = city.city_id inner join " +
                "locality on rent.locality = locality.locality_id where rent_id !=0";
            if (propertyType != "") {
                if (propertyType != 0) {
                    query += " AND rent.property_type='" + propertyType + "'";
                }
            }
            if (propertySubType != "") {
                query += " AND rent.property_sub_type='" + propertySubType + "'";
            }
            if (city != "") {
                query += " AND rent.city='" + city + "'";
            }
            if (locality != "") {
                query += " AND rent.locality='" + locality + "'";
            }
            if (bedrooms != "") {
                query += " AND rent.bedrooms='" + bedrooms + "'";
            }
            if (postedBy != "") {
                query += " AND rent.posted_by='" + postedBy + "'";
            }
            if (minPrice != "") {
                query += " AND rent.price >='" + minPrice + "'";
            }
            if (maxPrice != "") {
                query += " AND rent.price <='" + maxPrice + "'";
            }

            query += " AND rent.status='1' ORDER BY datetime DESC ";
            // console.log(query);
            con.query(query, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                } else {
                    resolve({success: true, data: result})
                }
            });
        });
    },
    insertToRent: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into rent set ?", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false, message: error});
                }
                resolve({success: true, propertyId: result.insertId})
            });
        });
    },
    updatePhotosInRentField: function (photos, propertyId) {
        return new Promise(function (resolve, reject) {
            con.query("update rent set photos = '" + photos + "' where rent_id = '" + propertyId + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false, message: error});
                } else {
                    resolve({success: true});
                }
            });
        });
    },
    postRequirement: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into post_requirement set ?", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false, message: error});
                } else {
                    resolve({success: true});
                }
            });
        });
    },

    getPropertyDetailsById: function (propertyId) {
        return new Promise(function (resolve, reject) {
            con.query("SELECT list_property.*,state.state_name as state_name, city.city as city_name, locality.locality as locality_name, residential_plot_details.east, " +
                "residential_plot_details.west, residential_plot_details.north, residential_plot_details.south, residential_plot_details.open_slides," +
                "residential_plot_details.width, residential_plot_details.construction_done, residential_plot_details.boundary_wall, " +
                "residential_plot_details.gated_colony, property_photos.photo , property_type.type as property_type_name, " +
                "property_sub_type.sub_type as property_sub_type_name  FROM list_property left join state as state on list_property.state = state.state_id " +
                " inner join city on list_property.city = city.city_id " +
                "inner join locality on list_property.locality = locality.locality_id left join residential_plot_details on " +
                "list_property.list_property_id = residential_plot_details.list_property_id left join property_photos on " +
                "list_property.list_property_id = property_photos.property_id  inner join property_type on " +
                "list_property.property_type = property_type.property_type_id inner join property_sub_type on " +
                "list_property.property_sub_type = property_sub_type.property_sub_type_id WHERE list_property.list_property_id = " + propertyId, function (error, result) {
                if (error) {
                    resolve({success: false, message: error});
                } else {
                    if (result.length > 0) {
                        resolve({success: true, data: result[0]});
                    } else {
                        resolve({success: false, message: "No Data"});
                    }
                }
            });
        });
    },
    getPropertyDetails: function (propertyId) {
        return new Promise(function (resolve, reject) {
            con.query("SELECT list_property.*,state.state_name as state_name, city.city as city_name, locality.locality as locality_name, residential_plot_details.east, " +
                "residential_plot_details.west, residential_plot_details.north, residential_plot_details.south, residential_plot_details.open_slides," +
                "residential_plot_details.width, residential_plot_details.construction_done, residential_plot_details.boundary_wall, " +
                "residential_plot_details.gated_colony, property_photos.photo , property_type.type as property_type_name, " +
                "property_sub_type.sub_type as property_sub_type_name  FROM list_property left join state as state on list_property.state = state.state_id " +
                " inner join city on list_property.city = city.city_id " +
                "inner join locality on list_property.locality = locality.locality_id left join residential_plot_details on " +
                "list_property.list_property_id = residential_plot_details.list_property_id left join property_photos on " +
                "list_property.list_property_id = property_photos.property_id  inner join property_type on " +
                "list_property.property_type = property_type.property_type_id inner join property_sub_type on " +
                "list_property.property_sub_type = property_sub_type.property_sub_type_id", function (error, result) {
                if (error) {
                    resolve({success: false, message: error});
                } else {
                    if (result.length > 0) {
                        resolve({success: true, data: result});
                    } else {
                        resolve({success: false, message: "No Data"});
                    }
                }
            });
        });
    },

    getAmenityNames: function (amenitiesList) {
        return new Promise(function (resolve, reject) {
            if (amenitiesList) {
                con.query("SELECT amenity,amenity_icon FROM `amenities` WHERE amenity_id IN (" + amenitiesList + ")", function (error, result) {
                    if (error) {
                        console.log(error);
                        resolve({success: false, message: error});
                    } else {
                        resolve({success: true, data: result});
                    }
                })
            } else {
                resolve({success: true, data: []});
            }

        })
    },
    updateColumnInListProperty: function (column, value, propertyId) {
        return new Promise(function (resolve, reject) {
            console.log("update list_property set " + column + " = " + value + " where list_property_id = " + propertyId)
            con.query('update list_property set ' + column + ' = ' + value + ' where list_property_id = ' + propertyId, function (error, result) {
                if (error) {
                    resolve({success: false});
                } else {
                    resolve({success: true})
                }
            });
        })
    },
    insertPropertyEnquiry: function (data) {
        return new Promise(function (resolve, reject) {
            con.query("insert into property_enquiry set ?", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false, message: error});
                } else {
                    resolve({success: true, data: result});
                }
            });
        })
    },
    deleteProperty(propertyId) {
        return new Promise(function (resolve, reject) {
            console.log('delete from list_property where list_property_id=' + propertyId)
            con.query('delete from list_property where list_property_id=' + propertyId, function (error, result) {
                if (error) {
                    console.log(error)
                } else {
                    resolve({success: true, message: error});
                }
            })
        });
    }
};