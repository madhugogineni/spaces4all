var validatorpackage = require('node-input-validator');
module.exports = {
    validate: async function (data, rules) {
        var response = {}
        var validator = new validatorpackage(data, rules);
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
    }
}