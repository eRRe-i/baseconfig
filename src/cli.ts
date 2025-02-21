import path, { dirname } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { logger } from './../logger.js'
import fs from 'fs-extra'
import * as dotenv from 'dotenv'
import { FileMapping } from 'interfaces/fileInterface.interface.js'
import { HuskyUtil } from '@utils/copyHuskyfiles.js'
import { CopyFiles } from '@utils/copyFiles.js'
import { PackageJsonReader } from './utils/packageJsonReader.js'
import { PackageJson, ToolMappings } from './interfaces/package.interface.js'
import { performance } from 'perf_hooks'

const tick = performance.now()

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Verifica se o NODE_ENV está definido
if (!process.env.NODE_ENV) {
  logger.error('Erro: NODE_ENV não está definido.')
  process.exit(1)
}

const isDev = process.env.NODE_ENV !== 'production'
const templatesPath = path.join(__dirname, '..', 'templates')
const distDev = path.join(process.cwd(), isDev ? 'tmp' : '')
if (isDev && !existsSync(distDev)) {
  mkdirSync(distDev, { recursive: true })
}

// Caminho para os templates
// Lê os arquivos JSON
const packageJson: PackageJson = await fs.readJson(
  path.resolve(__dirname, 'data/packageAttributes.json'),
)
const toolMappings: ToolMappings = await fs.readJson(
  path.resolve(__dirname, 'data/toolMappings.json'),
)
const fileMapping: FileMapping = await fs.readJson(path.resolve(__dirname, 'data/fileMapping.json'))
const toolList: string[] = await fs.readJson(path.resolve(__dirname, 'data/toolList.json'))
const huskyMapping = await fs.readJson(path.resolve(__dirname, 'data/huskyMapping.json'))

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

function validateTools(argTools: string[], toolList: string[]) {
  if (argTools.length === 0) {
    return toolList
  } else {
    argTools.forEach((tool: string) => {
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
