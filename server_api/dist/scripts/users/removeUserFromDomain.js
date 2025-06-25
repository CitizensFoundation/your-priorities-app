import models from '../../models/index.cjs';
import log from "../../utils/loggerTs.js";
(async () => {
    try {
        const [domainIdArg, email] = process.argv.slice(2);
        if (!domainIdArg || !email) {
            log.info('Usage: node removeUserFromDomain.js <domainId> <email>');
            process.exit(1);
        }
        const domainId = Number(domainIdArg);
        const domain = await models.Domain.findOne({ where: { id: domainId } });
        if (!domain) {
            log.error(`Domain ${domainId} not found`);
            process.exit(1);
        }
        const user = await models.User.findOne({ where: { email } });
        if (!user) {
            log.error(`User ${email} not found`);
            process.exit(1);
        }
        await domain.removeDomainUsers(user);
        log.info(`Removed ${email} from domain ${domain.name}`);
        process.exit(0);
    }
    catch (err) {
        log.error(err);
        process.exit(1);
    }
})();
