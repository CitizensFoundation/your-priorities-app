import bcrypt from 'bcrypt';
import models from '../../models/index.cjs';
import log from "../../utils/loggerTs.js";
(async () => {
    try {
        const [ssnArg, password] = process.argv.slice(2);
        if (!ssnArg || !password) {
            log.info('Usage: node updatePasswordFromSsn.js <ssn> <newPassword>');
            process.exit(1);
        }
        const ssn = ssnArg;
        const user = await models.User.findOne({ where: { ssn } });
        if (!user) {
            log.error(`User with ssn ${ssn} not found`);
            process.exit(1);
        }
        user.encrypted_password = await bcrypt.hash(password, 10);
        await user.save();
        log.info(`Updated password for ${user.email}`);
        process.exit(0);
    }
    catch (err) {
        log.error(err);
        process.exit(1);
    }
})();
