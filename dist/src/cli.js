#!/usr/bin/env node
import path, { dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { logger } from '../logger.js'
import fs from 'fs-extra'
import * as dotenv from 'dotenv'
import { HuskyUtil } from './utils/copyHuskyfiles.js'
import { CopyFiles } from './utils/copyFiles.js'
import { PackageJsonReader } from './utils/packageJsonReader.js'
import { performance } from 'perf_hooks'
const tick = performance.now()
dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// logger.debug(__dirname)
const distDev = path.join(process.cwd(), '')
if (!existsSync(distDev)) {
  mkdirSync(distDev, { recursive: true })
}
// Caminho para os templates
const templatesPath = path.join(__dirname, '..', 'templates')
// Lê os arquivos JSON
// logger.debug(process.cwd())
const packageJson = await fs.readJson(path.join(__dirname, '../data/packageAttributes.json'))
const toolMappings = await fs.readJson(path.join(__dirname, '../data/toolMappings.json'))
const fileMapping = await fs.readJson(path.join(__dirname, '../data/fileMapping.json'))
const toolList = await fs.readJson(path.join(__dirname, '../data/toolList.json'))
const huskyMapping = await fs.readJson(path.join(__dirname, '../data/huskyMapping.json'))
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
for (const tool of tools) {
  try {
    logger.message(`\n🛠️  Configurando a ferramenta "${tool}"...`)
    await copyFilesUtil.copyFilesFromTemplate(tool)
    await copyHuskyFiles.copyHuskyFiles(tool)
    await packageJsonReaderUtil.setupTool(tool)
    logger.success(`"${tool}" configurada com sucesso!`)
  } catch (err) {
    logger.error(`Erro ao processar a ferramenta "${tool}":`, err.message)
    throw err
  }
}
const tack = performance.now()
logger.clock(`${(tack - tick).toFixed(2)} ms`)
function validateTools(argTools, toolList) {
  if (argTools.length === 0) {
    return toolList
  } else {
    argTools.forEach((tool) => {
      if (!toolList.some((t) => tool === t)) {
        const err = new Error(`ferramenta ${tool} não existe na lista`)
        logger.error(`Error: ${err.message}`, err)
        throw err
      }
    })
    return argTools
  }
}
export { validateTools }
