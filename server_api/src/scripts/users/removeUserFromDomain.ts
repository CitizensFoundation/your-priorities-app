import models from '../../models/index.cjs';

(async () => {
  try {
    const [domainIdArg, email] = process.argv.slice(2);
    if (!domainIdArg || !email) {
      console.log('Usage: node removeUserFromDomain.js <domainId> <email>');
      process.exit(1);
    }
    const domainId = Number(domainIdArg);
    const domain = await models.Domain.findOne({ where: { id: domainId } });
    if (!domain) {
      console.error(`Domain ${domainId} not found`);
      process.exit(1);
    }
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      console.error(`User ${email} not found`);
      process.exit(1);
    }
    await (domain as any).removeDomainUsers(user as any);
    console.log(`Removed ${email} from domain ${domain.name}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
