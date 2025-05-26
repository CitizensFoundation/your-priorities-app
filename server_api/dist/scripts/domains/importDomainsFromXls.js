import ExcelJS from 'exceljs';
import models from '../../models/index.cjs';
(async () => {
    try {
        const [xlsPath] = process.argv.slice(2);
        if (!xlsPath) {
            console.log('Usage: node importDomainsFromXls.js <path-to-xls>');
            process.exit(1);
        }
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(xlsPath);
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            console.error('No worksheet found in file');
            process.exit(1);
        }
        await models.sequelize.transaction(async (t) => {
            for (let i = 2; i <= worksheet.rowCount; i++) {
                const row = worksheet.getRow(i);
                const name = String(row.getCell(1).text).trim();
                const description = String(row.getCell(2).text).trim();
                if (!name)
                    continue;
                const existing = await models.Domain.findOne({
                    where: { name },
                    transaction: t
                });
                if (existing) {
                    await existing.update({ description }, { transaction: t });
                    console.log(`Updated domain ${existing.domain_name}`);
                }
                else {
                    const randomPart = Math.random().toString(36).substring(2, 10);
                    const domainName = `domain_${randomPart}`;
                    await models.Domain.create({
                        name,
                        description,
                        domain_name: domainName,
                        access: 1,
                        user_id: 1,
                        ip_address: '127.0.0.1',
                        user_agent: 'import-script',
                        default_locale: 'en',
                        configuration: {}
                    }, { transaction: t });
                    console.log(`Created domain ${domainName}`);
                }
            }
        });
        await models.sequelize.close();
        console.log('Import completed');
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
