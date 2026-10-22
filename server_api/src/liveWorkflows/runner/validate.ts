import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readPackage } from "../packages.js";
import { packageValidators } from "./packageContract.js";

const { files } = await readPackage("/package");
packageValidators(files);
await promisify(execFile)(
  process.execPath,
  [
    "/opt/yp-workflow/node_modules/typescript/bin/tsc",
    "--noEmit",
    "--strict",
    "--skipLibCheck",
    "--target",
    "ES2022",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    ...Object.keys(files)
      .filter((file) => file.startsWith("source/") && file.endsWith(".ts"))
      .map((file) => `/package/${file}`),
  ],
  { maxBuffer: 200_000 },
);
