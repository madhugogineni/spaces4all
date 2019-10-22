var con = require("../database");
module.exports = {
    getPostRequirements: function () {
        return new Promise(function (resolve, reject) {
            con.query("SELECT post_requirement.*,property_type.type as property_type_name,property_sub_type.sub_type " +
                "as property_sub_type_name, city.city as city_name FROM  post_requirement inner join property_type " +
                "on post_requirement.property_type = property_type.property_type_id inner join property_sub_type on " +
                "post_requirement.property_sub_type = property_sub_type.property_sub_type_id inner join city on " +
                "post_requirement.city = city.city_id order by datetime DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result});
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
            con.query("SELECT post_requirement.*,property_type.type as property_type_name,property_sub_type.sub_type " +
                "as property_sub_type_name, city.city as city_name,locality.locality as locality_name FROM  post_requirement inner join property_type " +
                "on post_requirement.property_type = property_type.property_type_id inner join property_sub_type on " +
                "post_requirement.property_sub_type = property_sub_type.property_sub_type_id inner join city on " +
                "post_requirement.city = city.city_id inner join locality on post_requirement.locality = locality.locality_id where post_requirement_id=" + postRequirementId, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true, data: result[0]});
            });
        });
    },
    addPostRequirement: function (data) {
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
    deletePostRequirement: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from post_requirement where post_requirement_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            })
        });
    }
}