var con = require("../database");
var moment = require("moment");
var dateFormat = "YYYY-MM-DD HH:mm:ss";
module.exports = {
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

    addListProperty: function (name, email, phone, propertyName, propertyType, subType, facing, bedrooms, bathrooms, city, locality, state, carParking, quotedPrice, saleableArea, age, floorNo, floors, description, amenities1, furnishing, postedBy, latitude, longitude, posession, status) {
        var datetime = moment().format(dateFormat);
        var query = "insert into list_property set ?";
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
                resolve({success: true, propertyId: result.insertId});
            });
        });
    },
    updateListProperty: function (data, id) {
        return new Promise(function (resolve, reject) {
            con.query("update list_property set ? where list_property_id='" + id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
            });
        });
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
    },
    addResidentialPlotDetails: function (propertyId, direction, openSlides, width, constructionDone, boundaryWall, gatedColony, forUpdate) {
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
            if (forUpdate) {
                query = "update residential_plot_details set ? where list_property_id='" + propertyId + "'"
            } else {
                dataObject.list_property_id = propertyId,
                    query = "insert into residential_plot_details set ?"
            }
            con.query(query, dataObject, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                } else {
                    resolve({success: true});
                }
            })
        });
    },
    addResidentialPlotToListProperty: function (name, email, phone, propertyName, propertyType, subType, facing, city, locality, state, quotedPrice, plotArea, floors, description, amenities, postedBy, latitude, longitude, posession, status) {
        var datetime = moment().format(dateFormat);
        var query = "update list_property set ? where list_property_id = '" + propertyId + "'";
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
                resolve({success: true, propertyId: result.insertId});
            })
        });

    },
    updateResidentialPlotDetails: function (data, id) {
        return new Promise(function (resolve, reject) {
            con.query("update residential_plot_details set ? where list_property_id='" + id + "'", data, function (error, result) {
                if (error) {
                    console.log(error);
                    resolve({success: false});
                }
                resolve({success: true});
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

}