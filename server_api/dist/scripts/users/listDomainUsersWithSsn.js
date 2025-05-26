import models from '../../models/index.cjs';
(async () => {
    try {
        const [domainIdArg] = process.argv.slice(2);
        if (!domainIdArg) {
            console.log('Usage: node listDomainUsersWithSsn.js <domainId>');
            process.exit(1);
        }
        const domainId = Number(domainIdArg);
        const domain = await models.Domain.findOne({
            where: { id: domainId },
            include: [{ model: models.User, as: 'DomainUsers' }],
        });
        if (!domain) {
            console.error(`Domain ${domainId} not found`);
            process.exit(1);
        }
        console.log('email,name,ssn');
        for (const user of domain.DomainUsers) {
            if (user.ssn) {
                console.log(`${user.email},${user.name},${user.ssn}`);
            }
        }
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
