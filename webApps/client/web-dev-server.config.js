import {legacyPlugin} from '@web/dev-server-legacy';
import { fromRollup } from '@web/dev-server-rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';


const commonjs = fromRollup(rollupCommonjs);
import proxy from 'koa-proxies';
import rollupCommonsJs from "@rollup/plugin-commonjs";

import resolve from "@rollup/plugin-node-resolve";
const nodeResolve = fromRollup(resolve);

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

export default {
  open: '/',
  watch: true,
  /** Resolve bare module imports */
  nodeResolve: {
    browser: true,
  },
  mimeTypes: {
    '**/*.cjs': 'js',
  },
  appIndex: 'index.html',
  port: 4444,
  //nodeResolve: {exportConditions: mode === 'dev' ? ['development'] : []},
  preserveSymlinks: true,
  middleware: [
    proxy('/api/', {
      target: 'http://localhost:4242/',
      changeOrigin: true,
      ws: true
    })
  ],
  plugins: [
    legacyPlugin({
      polyfills: {
        // Manually imported in index.html file
        webcomponents: false,
      },
    }),
  ],
};
