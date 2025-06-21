import bcrypt from 'bcrypt';
import models from '../../models/index.cjs';
import log from "../../utils/loggerTs.js";

(async () => {
  try {
    const [domainIdArg, email, name, password, ssn] = process.argv.slice(2);
    if (!domainIdArg || !email || !name || !password) {
      log.info('Usage: node createUserAddDomain.js <domainId> <email> <name> <password> [ssn]');
      process.exit(1);
    }
    const domainId = Number(domainIdArg);
    const domain = await models.Domain.findOne({ where: { id: domainId } });
    if (!domain) {
      log.error(`Domain ${domainId} not found`);
      process.exit(1);
    }
    const existing = await models.User.findOne({ where: { email } });
    if (existing) {
      log.error(`User with email ${email} already exists`);
      process.exit(1);
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      email,
      name,
      status: 'active',
      ssn: ssn || undefined,
      encrypted_password: hashed,
    });
    await domain.addDomainUsers!(user);
    log.info(`User ${email} created and added to domain ${domain.name}`);
    process.exit(0);
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
})();
