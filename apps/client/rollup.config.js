//import summary from 'rollup-plugin-summary';
import terser  from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json' assert { type: 'json' };
import copy from 'rollup-plugin-copy';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';

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
    }),
    html({
      minify: true,
      publicPath: '/'
      //      injectServiceWorker: true,
      //      serviceWorkerPath: 'dist/sw.js',
    }),
    copy({
      targets: [
        { src: 'locales', dest: 'dist/' },
        { src: 'topo', dest: 'dist/' },
      ],
    }),
    resolve(),
    terser({
      ecma: 2021,
      module: true,
      warnings: true,
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
    }),
    //summary(),
  ],
};
