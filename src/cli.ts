#!/usr/bin/env node

import path, { dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'

import fs from 'fs-extra'
import * as dotenv from 'dotenv'
import { FileMapping } from 'interfaces/fileInterface.interface.js'

import { CopyFiles } from './utils/copyFiles.js'
import { PackageJsonReader } from './utils/packageJsonReader.js'
import { PackageJson, ToolMappings } from './interfaces/package.interface.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Verifica se o NODE_ENV está definido
if (!process.env.NODE_ENV) {
  console.error('Erro: NODE_ENV não está definido.')
  process.exit(1)
}

// Define se está em modo de desenvolvimento
const isDev = process.env.NODE_ENV !== 'production'

// Caminho de destino (tmp/ em desenvolvimento, raiz em produção)
const distDev = path.join(process.cwd(), isDev ? 'tmp' : '')

// Cria o diretório de destino se não existir
if (isDev && !existsSync(distDev)) {
  mkdirSync(distDev, { recursive: true })
}

// Caminho para os templates
const templatesPath = path.join(__dirname, '..', 'templates')

// Verifica se as ferramentas foram passadas como argumento
if (process.argv.length < 3) {
  console.error('Erro: Nenhuma ferramenta especificada.')
  console.log('Uso: meu-cli <ferramenta1> <ferramenta2> ...')
  process.exit(1)
}

// Lê os arquivos JSON
const packageJson: PackageJson = await fs.readJson('./data/packageAttributes.json')
const toolMappings: ToolMappings = await fs.readJson('./data/toolMappings.json')
const fileMapping: FileMapping = await fs.readJson('./data/fileMapping.json')

// Instancia as utilitárias
const copyFilesUtil = new CopyFiles(templatesPath, distDev, fileMapping)
const packageJsonReaderUtil = new PackageJsonReader(
  packageJson,
  toolMappings,
  templatesPath,
  distDev,
)

// Obtém as ferramentas a partir dos argumentos da linha de comando
const tools = process.argv.slice(2) // Pega todos os argumentos a partir do índice 2

// Processa cada ferramenta
for (const tool of tools) {
  try {
    console.log(`\n🛠️  Configurando a ferramenta "${tool}"...`)

    // Copia os arquivos do template para o diretório de destino
    await copyFilesUtil.copyFilesFromTemplate(tool)

    // Configura o package.json com as dependências e scripts da ferramenta
    await packageJsonReaderUtil.setupTool(tool)

    console.log(`✅ Ferramenta "${tool}" configurada com sucesso!`)
  } catch (err) {
    console.error(`❌ Erro ao processar a ferramenta "${tool}":`, err.message)
  }
}
