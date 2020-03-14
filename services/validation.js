var { Validator } = require("node-input-validator");
module.exports = {
    validate: async function (data, rules) {
        var response = {}
        var validator = new Validator(data, rules);
        var validatorResponse = await validator.check();
        response.success = validatorResponse;
        if (!validatorResponse) {
            var validationError = validator.errors;
            var errorMsg = "";
            for (var keys in validationError) {
                errorMsg += validationError[keys].message + "<br/>";
            }
            response.message = errorMsg;
        }
        return response;
    },
    validateEmail: function (email) {
        return email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.(com|in|edu)$/gi) == null ? false : true
    },
    validateMessage: function (message) {
        return message.match(/^((?!(porn|girls|http|https|www|movie|Pharmacy|<a>)).)*$/gi) == null ? false : true
    }
}