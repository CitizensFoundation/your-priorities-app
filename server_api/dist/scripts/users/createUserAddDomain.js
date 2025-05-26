import bcrypt from 'bcrypt';
import models from '../../models/index.cjs';
(async () => {
    try {
        const [domainIdArg, email, name, password, ssn] = process.argv.slice(2);
        if (!domainIdArg || !email || !name || !password) {
            console.log('Usage: node createUserAddDomain.js <domainId> <email> <name> <password> [ssn]');
            process.exit(1);
        }
        const domainId = Number(domainIdArg);
        const domain = await models.Domain.findOne({ where: { id: domainId } });
        if (!domain) {
            console.error(`Domain ${domainId} not found`);
            process.exit(1);
        }
        const existing = await models.User.findOne({ where: { email } });
        if (existing) {
            console.error(`User with email ${email} already exists`);
            process.exit(1);
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await models.User.create({
            email,
            name,
            status: 'active',
            ssn: ssn ? Number(ssn) : undefined,
            encrypted_password: hashed,
        });
        await domain.addDomainUsers(user);
        console.log(`User ${email} created and added to domain ${domain.name}`);
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
