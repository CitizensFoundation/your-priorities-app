import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import type { CodexAuthMaterial } from "../../../contracts/index.js";
import {
  archiveCodexAuthMaterial,
  codexAuthMaterialFingerprintSha256,
  materializeCodexAuthMaterial,
} from "../../codex/codexAuthMaterial.js";

test("Codex auth material materializes provided files but archives only auth.json", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-auth-"));
  const codexHomePath = path.join(tempDir, "codex-home");
  const authJson = JSON.stringify({ token: "stored" });
  const configToml = "model = \"gpt-5.3-codex\"\n";
  const material: CodexAuthMaterial = {
    format: "codex_home_files_v1",
    files: [
      {
        path: "auth.json",
        dataBase64: Buffer.from(authJson).toString("base64"),
        mode: 0o600,
      },
      {
        path: "config.toml",
        dataBase64: Buffer.from(configToml).toString("base64"),
        mode: 0o600,
      },
    ],
  };

  await materializeCodexAuthMaterial(material, codexHomePath);
  assert.equal(await fs.readFile(path.join(codexHomePath, "auth.json"), "utf8"), authJson);
  assert.equal(await fs.readFile(path.join(codexHomePath, "config.toml"), "utf8"), configToml);

  const archived = await archiveCodexAuthMaterial(codexHomePath);

  assert.equal(archived.format, "codex_home_files_v1");
  assert.deepEqual(archived.files.map((file) => file.path), ["auth.json"]);
  assert.equal(
    Buffer.from(archived.files.find((file) => file.path === "auth.json")?.dataBase64 ?? "", "base64").toString("utf8"),
    authJson
  );
});

test("Codex auth material archive canonicalizes auth.json mode for fingerprint stability", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-auth-"));
  const codexHomePath = path.join(tempDir, "codex-home");
  const authJson = JSON.stringify({ token: "stored" });
  const storedMaterial: CodexAuthMaterial = {
    format: "codex_home_files_v1",
    files: [
      {
        path: "auth.json",
        dataBase64: Buffer.from(authJson).toString("base64"),
        mode: 0o600,
      },
    ],
  };

  await fs.mkdir(codexHomePath, { recursive: true });
  const authPath = path.join(codexHomePath, "auth.json");
  await fs.writeFile(authPath, authJson, { mode: 0o600 });
  await fs.chmod(authPath, 0o644);

  const archived = await archiveCodexAuthMaterial(codexHomePath);

  assert.equal(archived.files[0]?.mode, 0o600);
  assert.equal(
    codexAuthMaterialFingerprintSha256(archived),
    codexAuthMaterialFingerprintSha256(storedMaterial)
  );
});

test("Codex auth material rejects paths that escape CODEX_HOME or target symlinks", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-codex-auth-"));
  const codexHomePath = path.join(tempDir, "codex-home");
  await fs.mkdir(codexHomePath, { recursive: true });

  await assert.rejects(
    materializeCodexAuthMaterial(
      {
        format: "codex_home_files_v1",
        files: [
          {
            path: "../auth.json",
            dataBase64: Buffer.from("{}").toString("base64"),
          },
        ],
      },
      codexHomePath
    ),
    /escapes CODEX_HOME/
  );

  const outsidePath = path.join(tempDir, "outside-auth.json");
  await fs.writeFile(outsidePath, "{}");
  await fs.symlink(outsidePath, path.join(codexHomePath, "auth.json"));
  await assert.rejects(
    materializeCodexAuthMaterial(
      {
        format: "codex_home_files_v1",
        files: [
          {
            path: "auth.json",
            dataBase64: Buffer.from("{\"token\":\"stored\"}").toString("base64"),
          },
        ],
      },
      codexHomePath
    ),
    /symlink/
  );
});
