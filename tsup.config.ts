import { defineConfig, type Options } from 'tsup';

const common = {
  minify: true,
  target: 'es2020',
} as const;

export const nodeConfig: Options = {
  entry: {
    'node/src/node/index': 'src/node/index.ts',
    'node/src/node/latin': 'src/node/latin.ts',
  },
  format: ['cjs'],
  dts: true,
  sourcemap: true,
  outDir: 'dist',
  outExtension: () => ({ js: '.js' }),
  ...common,
  platform: 'node',
};

export default defineConfig([nodeConfig]);
