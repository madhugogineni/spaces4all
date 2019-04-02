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
                    console.log(error);
                resolve(result);
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
            con.query("select * from property_sub_type where property_sub_type_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
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
    getPropertyDetailsById: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("select * from list_property where list_property_id=" + id, function (error, result) {
                if (error)
                    console.log(error);
                resolve(result);
            });
        });
    },
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
                if (error)
                    console.log(error);
                resolve(result);
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
    getProjectsSearchCount: function (projectType, projectSubType, city, locality, bedrooms, postedBy, minPrice, maxPrice, searchType) {
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
        console.log("insert into contact(name,email,phone,message,datetime) values('" + name + "','" + email + "'," + phone + ",'" + message + "','" + datetime + "')");
        return new Promise(function (resolve, reject) {
            con.query("insert into contact(name,email,phone,message,datetime) values('" + name + "','" + email + "'," + phone + ",'" + message + "','" + datetime + "')", function (error, result) {
                if (error) {
                    console.log(error);
                } else {
                    con.query("select * from contact where contact_id=" + result.insertId, function (error1, result1) {
                        if (error1) {
                            console.log(error1);
                        } else {
                            resolve(result1);
                        }
                    });
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
                } else {
                    con.query("select * from news_letter where news_letter_id=" + result.insertId, function (error1, result1) {
                        if (error1) {
                            console.log(error1);
                        } else {
                            resolve(result1);
                        }
                    });
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
    }
};