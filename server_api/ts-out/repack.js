"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const tar_1 = __importDefault(require("tar"));
const os_1 = __importDefault(require("os"));
const url_1 = require("url");
const util_1 = require("util");
const __dirname = path_1.default.dirname((0, url_1.fileURLToPath)(import.meta.url));
const repackPackage = async () => {
    const packageJsonPath = path_1.default.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs_1.default.readFileSync(packageJsonPath, 'utf8'));
    // Create a safe package name that can be used in file paths
    const safePackageName = packageJson.name.replace('/', '-').replace('@', '');
    const packageName = `${safePackageName}-${packageJson.version}.tgz`;
    // Create temporary directories
    const tmpDir = path_1.default.join(os_1.default.tmpdir(), `pck${Math.floor(Math.random() * 10000)}`);
    const newDir = path_1.default.join(tmpDir, 'package');
    fs_1.default.mkdirSync(newDir, { recursive: true });
    // Extract the original package
    await (0, util_1.promisify)(tar_1.default.x)({ file: packageName, C: tmpDir });
    // Function to recursively move files
    const moveAndRemove = (srcPath, destPath) => {
        const entries = fs_1.default.readdirSync(srcPath, { withFileTypes: true });
        entries.forEach(entry => {
            const srcEntryPath = path_1.default.join(srcPath, entry.name);
            const destEntryPath = path_1.default.join(destPath, entry.name);
            if (entry.isDirectory()) {
                fs_1.default.mkdirSync(destEntryPath, { recursive: true });
                moveAndRemove(srcEntryPath, destEntryPath);
            }
            else {
                fs_1.default.renameSync(srcEntryPath, destEntryPath);
            }
        });
        // Remove the source directory after moving its contents
        fs_1.default.rmSync(srcPath, { recursive: true, force: true });
    };
    // Move files from 'ts-out' and 'src' directories to 'new-folder'
    moveAndRemove(path_1.default.join(tmpDir, 'package', 'ts-out'), newDir);
    // Create a new tarball from 'new-folder'
    const newPackageName = path_1.default.join(tmpDir, `${safePackageName}-${packageJson.version}.tgz`);
    await (0, util_1.promisify)(tar_1.default.c)({
        gzip: true,
        file: newPackageName,
        C: tmpDir,
    }, ['package']);
    // Replace the original package with the new one
    //fs.renameSync(newPackageName, path.join(__dirname, packageName));
    // Clean up the temporary directory
    //fs.rmSync(tmpDir, { recursive: true, force: true });
    console.log('Package repacked.');
    console.log(`New tarball: ${newPackageName.replace("-new", "")}`);
};
repackPackage().catch(console.error);
