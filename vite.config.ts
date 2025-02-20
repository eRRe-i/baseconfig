import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    outDir: 'dist', // Pasta de saída para os arquivos transpilados
    lib: {
      entry: path.resolve(__dirname, 'src/cli.ts'),
      name: 'CLI',
      fileName: (format) => `cli.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {},
    },
  },
})
