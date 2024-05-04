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
      publicPath: '/',
      injectServiceWorker: true,
      extractAssets: false,
      serviceWorkerPath: '/sw.js',
    }),
    copy({
      targets: [
        { src: 'locales', dest: 'dist/' },
        { src: 'topo', dest: 'dist/' },
        { src: 'images', dest: 'dist/' },
        { src: 'sw.js', dest: 'dist/' },
        { src: 'offline.html', dest: 'dist/' },
        //TODO: Remove this after the new version has been fully launched - in here so one can switch between the old and new version
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
