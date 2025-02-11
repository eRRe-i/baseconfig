#!/usr/bin/env node

import path, { dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'

import fs from 'fs-extra'
import * as dotenv from 'dotenv'
import { FileMapping } from 'interfaces/fileInterface.interface.js'
import { HuskyUtil } from '@utils/copyHuskyfiles.js'
import { CopyFiles } from '@utils/copyFiles.js'

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

const isDev = process.env.NODE_ENV !== 'production'
const distDev = path.join(process.cwd(), isDev ? 'tmp' : '')

if (isDev && !existsSync(distDev)) {
  mkdirSync(distDev, { recursive: true })
}

// Caminho para os templates
const templatesPath = path.join(__dirname, '..', 'templates')

// Lê os arquivos JSON
const packageJson: PackageJson = await fs.readJson('./data/packageAttributes.json')
const toolMappings: ToolMappings = await fs.readJson('./data/toolMappings.json')
const fileMapping: FileMapping = await fs.readJson('./data/fileMapping.json')
const toolList: string[] = await fs.readJson('./data/toolList.json')
const huskyMapping = await fs.readJson('./data/huskyMapping.json')

// Instancia as utilitárias
const copyFilesUtil = new CopyFiles(templatesPath, distDev, fileMapping)
const copyHuskyFiles = new HuskyUtil(templatesPath, distDev, huskyMapping)

const packageJsonReaderUtil = new PackageJsonReader(
  packageJson,
  toolMappings,
  templatesPath,
  distDev,
)

const argTools = process.argv.slice(2)

const tools = validateTools(argTools, toolList)

// Processa cada ferramenta
for (const tool of tools) {
  try {
    console.log(`\n🛠️  Configurando a ferramenta "${tool}"...`)

    // Copia os arquivos do template para o diretório de destino
    await copyFilesUtil.copyFilesFromTemplate(tool)

    await copyHuskyFiles.copyHuskyFiles(tool)

    // Configura o package.json com as dependências e scripts da ferramenta
    await packageJsonReaderUtil.setupTool(tool)

    console.log(`✅ Ferramenta "${tool}" configurada com sucesso!`)
  } catch (err) {
    console.error(`❌ Erro ao processar a ferramenta "${tool}":`, err.message)
  }
}

function validateTools(argTools: string[], toolList: string[]) {
  if (!argTools) {
    return toolList
  } else {
    argTools.forEach((tool: string) => {
      if (!toolList.some((t) => tool === t)) {
        throw new Error(`ferramenta ${tool} não existe na lista`)
      }
    })
    return argTools
  }
}

export { validateTools }
