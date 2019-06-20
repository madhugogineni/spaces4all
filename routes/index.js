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
				var uploadImagesResult = await uploadImages(photoFiles, propertyId, "public/uploads/list_property/");
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
				var uploadImagesResult = await uploadImages(photoFiles, propertyId, "public/uploads/list_property/");
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
	crudModel.getRentInDetails().then(function (rentDetails) {
		var responseObj = { page_title: "Rent In", page_name: "Rent In" };
		if (rentDetails.success && rentDetails.data != undefined) {
			var finalPrice = "";
			var rentPrice = rentDetails.data.price;
			if (rentPrice != "") {
				var tempPrice = rentPrice.replace(",", "");
				if (tempPrice > 100000) {
					finalPrice = (parseFloat(tempPrice) / 100000);
					finalPrice = '₹  ' + finalPrice + ' Lac';
				} else {
					finalPrice = '₹  ' + tempPrice;
				}
			} else {
				finalPrice = 'Price On Request';
			}
			if (rentDetails.data.image == "") {
				rentDetails.data.image = "no-photo.jpg";
			}
			rentDetails.data.price = finalPrice;
			responseObj.rentDetails = rentDetails.data;
		}//uploads/list_property/
		console.log(rentDetails.data);
		res.render("home/rent-in", responseObj);
	});
});
router.get("/rent_out", function (req, res) {
	var responseObj = { page_title: "Rent In", page_name: "Rent In" };
	res.render("home/rent-out", responseObj);
});
router.post("/add_rent_out", async function (req, res) {
	console.log(req.body);
	let validator = new validatorpackage(req.body, {
		property_name: 'required',
		property_type: 'required',
		property_sub_type: 'required',
		facing: 'required',
		

	});
	var validationResult = validator.check();
	console.log("validation result = " + validatorResult);

	/*
	
		$this->load->library('form_validation');

			

		$this->form_validation->set_rules('property_name', 'Property Name', 'required');

		$this->form_validation->set_rules('property_type', 'Property Type', 'required');

		$this->form_validation->set_rules('property_sub_type', 'Property Sub Type', 'required');

		$this->form_validation->set_rules('facing', 'Facing', 'required');

                $this->form_validation->set_rules('state', 'State', 'required');

		$this->form_validation->set_rules('city', 'City', 'required');

		$this->form_validation->set_rules('locality', 'Locality', 'required');

		$this->form_validation->set_rules('price', 'Price', 'required');

		$this->form_validation->set_rules('name', 'Username', 'trim|required|min_length[4]|max_length[12]|xss_clean');

		$this->form_validation->set_rules('email', 'Email', 'trim|required|valid_email');

		$this->form_validation->set_rules('phone', 'Phone', 'trim|required|numeric|exact_length[10]');

		$this->form_validation->set_rules('posted_by', 'Posted By', 'required');

	

		if ($this->form_validation->run() == FALSE)

		{

			$this->session->set_flashdata('error',validation_errors());

	

			$this->session->set_flashdata('message1','Please Fill The Details Below !');

				

			if (form_error('property_name')) {

				$this->session->set_flashdata('property_name',form_error('property_name'));

			}

			if (form_error('property_type')) {

				$this->session->set_flashdata('property_type',form_error('property_type'));

			}

			if (form_error('property_sub_type')) {

				$this->session->set_flashdata('property_sub_type',form_error('property_sub_type'));

			}

			if (form_error('facing')) {

				$this->session->set_flashdata('facing',form_error('facing'));

			}

if (form_error('state')) {

				$this->session->set_flashdata('state',form_error('state'));

			}

			if (form_error('city')) {

				$this->session->set_flashdata('city',form_error('city'));

			}

			if (form_error('locality')) {

				$this->session->set_flashdata('locality',form_error('locality'));

			}

			if (form_error('posted_by')) {

				$this->session->set_flashdata('posted_by',form_error('posted_by'));

			}

			if (form_error('name')) {

				$this->session->set_flashdata('name',form_error('name'));

			}

			if (form_error('email')) {

				$this->session->set_flashdata('email',form_error('email'));

			}

			if (form_error('phone')) {

				$this->session->set_flashdata('phone',form_error('phone'));

			}

			if (form_error('price')) {

				$this->session->set_flashdata('price',form_error('price'));

			}

	

			

			$this->session->set_flashdata('name_value',$this->input->post('name'));

			$this->session->set_flashdata('email_value',$this->input->post('email'));

			$this->session->set_flashdata('phone_value',$this->input->post('phone'));

			$this->session->set_flashdata('property_name_value',$this->input->post('property_name'));

			$this->session->set_flashdata('property_value',$this->input->post('property_type'));

			$this->session->set_flashdata('sub_value',$this->input->post('property_sub_type'));

			$this->session->set_flashdata('facing_value',$this->input->post('facing_value'));

			$this->session->set_flashdata('bed_value',$this->input->post('bedrooms'));

			$this->session->set_flashdata('bath_value',$this->input->post('bathrooms'));

			$this->session->set_flashdata('city_value',$this->input->post('city'));

			$this->session->set_flashdata('local_value',$this->input->post('locality'));

			$this->session->set_flashdata('land_value',$this->input->post('land_mark'));

			$this->session->set_flashdata('state_value',$this->input->post('state'));

			$this->session->set_flashdata('price_value',$this->input->post('price'));

			$this->session->set_flashdata('furnishing_value',$this->input->post('furnishing'));

			$this->session->set_flashdata('unit_value',$this->input->post('unit'));

			$this->session->set_flashdata('floors_value',$this->input->post('floors'));

			$this->session->set_flashdata('security_deposit_value',$this->input->post('security_deposit'));

			$this->session->set_flashdata('parking_value',$this->input->post('parking'));

			$this->session->set_flashdata('area_value',$this->input->post('area'));

			$this->session->set_flashdata('maintenance_value',$this->input->post('maintenance'));

			$this->session->set_flashdata('time_value',$this->input->post('avail_time'));

			$this->session->set_flashdata('posted_value',$this->input->post('posted_by'));

			$this->session->set_flashdata('desc_value',$this->input->post('description'));

			

			

			redirect(base_url().'home/rent_out', 'refresh');

	

		}else{

			$property_name	= $this->input->post('property_name');

			$property_type	= $this->input->post('property_type');

			$sub_type		= $this->input->post('property_sub_type');

			$facing			= $this->input->post('facing');

			$city			= $this->input->post('city');

			$locality		= $this->input->post('locality');

			$land_mark		= $this->input->post('land_mark');

			$state			= $this->input->post('state');

			$maintenance	= $this->input->post('maintenance');

			$bedrooms		= $this->input->post('bedrooms');

			$bathrooms		= $this->input->post('bathrooms');

			$price			= $this->input->post('price');

			$furnishing		= $this->input->post('furnishing');

			$unit			= $this->input->post('unit');

			$floors			= $this->input->post('floors');

			$security_deposit = $this->input->post('security_deposit');

			$parking		= $this->input->post('parking');

			$area			= $this->input->post('area');

			$name	 		= $this->input->post('name');

			$phone	 		= $this->input->post('phone');

			$email	 		= $this->input->post('email');

			$avail_time		= $this->input->post('avail_time');

			$water			= $this->input->post('water');

			$electricity	= $this->input->post('electricity');

			$tenents		= $this->input->post('tenents');

			$posted_by		= $this->input->post('posted_by');

			$description	= $this->input->post('description');			

			$photo			= $_FILES['photos']['name'];

			$amenities1		= $this->input->post('amenities1');

			

			if ($amenities1 != null && $amenities1 != ''){

				$amenities		= implode(',', $amenities1);

			}else {

				$amenities		= '';

			}



			if($_FILES['photos']['name'] != null && $_FILES['photos']['name'] != ''){

				$photos		= implode(',', $photo);

			}else {

				$photos		= 'no-photo.jpg';

			}

				

	

			$date 			= date('Y-m-d h:i:s');

	

			$city1 			= $this->crud_model->get_city_by_id($city);

			$locality1 		= $this->crud_model->get_locality_by_id($locality);

				

			foreach ($city1 as $row){

				$city_name  = $row['city'];

			}

			foreach ($locality1 as $row1){

				$local_name = $row1['locality'];

			}

			

			// $Address 	 	= urlencode($local_name,$city_name); 

			$Address 	 	= $local_name.','.$city_name;

			$Address = urlencode($Address);

	                $request_url 	= "https://maps.googleapis.com/maps/api/geocode/json?address=".$Address."&sensor=true&key=AIzaSyB5pJ-mKzfSoERevq1rX5zNFWdhfg2kNcA";
	
	                $resp_json 	= file_get_contents($request_url) or die("url not loading");

	                $resp = json_decode($resp_json,true);

	                $status = $resp["status"];

	                if ($status=="OK") {

		             $latitude   = $resp['results'][0]['geometry']['location']['lat'];

		             $longitude  = $resp['results'][0]['geometry']['location']['lng'];				
	                }

			$data = array(

					'property_name'		=> $property_name,

					'property_type'		=> $property_type,

					'property_sub_type'	=> $sub_type,

					'facing'			=> $facing,

					'city'				=> $city,

					'locality'			=> $locality,

					'land_mark'			=> $land_mark,

					'state'				=> $state,

					'maintenance'		=> $maintenance,

					'bedrooms'			=> $bedrooms,

					'bathrooms'			=> $bathrooms,

					'price'				=> $price,

					'furnishing_status'	=> $furnishing,

					'unit_no'			=> $unit,

					'floors'			=> $floors,

					'parking'			=> $parking,

					'builtup_area'		=> $area,

					'security_deposit'	=> $security_deposit,

					'name' 				=> $name,

					'phone'  			=> $phone,

					'email'    			=> $email,

					'available_time'	=> $avail_time,

					'longitude'    		=> $longitude,

					'latitude'    		=> $latitude,

					'water_availability'=> $water,

					'electricity_status'=> $electricity,

					'tenents_preferred' => $tenents,

					'posted_by'    		=> $posted_by,

					'photos'    		=> $photos,

					'description'    	=> $description,

					'amenities'    		=> $amenities,

					'status'			=> '0',

					'datetime'			=> $date

	

			);

	

			$rent_out = $this->db->insert('rent',$data);

			

			if ($rent_out) {

			

				$number_of_files = sizeof($_FILES['photos']['tmp_name']);

				// considering that do_upload() accepts single files, we will have to do a small hack so that we can upload multiple files. For this we will have to keep the data of uploaded files in a variable, and redo the $_FILE.

				$files = $_FILES['photos'];

				$errors = array();

			

				// first make sure that there is no error in uploading the files

				for($i=0;$i<$number_of_files;$i++)

				{

				if($_FILES['photos']['error'][$i] != 0) $errors[$i][] = 'Couldn\'t upload file '.$_FILES['photos']['name'][$i];

				}

				if(sizeof($errors)==0)

				{

				// now, taking into account that there can be more than one file, for each file we will have to do the upload

					// we first load the upload library

					$this->load->library('upload');

					// next we pass the upload path for the images

					$config['upload_path'] = FCPATH . 'uploads/rent/';

					// also, we make sure we allow only certain type of images

					$config['allowed_types'] = 'gif|jpg|jpeg|JPG|JPEG|PNG|png';

					for ($i = 0; $i < $number_of_files; $i++) {

								$_FILES['photos']['name'] = $files['name'][$i];

										$_FILES['photos']['type'] = $files['type'][$i];

										$_FILES['photos']['tmp_name'] = $files['tmp_name'][$i];

										$_FILES['photos']['error'] = $files['error'][$i];

								$_FILES['photos']['size'] = $files['size'][$i];

								//now we initialize the upload library

								$this->upload->initialize($config);

								// we retrieve the number of files that were uploaded

								if ($this->upload->do_upload('photos'))

								{

								$data['uploads'][$i] = $this->upload->data();

								}

								else

						{


								}

								}

								}

								else

									{

									 	

									}

			

									}

	

	

			$this->session->set_flashdata('message','Thank you for your trust in space4all. Just wait few hours, we are on the job.');

	

			redirect(base_url().'home/rent_out', 'refresh');

		}
	*/
});
router.get("/rent", function (req, res) {
	var propertyType = req.query.property_type || "",
		propertySubType = req.query.property_sub_type || "",
		city = req.query.city || "",
		locality = req.query.locality || "",
		bedrooms = req.query.bedrooms || "",
		postedBy = req.query.posted_by || "",
		minPrice = req.query.min_price | "",
		maxPrice = req.query.max_price || "";

	crudModel.getRentDetails(propertyType, propertySubType, city, locality, bedrooms, postedBy, minPrice, maxPrice).then(function (rentDetails) {
		var rentDetailsData = rentDetails.data;
		for (var i = 0; i < rentDetailsData.length; i++) {
			var rentDetail = rentDetailsData[i];
			if (rentDetail.photos == "") {
				rentDetail.image = "no-photo.jpg";
			} else {
				var images = rentDetail.photos.split(",");
				rentDetail.image = images[images.length - 1];
			}
			if (rentDetail.price) {
				var price = rentDetail.price;
				price = price.replace(",", "");
				if (price > 100000) {
					price = parseFloat(price) / 100000;
					price = price + 'Lac';
					rentDetail.price = price;
				} else {
					rentDetail.price = price;
				}
			} else {
				rentDetail.price = "Price on Request";
			}
			rentDetailsData[i] = rentDetail;
		}
		console.log(rentDetailsData);
		res.render("home/rent", { page_title: "Rent", page_name: "Rent", posted_by: postedBy, rent: rentDetailsData, property_type: propertyType, property_sub_type: propertySubType, city: city, locality: locality, min_price: minPrice, max_price: maxPrice, bedrooms: bedrooms });
	});
});
function writeFile(fileName, fileBuffer, path) {
	return new Promise(function (resolve, reject) {
		fs.appendFile(path + fileName, fileBuffer, function (error) {
			if (error) {
				console.log("file not saved");
				resolve({ success: false });
			} else {
				resolve({ success: true });
			}
		});
	});
}
async function uploadImages(photoFiles, propertyId, path) {
	if (photoFiles.length) {
		var imagesToUpload = [];
		for (var i = 0; i < photoFiles.length; i++) {
			var fileName = propertyId + "|" + photoFiles[i].originalname;
			var uploadResponse = await writeFile(fileName, photoFiles[i].buffer, path);
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