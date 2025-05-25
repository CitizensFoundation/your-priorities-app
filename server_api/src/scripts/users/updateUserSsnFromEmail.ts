import models from '../../models/index.cjs';

(async () => {
  try {
    const [email, ssnArg] = process.argv.slice(2);
    if (!email || !ssnArg) {
      console.log('Usage: node updateUserSsnFromEmail.js <email> <ssn>');
      process.exit(1);
    }
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      console.error(`User ${email} not found`);
      process.exit(1);
    }
    const ssn = Number(ssnArg);
    user.ssn = ssn;
    await user.save();
    console.log(`Updated SSN for ${email}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
