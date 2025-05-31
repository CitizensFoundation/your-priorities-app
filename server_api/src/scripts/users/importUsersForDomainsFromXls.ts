import ExcelJS from 'exceljs';
import models from '../../models/index.cjs';

(async () => {
  try {
    const [filePath] = process.argv.slice(2);
    if (!filePath) {
      console.log('Usage: node importUsersForDomainsFromXls.js <xlsFilePath>');
      process.exit(1);
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.worksheets[0];

    const transaction = await models.sequelize.transaction();
    try {
      for (let i = 2; i <= sheet.rowCount; i++) {
        const row = sheet.getRow(i);
        const domainName = String(row.getCell(1).text).trim();
        const fullUserName = String(row.getCell(2).text).trim();
        const userEmail = String(row.getCell(3).text).trim().toLowerCase();
        const userSsn = String(row.getCell(4).text).trim();
        const userSsnNumber = userSsn || undefined;

        if (!domainName || !fullUserName || !userEmail) {
          throw new Error(`Missing data in row ${i}`);
        }

        const existingEmail = await models.User.unscoped().findOne({
          where: { email: userEmail },
          transaction,
        });
        if (existingEmail) {
          throw new Error(`User with email ${userEmail} already exists`);
        }

        if (userSsn) {
          const existingSsn = await models.User.unscoped().findOne({
            where: { ssn: userSsn },
            transaction,
          });
          if (existingSsn) {
            throw new Error(`User with ssn ${userSsn} already exists`);
          }
        }

        let domain = await models.Domain.findOne({
          where: { domain_name: domainName },
          transaction,
        });

        if (!domain) {
          domain = await models.Domain.create(
            {
              domain_name: domainName,
              name: domainName,
              access: 1,
              ip_address: '127.0.0.1',
              user_agent: 'xls-import',
              default_locale: 'en',
              configuration: {},
            },
            { transaction }
          );
        }

        const user = await models.User.create(
          {
            email: userEmail,
            name: fullUserName,
            status: 'active',
            ssn: userSsnNumber,
          },
          { transaction }
        );

        await (domain as any).addDomainUsers(user, { transaction });
      }

      await transaction.commit();
      console.log('Import completed');
      process.exit(0);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
