import path from 'path'
import { constants } from 'fs'
import { mkdir, copyFile } from 'fs/promises'
import fs, { exists } from 'fs-extra'
import { logger } from './../../logger.js'
export class HuskyUtil {
  src
  dest
  mapping
  constructor(src, dest, mapping) {
    this.src = src
    this.dest = dest
    this.mapping = mapping
  }
  async copyHuskyFiles(tool) {
    if (!(tool in this.mapping)) {
      return undefined
    }
    try {
      await fs.access(this.src)
    } catch {
      const err = new Error(`Arquivo ${this.src} origem não existe`)
      logger.error(`Erro: ${err.message}`, err)
      throw err
    }
    await mkdir(this.dest, { recursive: true }) //cria templates
    await this.createFilesFromTemplate(this.mapping, tool)
    await this.appendFiles(this.mapping, tool, 'gitignore')
    await this.appendFiles(this.mapping, tool, 'commitlint')
    await this.appendFiles(this.mapping, tool, 'pre-commit')
  }
  async createFilesFromTemplate(mapping, tool) {
    for (const file of mapping[tool].files) {
      const srcPath = path.join(this.src, file)
      const destPath = path.join(this.dest, file)
      const destDir = path.dirname(destPath)
      try {
        await mkdir(destDir, { recursive: true })
      } catch (err) {
        logger.error(`Falha ao criar diretório em "${destDir}": ${err.message}`, err)
        throw err
      }
      try {
        await copyFile(srcPath, destPath, constants.COPYFILE_EXCL)
        logger.success(`${file} copiado`)
      } catch (err) {
        if (err.code === 'EEXIST') {
          continue
        } else {
          logger.error(`Erro ao copiar o arquivo ${file}: ${err.message}`, err)
          throw err
        }
      }
    }
  }
  async appendFiles(mapping, tool, file) {
    if (!mapping[tool]?.[file]?.filePath) {
      return
    }
    const destPath = path.join(this.dest, mapping[tool]?.[file]?.filePath)
    if (await exists(destPath)) {
      if (mapping[tool]?.[file]?.content.length) {
        logger.warn(`Chamadas sucessivas de ${tool} podem levar a inconsistências em ${file}`)
      }
    }
    try {
      await fs.access(destPath)
    } catch (err) {
      logger.error(`Erro de acesso ao arquivo ${file}: ${err.message}`)
      throw err
    }
    mapping[tool]?.[file]?.content.forEach(async (value) => {
      try {
        await fs.appendFile(destPath, value)
        logger.success(`${file} atualizado`)
      } catch (err) {
        logger.error(`Erro : ${err.message}`)
        throw err
      }
    })
  }
}
