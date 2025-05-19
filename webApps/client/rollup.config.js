import fs from 'fs';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';

// Establish __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and parse package.json
const pkgPath = join(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

function getCustomVersion(version) {
  const date = new Date();

  const formattedDate = date.toLocaleString('en-US', {
    hour12: false,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return `Built on ${formattedDate}`;
}

function getLocalesHash() {
  const localesDir = join(__dirname, 'locales');
  const hash = createHash('md5');

  const walk = (dir) => {
    for (const file of fs.readdirSync(dir)) {
      const fullPath = join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        hash.update(fs.readFileSync(fullPath));
      }
    }
  };

  walk(localesDir);
  return hash.digest('hex').slice(0, 8);
}

const localesHash = getLocalesHash();

export default {
  input: 'index.html',
  output: {
    entryFileNames: '[hash].js',
    chunkFileNames: '[hash].js',
    assetFileNames: '[hash][extname]',
    format: 'es',
    dir: 'dist',
  },
  onwarn(warning) {
    if (warning.code !== "THIS_IS_UNDEFINED") {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
    replace({ "Reflect.decorate": "undefined" }),
    replace({
      preventAssignment: true,
      __VERSION__: getCustomVersion(pkg.version),
      __LOCALES_DIR__: `locales-${localesHash}`,
    }),
    html({
      minify: true,
      publicPath: '/',
      injectServiceWorker: true,
      extractAssets: false,
      serviceWorkerPath: '/sw.js',
    }),
    copy({
      targets: [
        { src: 'locales', dest: `dist/locales-${localesHash}` },
        { src: 'topo', dest: 'dist/' },
        { src: 'images', dest: 'dist/' },
        { src: 'sw.js', dest: 'dist/' },
        { src: 'offline.html', dest: 'dist/' },
        // TODO: Remove this after the new version has been fully launched
        { src: '../old/client/build/bundled/src', dest: 'dist/' },
        { src: '../old/client/build/bundled/bower_components', dest: 'dist/' },
        { src: 'node_modules/broadcastchannel-polyfill/index.js', dest: 'dist/node_modules/broadcastchannel-polyfill/' },
      ],
    }),
    resolve(),
    terser({}),
    //summary(),
  ],
};
