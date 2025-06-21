import models from '../../models/index.cjs';
import log from "../../utils/loggerTs.js";

(async () => {
  try {
    const [email, ssnArg] = process.argv.slice(2);
    if (!email || !ssnArg) {
      log.info('Usage: node updateUserSsnFromEmail.js <email> <ssn>');
      process.exit(1);
    }
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      log.error(`User ${email} not found`);
      process.exit(1);
    }
    const ssn = ssnArg;
    user.ssn = ssn;
    await user.save();
    log.info(`Updated SSN for ${email}`);
    process.exit(0);
  } catch (err) {
    log.error(err);
    process.exit(1);
  }
})();
