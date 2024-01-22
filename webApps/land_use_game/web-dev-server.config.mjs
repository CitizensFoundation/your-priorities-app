// import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';

import rollupCopy from "rollup-plugin-copy";
import proxy from "koa-proxies";
import { fromRollup } from "@web/dev-server-rollup";
import rollupReplace from "@rollup/plugin-replace";
import rollupCommonsJs from "@rollup/plugin-commonjs";
import rollupNodePolyfills from "rollup-plugin-polyfill-node";
import rollupAlias from "@rollup/plugin-alias";

/** Use Hot Module replacement by adding --hmr to the start command */


import resolve from "@rollup/plugin-node-resolve";
const nodeResolve = fromRollup(resolve);
const replace = fromRollup(rollupReplace);
const commonJs = fromRollup(rollupCommonsJs);
const nodePolyfills = fromRollup(rollupNodePolyfills);
const copy = fromRollup(rollupCopy);

const alias = fromRollup(rollupAlias);

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  open: "/",
  watch: true,
  appIndex: "index.html",
  /** Resolve bare module imports */
  nodeResolve: false,
  mimeTypes: {
    "**/*.cjs": "js",
  },
  port: 9175,
  plugins: [
    //nodePolyfills(),

    nodeResolve({
      preferBuiltins: true,
    }),
    //commonJs(),

    copy({
      targets: [
        {
          src: "src/@yrpri/yp-magic-text/twemoji.min.js",
          dest: "out-tsc/src/@yrpri/yp-magic-text/twemoji.min.js"
        },
        {
          src: "node_modules/cesium/Source/Workers",
          dest: "dist/Workers",
        },
        {
          src: "node_modules/cesium/Source/Assets",
          dest: "dist/Assets",
        },
        {
          src: "node_modules/cesium/Source/Widgets",
          dest: "dist/Widgets",
        },
        {
          src: "node_modules/cesium/Source/ThirdParty/Workers",
          dest: "dist/ThirdParty/Workers",
        },
      ],
    }),
    replace({
      include: [
        "src/YpLandUseGame.ts",
        "src/YpLandUseGame.js",
        "out-tsc/src/YpLandUseGame.js",
      ],
      __CESIUM_ACCESS_TOKEN__: JSON.stringify(process.env.CESIUM_ACCESS_TOKEN),
    }),
  ],
  middleware: [
    proxy('/api/', {
      target: 'http://localhost:4242/',
    }),
  ],
});
