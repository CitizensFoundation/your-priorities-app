import merge from 'deepmerge';
// use createSpaConfig for bundling a Single Page App
import { createSpaConfig } from '@open-wc/building-rollup';
import commonjs from '@rollup/plugin-commonjs';
import analyze from 'rollup-plugin-analyzer';
import tailwind from 'rollup-plugin-tailwindcss';

// use createBasicConfig to do regular JS to JS bundling
// import { createBasicConfig } from '@open-wc/building-rollup';

const baseConfig = createSpaConfig({
  // use the outputdir option to modify where files are output
  // outputDir: 'dist',

  // if you need to support older browsers, such as IE11, set the legacyBuild
  // option to generate an additional build just for this browser
  legacyBuild: true,

  nodeResolve: true,

  // development mode creates a non-minified build for debugging or development
  developmentMode: process.env.ROLLUP_WATCH === 'true',

  html: {
    publicPath: '/marketing'
  },

  // set to true to inject the service worker registration into your index.html
  injectServiceWorker: false,
});

export default merge(baseConfig, {
  // if you use createSpaConfig, you can use your index.html as entrypoint,
  // any <script type="module"> inside will be bundled by rollup
  input: './index.html',
  plugins: [
    tailwind({
      input: 'path/to/entry.css', // required
      // Tailor the emitted stylesheet to the bundle by removing any unused CSS
      // (highly recommended when packaging for distribution).
      purge: false,
    }),
    commonjs({
      include: [
        'node_modules/linkifyjs/**/*',
        'node_modules/moment/**/*',
        'node_modules/wavesurfer.js/**/*',
        'node_modules/recordrtc/**/*',
        'node_modules/i18next/**/*',
        'node_modules/datamaps/**/*',
        '**/*/node_modules/linkifyjs/**/*',
        '**/*/node_modules/i18next-http-backend/**/*'
      ],
    }),
    analyze({summaryOnly: true})
  ]
  // alternatively, you can use your JS as entrypoint for rollup and
  // optionally set a HTML template manually
  // input: './app.js',
});