import models from '../../models/index.cjs';
(async () => {
    try {
        const [userId, domainName, name] = process.argv.slice(2);
        if (!domainName || !name) {
            console.log('Usage: node createDomain.js <user_id> <domain_name> "<name>"');
            process.exit(1);
        }
        const existing = await models.Domain.findOne({ where: { domain_name: domainName } });
        if (existing) {
            console.error(`Domain with domain_name ${domainName} already exists`);
            process.exit(1);
        }
        const domain = await models.Domain.create({
            domain_name: domainName,
            name,
            access: 1,
            user_id: parseInt(userId),
            ip_address: '127.0.0.1',
            user_agent: 'cli-script',
            default_locale: 'en',
            configuration: {}
        });
        console.log(`Created domain ${domain.name} with id ${domain.id}`);
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
