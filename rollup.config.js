// rollup.config.js

import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';
import css from "rollup-plugin-import-css";
import dev from 'rollup-plugin-dev'

const baseConfig = createBasicConfig();

export default merge(baseConfig, {
  input: './out-tsc/src/index.js',
  output: {
      assetFileNames: 'grade[extname]',
      entryFileNames: 'grade.js',
      chunkFileNames: 'gradechunk.js',
      dir: 'dist',
      name: 'grade'
  },
  plugins: [ css(), dev() ]
});