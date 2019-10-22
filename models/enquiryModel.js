var con = require("../database");
module.exports = {
    getPropertyEnquiry: function () {
        return new Promise(function (resolve, reject) {
            con.query("SELECT property_enquiry.*,list_property.property_name, locality.locality as " +
                "locality_name, city.city as city_name, property_sub_type.sub_type as property_sub_type FROM " +
                "property_enquiry inner join list_property on property_enquiry.property_id = " +
                "list_property.list_property_id inner join city on list_property.city = city.city_id inner " +
                "join locality on list_property.locality = locality.locality_id inner join property_sub_type on " +
                "list_property.property_sub_type = property_sub_type.property_sub_type_id", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getProjectEnquiry: function () {
        return new Promise(function (resolve, reject) {
            con.query("SELECT project_enquiry.*,projects.project_name, locality.locality as locality_name, " +
                "city.city as city_name, project_sub_type.sub_type as project_sub_type FROM project_enquiry inner " +
                "join projects on project_enquiry.project_id = projects.project_id inner join city on projects.city " +
                "= city.city_id inner join locality on projects.locality = locality.locality_id inner join " +
                "project_sub_type on projects.project_sub_type = project_sub_type.project_sub_type_id", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    getRentEnquiry: function () {
        return new Promise(function (resolve, reject) {
            con.query("SELECT rent_enquiry.*,rent.property_name, locality.locality as locality_name, city.city " +
                "as city_name, property_sub_type.sub_type as property_sub_type FROM rent_enquiry inner join rent on " +
                "rent_enquiry.rent_id = rent.rent_id inner join city on rent.city = city.city_id inner join locality " +
                "on rent.locality = locality.locality_id inner join property_sub_type on rent.property_sub_type = " +
                "property_sub_type.property_sub_type_id", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    deletePropertyEnquiry(id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from property_enquiry where enquiry_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    deleteProjectEnquiry(id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from project_enquiry where enquiry_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    },
    deleteRentEnquiry(id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from rent_enquiry where enquiry_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
            });
        });
    }
}