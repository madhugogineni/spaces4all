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
var enviornmentConfig = require('./external-config/environment');
var otherConfig = require('./external-config/other');
var cors = require('cors');
const multer = require('multer');
const isEmpty = require('lodash.isempty');
const upload = multer();
const stocksModel = require('./models/stocksModel');

var app = express();
app.use(session({ secret: otherConfig.sessionSecret }));
var corsOptions = {
    origin: 'https://www.spaces4all.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
    if (!req.session.compare) {
        req.session.compare = {
            project: [],
            property: [],
            rent: []
        }
    }
    next();
});

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
                    } else if (price > 100000) {
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
                    var minPrice = latestProject.min_price;
                    var finalMinPrice;
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

            crudModel.getHomeSlide().then(function (response) {
                var homeSliderData;
                if (response.success) {
                    homeSliderData = response.data
                } else {
                    homeSliderData = []
                }
                var responseData = {
                    page_title: 'Index',
                    page_name: 'Index',
                    latest_properties: finalLatestProperties,
                    latest_projects: finalLatestProjects,
                    home_slider: homeSliderData
                }
                // console.log(responseData)
                res.render("home/index", responseData);
            });
        });
    });
});

app.get('/get-stocks', async function (req, res) {
    try {
        validateAppKeyAndSecret(req.headers);
        var stocksList = await stocksModel.getEnabledStocks();
        res.send(stocksList);
        res.end();
    } catch (e) {
        res.status(400).send({ success: false, message: e.message });
    }
});

function validateAppKeyAndSecret(headers) {
    var appKey = headers['app-key'];
    var appSecret = headers['app-secret'];
    if (isEmpty(appKey) || isEmpty(appSecret)) {
        throw new Error('Please send App Key and App secret');
    }
    if (appKey != otherConfig.stocksKey || appSecret != otherConfig.stocksSecret) {
        throw new Error('App key or secret are wrong');
    }
}

app.use('/home', indexRouter);
app.use('/admin', adminRouter);
app.use('/apis', apiRouter);

app.locals.base_url = enviornmentConfig.url;
app.locals.api_url = enviornmentConfig.url + "apis/";
crudModel.getProjectVideos("bottom").then(function (response) {
    if (response.success) {
        app.locals.footer_project_link = response.data;
    } else {
        app.locals.footer_project_link = {};
    }
});
crudModel.getCityLimit().then(function (response) {
    app.locals.header_city_limit = response;
});
crudModel.getProjectVideos('side').then(function (response) {
    if (response.success) {
        app.locals.sidebar_project_link = response.data;
    } else {
        app.locals.sidebar_project_link = {};
    }
});
crudModel.getTestimonialLimit().then(function (response) {
    app.locals.sidebar_testimonials = response;
});
crudModel.getHomeAds().then(function (response) {
    if (response.success) {
        app.locals.sidebar_home_ads = response.data;
    } else {
        app.locals.sidebar_home_ads = [];
    }
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
