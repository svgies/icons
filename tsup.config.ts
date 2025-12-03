import { defineConfig } from 'tsup';

export default defineConfig([
  // Library build (index.ts)
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    minify: true
  },
  // CLI build (cli.ts)
  {
    entry: ['src/cli.ts'],
    format: ['esm'],
    dts: false,
    minify: true
  },
]);
