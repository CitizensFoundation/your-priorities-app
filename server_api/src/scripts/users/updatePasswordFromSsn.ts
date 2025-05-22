import bcrypt from 'bcrypt';
import models from '../../models/index.cjs';

(async () => {
  try {
    const [ssnArg, password] = process.argv.slice(2);
    if (!ssnArg || !password) {
      console.log('Usage: node updatePasswordFromSsn.js <ssn> <newPassword>');
      process.exit(1);
    }
    const ssn = Number(ssnArg);
    const user = await models.User.findOne({ where: { ssn } });
    if (!user) {
      console.error(`User with ssn ${ssn} not found`);
      process.exit(1);
    }
    (user as any).encrypted_password = await bcrypt.hash(password, 10);
    await user.save();
    console.log(`Updated password for ${user.email}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
