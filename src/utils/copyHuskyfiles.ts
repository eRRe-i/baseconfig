import path from 'path'
import { constants } from 'fs'
import { mkdir, copyFile } from 'fs/promises'

import fs from 'fs-extra'
import { HuskyMapping } from '@interfaces/huskyMappping.interface.js'

export class HuskyUtil {
  private src: string
  private dest: string
  private mapping: HuskyMapping

  constructor(src: string, dest: string, mapping) {
    this.src = src
    this.dest = dest
    this.mapping = mapping
  }

  async copyHuskyFiles(tool: string) {
    if (!(tool in this.mapping)) {
      console.log(`No ${tool}`)
      return undefined
    }

    try {
      await fs.access(this.src)
    } catch {
      throw new Error('Arquivo de origem não existe')
    }

    await mkdir(this.dest, { recursive: true }) //cria templates

    await this.createFilesFromTemplate(this.mapping, tool)
    await this.appendFiles(this.mapping, tool, 'gitignore')
    await this.appendFiles(this.mapping, tool, 'commitlint')
    await this.appendFiles(this.mapping, tool, 'pre-commit')
  }

  async createFilesFromTemplate(mapping, tool: string) {
    for (const file of mapping[tool].files) {
      const srcPath = path.join(this.src, file)
      const destPath = path.join(this.dest, file)
      // console.log(srcPath)
      // console.log(destPath)
      const destDir = path.dirname(destPath)
      try {
        await mkdir(destDir, { recursive: true })
      } catch (err) {
        throw new Error(`Falha ao criar diretório "${destDir}": ${err.message}`)
      }
      try {
        await copyFile(srcPath, destPath, constants.COPYFILE_EXCL)
        console.log(`✅ "${file}"`)
      } catch (err) {
        console.log(`❌ Falha ao copiar o arquivo "${file}": ${err.message}`)
      }
    }
  }
  async appendFiles(mapping, tool: string, file: string) {
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
      await fs.access(destPath) // Verifica se o arquivo existe
    } catch (err) {
      throw new Error(`Arquivo de destino não existe: : ${err.message}`)
    }
    mapping[tool]?.[file]?.content.forEach(async (value) => {
      try {
        await fs.appendFile(destPath, value)
        console.log(`✅ "${file} atualizado"`)
      } catch (err) {
        throw new Error(`Arquivo de destino não existe: : ${err.message}`)
      }
    })
  }
}
