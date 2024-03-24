import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
const readFilePromise = promisify(fs.readFile);
const writeFilePromise = promisify(fs.writeFile);
class RemoveKeysFromTranslations {
    constructor() {
        this.localesDir = './locales';
        this.excludeLocales = ['en', 'en_gb', 'en_ca'];
        this.keysToRemove = [
            'facebook',
            'twitter',
            'linkedin',
            'adwords',
            'snapchat',
            'instagram',
            'youtube',
            'tiktok',
            'allOurIdeas'
        ];
    }
    async removeKeys() {
        const localeDirs = fs
            .readdirSync(this.localesDir)
            .filter((file) => fs.statSync(path.join(this.localesDir, file)).isDirectory() && !this.excludeLocales.includes(file));
        for (const localeDir of localeDirs) {
            console.log(`Processing locale: ${localeDir}`);
            const translationFilePath = path.join(this.localesDir, localeDir, 'translation.json');
            let translation = await this.loadJsonFile(translationFilePath);
            translation = this.removeKeysFromTranslation(translation, this.keysToRemove);
            await writeFilePromise(translationFilePath, JSON.stringify(translation, null, 2));
            console.log(`Updated translation for ${localeDir}`);
        }
    }
    async loadJsonFile(filePath) {
        const fileContent = await readFilePromise(filePath, 'utf8');
        return JSON.parse(fileContent);
    }
    removeKeysFromTranslation(translation, keysToRemove) {
        const removeKeysRecursively = (obj) => {
            Object.keys(obj).forEach((key) => {
                if (keysToRemove.includes(key)) {
                    delete obj[key];
                }
                else if (typeof obj[key] === 'object') {
                    removeKeysRecursively(obj[key]);
                }
            });
        };
        removeKeysRecursively(translation);
        return translation;
    }
}
(async () => {
    const remover = new RemoveKeysFromTranslations();
    await remover.removeKeys();
})();
//# sourceMappingURL=removeChangedKeysFromTranslation.js.map