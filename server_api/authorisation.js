var ConnectRoles = require('connect-roles');

var user = new ConnectRoles({
    failureHandler: function (req, res, action) {
        var accept = req.headers.accept || '';
        res.status(403);
        res.send('Access Denied - You don\'t have permission to: ' + action);
    }
});

// set up all the authorisation rules here

module.exports = user;