var express = require('express');
var router = express.Router();
var crudModel = require("../models/crudModel");
var validatorpackage = require('node-input-validator');
var addContactMessage = "", isError = 0;
var loanErrorMsg = "", loanError = false;

router.get("/index", function (req, res) {
	res.redirect("/");
});
router.get("/", function (req,res) {
	res.redirect("/");
});
// footer news letter api url are defined here
router.post("/add_news_letter", function (req, res) {
	crudModel.getNewsLetterAvailable(req.body.email).then(function (response) {
		if (response == 0) {
			crudModel.insertNewLetterSubscriber(req.body.email).then(function (response) {
				console.log(response);
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
				console.log(response);
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
module.exports = router;