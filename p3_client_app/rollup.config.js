//import createDefaultConfig from '@open-wc/building-rollup/modern-and-legacy-config';
import createDefaultConfig from '@open-wc/building-rollup/modern-config';
import commonjs from 'rollup-plugin-commonjs';

const config = createDefaultConfig({ input: './index.html' });
// map if you use an array of configs, otherwise just extend the config
export default {
  ...config,
  plugins: [
    ...config.plugins,
    commonjs({
      namedExports: {
          'node_modules/lodash/index.js': [
              '_'
          ]
      }
  }),
  ],
};
