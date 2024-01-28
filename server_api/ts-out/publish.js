"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
const readline_1 = __importDefault(require("readline"));
const execPromise = (0, util_1.promisify)(child_process_1.exec);
async function main() {
    const registryUrl = process.argv[2]; // Get registry URL from command line argument
    try {
        // Run repack script and capture its output
        const { stdout } = await execPromise('node repack.js');
        const tarballMatch = stdout.match(/New tarball: (.*)/);
        if (tarballMatch) {
            const tarball = tarballMatch[1].trim();
            if (registryUrl !== 'http://localhost:4873') {
                // Prompt for OTP if not localhost
                const rl = readline_1.default.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });
                rl.question('Enter OTP: ', async (otp) => {
                    // Publish the new tarball to the specified registry
                    await execPromise(`npm publish ${tarball} --registry ${registryUrl} --otp=${otp}`, { maxBuffer: 1024 * 1024 * 10 }); // 1MB buffer
                    console.log(`Published to ${registryUrl}`);
                    rl.close();
                });
            }
            else {
                // Skip OTP for localhost
                await execPromise(`npm publish ${tarball} --registry ${registryUrl}`, { maxBuffer: 1024 * 1024 * 10 }); // 1MB buffer
                console.log(`Published to ${registryUrl}`);
            }
        }
        else {
            throw new Error('Tarball name not found in repack script output');
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}
main();
