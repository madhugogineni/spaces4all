var con = require("../database");
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
    }
};