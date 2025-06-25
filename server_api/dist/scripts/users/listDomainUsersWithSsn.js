import models from '../../models/index.cjs';
import log from "../../utils/loggerTs.js";
(async () => {
    try {
        const [domainIdArg] = process.argv.slice(2);
        if (!domainIdArg) {
            log.info('Usage: node listDomainUsersWithSsn.js <domainId>');
            process.exit(1);
        }
        const domainId = Number(domainIdArg);
        const domain = await models.Domain.findOne({
            where: { id: domainId },
            include: [{ model: models.User, as: 'DomainUsers' }],
        });
        if (!domain) {
            log.error(`Domain ${domainId} not found`);
            process.exit(1);
        }
        log.info('email,name,ssn');
        for (const user of domain.DomainUsers) {
            if (user.ssn) {
                log.info(`${user.email},${user.name},${user.ssn}`);
            }
        }
        process.exit(0);
    }
    catch (err) {
        log.error(err);
        process.exit(1);
    }
})();
