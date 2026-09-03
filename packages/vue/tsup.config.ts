import { defineConfig } from 'tsup';
import ts from 'typescript';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  treeshake: true,
  external: ['vue', '@hydrateless/enhancers'],
  plugins: [
    {
      name: 'strip-comments',
      // Prop tables carry TSDoc for the generated `.d.ts` and the docs site,
      // and esbuild keeps every comment that sits inside an object literal.
      // They're dead weight at runtime, so reprint the chunk without them.
      renderChunk(code) {
        const { outputText } = ts.transpileModule(code, {
          compilerOptions: {
            target: ts.ScriptTarget.ESNext,
            module: ts.ModuleKind.ESNext,
            removeComments: true,
          },
        });
        return { code: outputText };
      },
    },
  ],
});
