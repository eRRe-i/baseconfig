import { logger } from '../../logger.js'
import fs from 'fs-extra'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { CopyFiles } from '@utils/copyFiles.js'
import { HuskyUtil } from '@utils/copyHuskyfiles.js'
import { PackageJsonReader } from '@utils/packageJsonReader.js'

export async function setupTools(toolList: string[]) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const basePath = process.env.NODE_ENV === 'production' ? __dirname : process.cwd()
  const templatesPath = path.join(basePath, 'templates')
  const distDev = path.join(process.cwd(), process.env.NODE_ENV !== 'production' ? 'tmp' : '')

  if (!existsSync(distDev)) {
    mkdirSync(distDev, { recursive: true })
  }

  const packageJson = await fs.readJson(path.resolve(basePath, 'data/packageAttributes.json'))
  const toolMappings = await fs.readJson(path.resolve(basePath, 'data/toolMappings.json'))
  const fileMapping = await fs.readJson(path.resolve(basePath, 'data/fileMapping.json'))
  const huskyMapping = await fs.readJson(path.resolve(basePath, 'data/huskyMapping.json'))

  // Instancia as utilitárias
  const copyFilesUtil = new CopyFiles(templatesPath, distDev, fileMapping)
  const copyHuskyFiles = new HuskyUtil(templatesPath, distDev, huskyMapping)
  const packageJsonReaderUtil = new PackageJsonReader(
    packageJson,
    toolMappings,
    templatesPath,
    distDev,
  )

  for (const tool of toolList) {
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
}
