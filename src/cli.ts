import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { logger } from './../logger.js'
import fs from 'fs-extra'
import * as dotenv from 'dotenv'
import { performance } from 'perf_hooks'
import { showHelp } from 'commands/help.js'
import { setupTools } from 'commands/setup.js'

const tick = performance.now()

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Verifica se o NODE_ENV está definido
if (!process.env.NODE_ENV) {
  logger.error('Erro: NODE_ENV não está definido.')
  process.exit(1)
}

logger.debug(String(process.env.NODE_ENV))

const basePath = process.env.NODE_ENV === 'production' ? __dirname : process.cwd()

const toolList: string[] = await fs.readJson(path.resolve(basePath, 'data/toolList.json'))

const argTools = process.argv.slice(2)

if (process.argv.includes('--help')) {
  showHelp(toolList)
  process.exit(0)
}

const tools = validateTools(argTools, toolList)
await setupTools(tools)

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
