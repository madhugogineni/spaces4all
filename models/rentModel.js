var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
    getRentAll: function () {
        return new Promise(function (resolve, reject) {
            con.query("SELECT rent.*,property_type.type as property_type_name, property_sub_type.sub_type as " +
                "property_sub_type_name, city.city as city_name, rent_add.add_id FROM `rent` as rent inner join " +
                "property_type as property_type on rent.property_type = property_type.property_type_id inner join " +
                "property_sub_type on rent.property_sub_type = property_sub_type.property_sub_type_id inner join " +
                "city as city on rent.city = city.city_id left join rent_add as rent_add on rent.rent_id = " +
                "rent_add.rent_id order by datetime DESC", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                } else {
                    resolve({success: true, data: result});
                }
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
    addRentToAdd: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("insert into rent_add set ?", {
                    rent_id: id,
                    datetime: moment().format(dateFormat)
                },
                function (error, result) {
                    if (error) {
                        console.log(error);
                        resolve({success: false});
                    }
                    resolve({success: true});
                }
            )
            ;
        })
    },
    deleteFromRentToAdd: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from rent_add where rent_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        })
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
    getRent: function (propertyType, propertySubType, city, locality, bedrooms, postedBy, minPrice, maxPrice) {

        var query = "SELECT * FROM rent where rent_id !=0";
        if (propertyType) {
            if (propertyType != 0) {
                query += " AND property_type='" + propertyType + "'";
            }
        }
        if (propertySubType) {
            query += " AND property_sub_type='" + propertySubType + "'";
        }
        if (city) {
            query += " AND city='" + city + "'";
        }
        if (locality) {
            query += " AND locality='" + locality + "'";
        }
        if (bedrooms) {
            query += " AND bedrooms='" + bedrooms + "'";
        }
        if (postedBy) {
            query += " AND posted_by='" + postedBy + "'";
        }
        if (minPrice) {
            query += " AND price >='" + minPrice + "'";
        }
        if (maxPrice) {
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
    getRentDetailsById: function (id) {
        return new Promise(function (resolve, reject) {

            var query = "SELECT rent.*,property_type.type as property_type_name,property_sub_type.sub_type as property_sub_type_name, city.city as city_name, locality.locality as locality_name from rent inner join property_type on " +
                "rent.property_type = property_type.property_type_id inner join property_sub_type on rent.property_sub_type = property_sub_type.property_sub_type_id inner join city on rent.city = city.city_id inner join " +
                "locality on rent.locality = locality.locality_id where rent_id ='" + id + "'";
            // console.log(query);
            con.query(query, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                } else {
                    resolve({success: true, data: result[0]});
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
    updateRent: function (data,rentId) {
        return new Promise(function (resolve, reject) {
            con.query("update rent set ? where rent_id='" + rentId + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        });
    },
    deleteRent: function (id) {
        return new Promise(function (resolve, reject) {
            con.query("delete from rent where rent_id='" + id + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
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
}