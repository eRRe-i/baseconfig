import { copyFile, mkdir } from 'fs/promises'
import path from 'path'
import { FileMapping } from 'interfaces/fileInterface.interface.js'
import { logger } from '../../logger.js'

export class CopyFiles {
  private src: string
  private dest: string
  private fileMapping: FileMapping

  constructor(src: string, dest: string, fileMapping) {
    this.src = src
    this.dest = dest
    this.fileMapping = fileMapping
  }

  async copyFilesFromTemplate(tool: string): Promise<void> {
    if (!this.src) {
      const err = new Error('Caminho de origem não especificado.')
      logger.error(`Error em ${tool}: ${err.message}`, err)
      throw err
    }
    if (!this.dest) {
      const err = new Error('Caminho de destino não especificado.')
      logger.error(`Error em ${tool}: ${err.message}`, err)
      throw err
    }
    if (!tool) {
      const err = new Error('Nenhuma ferramenta especificada.')
      logger.error(`Error em ${tool}: ${err.message}`, err)
      throw err
    }

    const mapping = this.fileMapping[tool]

    await mkdir(this.dest, { recursive: true })

    for (const file of mapping) {
      if (!file) {
        const err = new Error('Nome do arquivo não especificado.')
        logger.error(`Error em ${tool}: ${err.message}`, err)
        process.exit(1)
      }

      const srcPath = path.join(this.src, tool, file)
      const destPath = path.join(this.dest, file)

      const destDir = path.dirname(destPath)

      try {
        await mkdir(destDir, { recursive: true })

        await copyFile(srcPath, destPath)
        logger.success(`${file}`)
      } catch (err) {
        logger.error(`Falha ao copiar o arquivo "${file}": ${err.message}`, err)
      }
    }
  }
}
