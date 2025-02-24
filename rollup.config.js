import path from 'path'
import { fileURLToPath } from 'url'
import resolvePlugin from '@rollup/plugin-node-resolve'
import commonjsPlugin from '@rollup/plugin-commonjs'
import typescriptPlugin from '@rollup/plugin-typescript'
import replacePlugin from '@rollup/plugin-replace'
import jsonPlugin from '@rollup/plugin-json' // Importa o plugin JSON <button class="citation-flag" data-index="6">
import { config } from 'dotenv'

// Substitui __dirname usando import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carrega variáveis de ambiente do arquivo .env
config()

export default {
  input: path.resolve(__dirname, 'src/cli.ts'), // Entrada do arquivo principal
  output: {
    dir: 'dist', // Pasta de saída
    format: 'es', // Formato ES Modules
    entryFileNames: 'cli.es.js', // Nome do arquivo de saída
  },
  plugins: [
    resolvePlugin({
      extensions: ['.ts', '.js'], // Extensões suportadas
    }),
    commonjsPlugin(), // Converte módulos CommonJS para ESM
    typescriptPlugin({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'), // Usa o tsconfig.json do projeto
    }),
    replacePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'), // Define NODE_ENV
      preventAssignment: true,
    }),
    jsonPlugin(), // Adiciona suporte para arquivos JSON <button class="citation-flag" data-index="6">
  ],
  external: ['fs', 'fs/promises', 'fs-extra', 'perf_hooks', 'url', 'path'], // Módulos externos
}
