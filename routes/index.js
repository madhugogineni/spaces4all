var express = require('express');
var router = express.Router();
var crudModel = require("../models/crudModel");
var validatorpackage = require('node-input-validator');
var multer = require('multer');
var fs = require('fs');
// var storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, 'uploads/')
// 	},
// 	filename: function (req, file, cb) {
// 		cb(null, file.originalname)
// 	}
// });
var upload = multer();//{ storage: storage }
var moment = require("moment");
var nodeGeocoder = require("node-geocoder");
var geocoderoptions = require("../external-config/geocoding-config");
var geocoder = nodeGeocoder(geocoderoptions);
var dateFormat = "YYYY-MM-DD HH:mm:ss";


var addContactMessage = "", isError = 0;
var loanErrorMsg = "", loanError = false;
router.get("/index", function (req, res) {
	res.redirect("/");
});
router.get("/", function (req, res) {
	res.redirect("/");
});
// footer news letter api url are defined here
router.post("/add_news_letter", function (req, res) {
	crudModel.getNewsLetterAvailable(req.body.email).then(function (response) {
		if (response == 0) {
			crudModel.insertNewLetterSubscriber(req.body.email).then(function (response) {
				// console.log(response);
			});
		}
	});
});
// contacts page and related links are defined here
router.get("/contact", function (req, res) {
	res.render('home/contactus', { page_name: "contact", page_title: "Contact", errorMsg: addContactMessage, isError: isError });
	addContactMessage = "";
	isError = 0;
});
router.post("/add_contact", function (req, res) {
	let validator = new validatorpackage(req.body, {
		name: 'required|minLength:3',
		email: 'required|email',
		phone: 'required|numeric|maxLength:12|minLength:10',
		message: 'required|minLength:10'
	});

	validator.check().then(function (matched) {
		if (matched) {
			addContactMessage = "Thank you for the details. We have the pleasure to contact you soon.";
			isError = 0;
			crudModel.insertContact(req.body.name, req.body.email, req.body.phone, req.body.message).then(function (response) {
				// console.log(response);
			});
			res.redirect('contact');
		} else {
			var errorMsg = "";
			Object.keys(validator.errors).map(function (key) {
				errorMsg += validator.errors[key].message + "<br/>";
			});
			addContactMessage = errorMsg;
			isError = 1;
			res.redirect('contact');
		}
	});
});

//Info Tab links are defined here
router.get("/information", function (req, res) {
	res.render('home/information', { page_name: "information", page_title: "Information" });
});
router.get("/glossarys", function (req, res) {
	res.render('home/glossarys', { page_name: "glossarys", page_title: "glossarys" });
});
router.get("/faqs", function (req, res) {
	res.render('home/faqs', { page_name: "faqs", page_title: "faqs" });
});
router.get("/area_conversion_calculator", function (req, res) {
	res.render('home/area_conversion_calculator', { page_name: "Area Conversion Calculator", page_title: "Area Conversion Table" });
});
router.get("/stamp_duty_calculator", function (req, res) {
	crudModel.getStampDuty().then(function (response) {
		res.render("home/stamp_duty_calculator", { page_name: "Stamp Duty Calculator", page_title: "Stamp Duty Calculator", stamp_duty: response });
	});
});

//Mortagage Tab links are defined here
router.get("/emi_calculator", function (req, res) {
	res.render("home/emi_calculator", { page_name: "EMI Calculator", page_title: "EMI Calculator" })
});
router.get("/loan_eligibility_check", function (req, res) {
	res.render("home/loan_eligibility_check", { page_name: "Loan Eligibility Check", page_title: "Loan Eligibility Check" });
});
router.get("/apply_home_loan", function (req, res) {
	crudModel.getBanks().then(function (response) {
		res.render("home/apply_home_loan", { page_name: "Apply Home Loan", page_title: "Apply Home Loan", banks: response, loanErrorMsg: loanErrorMsg, loanError: loanError });
		loanError = false;
		loanErrorMsg = "";
	});
});
router.post("/add_home_loan", function (req, res) {
	var data = req.body;
	crudModel.insertLoanRequest(data.purpose, data.bank, data.loan_amount, data.annual_income, data.name, data.mobile, data.email, data.dob, data.city).then(function (response) {
		if (response.success) {
			loanError = false;
			loanErrorMsg = "Thank you for your trust in spaces4all. Please wait for our call for more.";
		} else {
			loanError = true;
			loanErrorMsg = "Sorry for the inconvenience. Try again later."
		}
		res.redirect('apply_home_loan');
	});
});
router.get("/req_docs_forloan", function (req, res) {
	res.render("home/req_docs_forloan", { page_name: "Apply Home Loan", page_title: "Apply Home Loan" });
});
router.get("/hot_properties/:cityId", function (req, res) {
	var cityId = req.params.cityId || "";
	crudModel.getHotPropertyDetails(cityId).then(function (hotProperties) {
		var finalHotProperties = [];
		var propertyIds = [];
		for (var i = 0; i < hotProperties.length; i++) {
			var hotProperty = hotProperties[i];
			if (!propertyIds.includes(hotProperty.list_property_id)) {
				propertyIds.push(hotProperty.list_property_id);
				if (hotProperty.property_photo == null) {
					hotProperty.property_photo = "no-photo.jpg";
				}
				if (hotProperty.quoted_price != "") {
					var price = hotProperty.quoted_price.replace(',', '');
					var price1;
					if (price > 10000000) {
						price1 = Math.round((parseFloat(price)) / 10000000, 2);
						price1 = price1 + ' Crore';
					}
					else if (price > 100000) {
						price1 = Math.round((parseFloat(price)) / 100000, 2);
						if (price1 == '100') {
							price1 = '1 Crore';
						} else {
							price1 = price1 + ' Lac';
						}
					}
				} else {
					price1 = 'Price On Request';
				}
				hotProperty.quoted_price = price1;
				finalHotProperties.push(hotProperty);
			}
		}
		// console.log(finalHotProperties);
		res.render("home/hot_properties", { page_name: "properties", page_title: "Hot Properties", hot_properties: finalHotProperties, city_id: cityId });
	});
});
router.post("/hot_properties", function (req, res) {
	var cityId = req.body.city;
	if (cityId != "" && cityId != undefined)
		res.redirect("hot_properties/" + cityId);
	else
		res.redirect("/");
});
router.get("/exclusive_projects/:cityId", function (req, res) {
	var cityId = req.params.cityId || "";
	crudModel.getExclusiveProjectDetails(cityId).then(function (exclusiveProjects) {
		var finalExclusiveProjects = [];
		var projectIds = [];
		for (var i = 0; i < exclusiveProjects.length; i++) {
			var exclusiveProject = exclusiveProjects[i];
			if (!projectIds.includes(exclusiveProject.project_id)) {
				projectIds.push(exclusiveProject.project_id);
				if (exclusiveProject.project_photo == null) {
					exclusiveProject.project_photo = "no-photo.jpg";
				}
				var plans = exclusiveProject.plans;
				var plansString = "", finalMinPrice;
				if (plans != null && plans != '') {
					var plansArray = plans.split(',');
					for (var i = 0; i < plansArray.length; i++) {
						plansString += plansArray[i] + ' BHK';
						if (i != (plansArray.length - 1)) {
							plansString += ", ";
						}
					}
					// console.log("plans String = ", plansString);
				} else {
					plansString = '';
				}
				exclusiveProject.plans = plansString;
				if (exclusiveProject.min_price != "") {
					var price = exclusiveProject.min_price.replace(',', '');
					var price1;
					if (price > 10000000) {
						price1 = Math.round((parseFloat(price)) / 10000000, 2);
						price1 = price1 + ' Crore';
					}
					else if (price > 100000) {
						price1 = Math.round((parseFloat(price)) / 100000, 2);
						if (price1 == '100') {
							price1 = '1 Crore';
						} else {
							price1 = price1 + ' Lac';
						}
					}
				} else {
					price1 = 'Price On Request';
				}
				exclusiveProject.price = price1;

				finalExclusiveProjects.push(exclusiveProject);
			}
		}
		// console.log(finalExclusiveProjects);
		res.render("home/exclusive-projects", { page_name: "Exclusive Projects", page_title: "Exclusive Projects", exclusive_projects: finalExclusiveProjects, city_id: cityId });
	});
});
router.post("/exclusive_projects", function (req, res) {
	var cityId = req.body.city;
	if (cityId != "" && cityId != undefined)
		res.redirect("exclusive_projects/" + cityId);
	else
		res.redirect("/");
});

router.get("/list_property", function (req, res) {
	res.render("home/list-property", { page_name: "List Property", page_title: "List Property" });
});
// router.post("/list_property", function (req, res) {

// 	var obj = { page_name: "List Property", page_title: "List Property" };
// 	if (validationError) {
// 		obj.error = validationError;
// 	}
// 	console.log(obj);
// 	res.render("home/list-property", obj);
// 	delete validationError;
// });
router.post("/add_list_property", upload.fields([{ name: 'photos[]', maxCount: 10 }, { name: 'photos1[]', maxCount: 10 }]), async function (req, res) {
	// console.log(req.body);
	if (req.body.property_sub_type == 14 || req.body.property_sub_type == 18) {
		var name = req.body.name || "",
			email = req.body.email || "",
			phone = req.body.phone || "",
			propertyName = req.body.property_name || "",
			propertyType = req.body.property_type || "",
			subType = req.body.property_sub_type || "",
			facing = req.body.facing1 || "",
			city = req.body.city1 || "",
			locality = req.body.locality1 || "",
			state = req.body.state1 || 1,
			quotedPrice = req.body.quoted_price1 || "",
			plotArea = req.body.plot_area || "",
			east = req.body.east || "",
			west = req.body.west || "",
			north = req.body.north || "",
			south = req.body.south || "",
			floors = req.body.floors1 || "",
			openSlides = req.body.open_slides || "",
			width = req.body.width || "",
			constructionDone = req.body.construction_done || "",
			boundaryWall = req.body.boundary_wall || "",
			gatedColony = req.body.gated_colony || "",
			description = req.body.description1 || "",
			amenities = req.body.amenities1 || "",
			postedBy = req.body.posted_by || "Owner";
		let validator = new validatorpackage(req.body, {
			facing1: 'required|alpha',
			plot_area: "numeric",
			quoted_price1: "numeric",
			width: "numeric",
			east: "numeric",
			west: "numeric",
			north: "numeric",
			south: "numeric"
		});
		var validatorResult = await validator.check()

		if (!validatorResult) {
			var validationError = validator.errors;
			var errorMsg = "";
			for (var keys in validationError) {
				errorMsg += validationError[keys].message + "<br/>";
			}
			res.send({ success: false, message: errorMsg });
		} else {
			var date = moment().format(dateFormat);
			var city1 = await crudModel.getCityById(city);
			var cityName = city1[0].city;
			var locality1 = await crudModel.getLocalityById(locality);
			var localityName = locality1[0].locality;
			var address = localityName + ',' + cityName;
			var geocoderResponse = await geocoder.geocode(address, function (err, res) {
				return res;
			});
			var latitude = geocoderResponse[0].latitude, longitude = geocoderResponse[0].longitude;
			var queryResult = await crudModel.addResidentialPlotToListProperty(name, email, phone, propertyName, propertyType, subType, facing, city, locality, state, quotedPrice, plotArea, floors, description, amenities, postedBy, latitude, longitude, '', 0);
			if (queryResult.success) {
				var propertyId = queryResult.propertyId;
				await crudModel.addResidentialPlotDetails(queryResult.propertyId, { north: north, south: south, east: east, west: west }, openSlides, width, constructionDone, boundaryWall, gatedColony);
				var photoFiles = req.files["photos1[]"] || [];
				var uploadImagesResult = await uploadImages(photoFiles, propertyId);
				if (uploadImagesResult) {
					res.send({ success: true, message: "Thank you for your trust in space4all. Just wait few hours, we are on the job. !" });
				} else {
					res.send({ success: false, message: "Your Property Listing Has Failed ! Please Try Again." });
					// removeProperty(propertyId, "14");
				}
			} else {
				res.send({ success: false, message: "Your Property Listing Has Failed ! Please Try Again." });
			}
		}
	} else {
		let validator = new validatorpackage(req.body, {
			name: 'required|minLength:3',
			email: 'required|email',
			phone: 'required|numeric|digits:10',
			property_name: 'required',
			property_type: 'required',
			property_sub_type: 'required',
			facing: 'required|alpha',
			city: 'required',
			locality: 'required',
			saleable_area: 'required|numeric',
			posted_by: 'required'
		});
		var validatorResult = await validator.check();

		if (!validatorResult) {

			var validationError = validator.errors;
			var errorMsg = "";
			for (var keys in validationError) {
				errorMsg += validationError[keys].message + "<br/>";
			}
			res.send({ success: false, message: errorMsg });
		} else {

			var name = req.body.name || "";
			var email = req.body.email || "";
			var phone = req.body.phone || "";
			var propertyName = req.body.property_name || "";
			var propertyType = req.body.property_type || "";
			var subType = req.body.property_sub_type || "";
			var facing = req.body.facing || "";
			var bedrooms = req.body.bedrooms || "";
			var bathrooms = req.body.bathrooms || "";
			var city = req.body.city || "";
			var locality = req.body.locality || "";
			var state = req.body.state || 1;
			var carParking = req.body.car_parking || "";
			var quotedPrice = req.body.quoted_price || "";
			var saleableArea = req.body.saleable_area || "";
			var age = req.body.construction_age || "";
			var floorNo = req.body.floor_no || "";
			var floors = req.body.floors || "";
			var description = req.body.description || "";
			var amenities1 = req.body.amenities1 || [];
			var furnishing = req.body.furnishing || "";
			var postedBy = req.body.posted_by || "Owner";
			var amenities = "";
			for (var i = 0; i < amenities1.length; i++) {
				amenities += amenities1[i];
				if (i != (amenities1.length - 1)) {
					amenities += ",";
				}
			}
			var date = moment().format(dateFormat);
			var city1 = await crudModel.getCityById(city);
			var cityName = city1[0].city;
			var locality1 = await crudModel.getLocalityById(locality);
			var localityName = locality1[0].locality;
			var address = localityName + ',' + cityName;
			var geocoderResponse = await geocoder.geocode(address, function (err, res) {
				return res;
			});
			var latitude = geocoderResponse[0].latitude, longitude = geocoderResponse[0].longitude;
			var queryResult = await crudModel.addListProperty(name, email, phone, propertyName, propertyType, subType, facing, bedrooms, bathrooms, city, locality, state, carParking, quotedPrice, saleableArea, age, floorNo, floors, description, amenities, furnishing, postedBy, latitude, longitude, "", 0);
			if (queryResult.success) {
				var propertyId = queryResult.propertyId;
				var photoFiles = req.files["photos[]"] || [];
				var uploadImagesResult = await uploadImages(photoFiles, propertyId);
				if (uploadImagesResult) {
					res.send({ success: true, message: "Thank you for your trust in space4all. Just wait few hours, we are on the job. !" });
				} else {
					res.send({ success: false, message: "Your Property Listing Has Failed ! Please Try Again." });
					// removeProperty(propertyId, "");
				}
			} else {
				res.send({ success: false, message: "Your Property Listing Has Failed ! Please Try Again." });
			}
		}
	}
});
router.get("/rent_in", function (req, res) {
	crudModel.getRentAdd().then(function (rentDetails) {
		res.render("home/rent-in", { page_title: "Rent In", page_name: "Rent In", rent: rentDetails });
	});
	// 	$data['page_name']  = 'rent_in';
	// 	$data['page_title'] = 'Rent In';
	//     $data['rent'] = $this->crud_model->get_rent_add();
	// 	$this->load->view('rent-in',$data);
});
function writeFile(fileName, fileBuffer) {
	return new Promise(function (resolve, reject) {
		fs.appendFile("uploads/" + fileName, fileBuffer, function (error) {
			if (error) {
				console.log("file not saved");
				resolve({ success: false });
			} else {
				resolve({ success: true });
			}
		});
	});
}
async function uploadImages(photoFiles, propertyId) {
	if (photoFiles.length) {
		var imagesToUpload = [];
		for (var i = 0; i < photoFiles.length; i++) {
			var fileName = propertyId + "|" + photoFiles[i].originalname;
			var uploadResponse = await writeFile(fileName, photoFiles[i].buffer);
			if (uploadResponse.success) {
				var photoFile = [propertyId, fileName, moment().format(dateFormat)];
				imagesToUpload.push(photoFile);
			}
		}
		var response = await crudModel.addPropertyPhotos(imagesToUpload);
		if (response.success) {
			return true;
		} else {
			return false;
		}
	}
}
module.exports = router;