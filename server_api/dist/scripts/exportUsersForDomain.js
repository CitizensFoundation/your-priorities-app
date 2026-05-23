var models = require('../models/index.cjs');
var async = require('async');
var domainId = process.argv[2];
models.Domain.findOne({
    where: {
        id: domainId
    },
    include: [
        {
            model: models.User,
            as: 'DomainUsers'
        }
    ]
}).then(function (domain) {
    log.info(domain.DomainUsers.length);
    log.info("email,name,kt");
    async.eachSeries(domain.DomainUsers, function (user, seriesCallback) {
        log.info('"' + user.email + '","' + user.name + '"' + (user.ssn ? ',' + user.ssn : ''));
        seriesCallback();
    }, function () {
        process.exit();
    });
});
export {};
