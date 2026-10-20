import { esbuildPlugin } from '@web/dev-server-esbuild';
import { legacyPlugin } from '@web/dev-server-legacy';
import { fromRollup } from '@web/dev-server-rollup';
import rollupCommonjs from '@rollup/plugin-commonjs';

const commonjs = fromRollup(rollupCommonjs);

export default {
  nodeResolve: {
    browser: true,
  },
  preserveSymlinks: true,
  files: [
    'src/**/*.test.ts',
    // TODO: This test module, inherited from upstream, fails to load. Fix it
    // and remove this exclusion.
    '!src/yp-point/test/yp-point-comment-list.test.ts',
  ],
  // Run one test file at a time. Some tests pass when their file runs on
  // its own but fail when it runs in parallel with other files, and we
  // haven't established why.
  concurrency: 1,
  // fetch-mock's browser build pulls in `globrex`, which reads `process.platform`.
  // Shim a minimal `process` global before any test module loads.
  testRunnerHtml: (testFramework) => `
    <html>
      <body>
        <script>
          window.process = window.process || { env: {}, platform: 'browser' };
        </script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
  plugins: [
    commonjs({
      include: [
        '**/node_modules/debug/**',
        '**/node_modules/glob-to-regexp/**',
        '**/node_modules/is-subset/**',
        '**/node_modules/i18next-http-backend/**',
        '**/node_modules/fetch-mock/**',
        '**/node_modules/globrex/**',
        '**/node_modules/lodash.isequal/**',
        '**/node_modules/ms/**',
        '**/node_modules/path-to-regexp/**',
        '**/node_modules/querystring/**',
      ],
    }),
    esbuildPlugin({
      ts: true,
      tsconfig: './tsconfig.json',
      loaders: {
        '.ts': 'ts',
      },
    }),
    legacyPlugin({
      polyfills: {
        webcomponents: false,
      },
    }),
  ],
};
