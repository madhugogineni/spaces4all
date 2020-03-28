module.exports = {
    validateAction: function (req) {
        var user = req.session.user;
        if (req.originalUrl.indexOf("/admin/projects/update/") > -1 || req.originalUrl.indexOf("/admin/list_property/update/") > -1) {
            if (user) {
                if (user.role == "ADMIN") {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
}