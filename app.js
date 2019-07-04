var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var crudModel = require('./models/crudModel');
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var apiRouter = require('./routes/apis');

var app = express();
app.use(session({secret: 'sekhar gogineni'}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get("/", function (req, res) {
  crudModel.getLatestPropertyDetails().then(function (latestPropertyDetails) {
    var finalLatestProperties = [];
    var propertyIds = [];
    for (var i = 0; i < latestPropertyDetails.length; i++) {
      var latestProperty = latestPropertyDetails[i];
      if (!propertyIds.includes(latestProperty.property_id)) {
        propertyIds.push(latestProperty.property_id);
        if (latestProperty.property_photo == null) {
          latestProperty.property_photo = "no-photo.jpg";
        }
        if (latestProperty.quoted_price != "") {
          var price = latestProperty.quoted_price.replace(',', '');
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
        latestProperty.quoted_price = price1;
        finalLatestProperties.push(latestProperty);
      }
    }
    crudModel.getLatestProjectDetails().then(function (latestProjectDetails) {
      var finalLatestProjects = [];
      var projectIds = [];
      for (var i = 0; i < latestProjectDetails.length; i++) {
        var latestProject = latestProjectDetails[i];
        if (!projectIds.includes(latestProject.project_id)) {
          projectIds.push(latestProject.project_id);
          if (latestProject.project_photo == null) {
            latestProject.project_photo = "no-photo.jpg";
          }
          var plans = latestProject.plans, minPrice = latestProject.min_price;
          var plansString = "", finalMinPrice;
          if (plans != null && plans != '') {
            var plansArray = plans.split(',');
            for (var i = 0; i < plansArray.length; i++) {
              plansString += plansArray[i] + ' BHK';
              if (i != (plansArray.length - 1)) {
                plansString += ", ";
              }
            }
          } else {
            plansString = '';
          }
          latestProject.plans = plansString;
          if (minPrice != "") {
            if (minPrice > 10000000) {
              finalMinPrice = Math.round((parseFloat(minPrice)) / 10000000, 2);
              finalMinPrice += ' Cr';
            } else if (minPrice > 100000) {
              finalMinPrice = Math.round((parseFloat(minPrice)) / 100000, 2);
              finalMinPrice += ' Lac';
            }
          } else {
            finalMinPrice = 'Price On Request';
          }
          latestProject.min_price = finalMinPrice;
          finalLatestProjects.push(latestProject);
        }
      }
      res.render("home/index", { page_title: 'Index', page_name: 'Index', latest_properties: finalLatestProperties, latest_projects: finalLatestProjects });
    });
  });
});
app.use('/home', indexRouter);
app.use('/admin', adminRouter);
app.use('/apis', apiRouter);

app.locals.base_url = process.env.NODE_ENV == "production" ? "http://3.211.66.163:3000/" :  "http://localhost:3000/";
app.locals.api_url = app.locals.base_url + "apis/";
crudModel.getProjectVideos("bottom").then(function (response) {
  app.locals.footer_project_link = response;
});
crudModel.getCityLimit().then(function (response) {
  app.locals.header_city_limit = response;
});
crudModel.getProjectVideos('side').then(function (response) {
  app.locals.sidebar_project_link = response;
});
crudModel.getTestimonialLimit().then(function (response) {
  app.locals.sidebar_testimonials = response;
});
crudModel.getHomeAds().then(function (response) {
  app.locals.sidebar_home_ads = response;
});
crudModel.getNewsLimit().then(function (response) {
  app.locals.sidebar_news_limit = response;
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
