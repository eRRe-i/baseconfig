import { copyFile, mkdir } from 'fs/promises'
import path from 'path'

import { FileMapping } from 'interfaces/fileInterface.interface.js'

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
      throw new Error('Caminho de origem não especificado.')
    }
    if (!this.dest) {
      throw new Error('Caminho de destino não especificado.')
    }
    if (!tool) {
      throw new Error('Nenhuma ferramenta especificada.')
    }

    const mapping = this.fileMapping[tool]

    await mkdir(this.dest, { recursive: true })

    for (const file of mapping) {
      if (!file) {
        throw new Error('Nome do arquivo não especificado.')
      }

      const srcPath = path.join(this.src, tool, file)
      const destPath = path.join(this.dest, file)

      const destDir = path.dirname(destPath)

      try {
        await mkdir(destDir, { recursive: true })

        await copyFile(srcPath, destPath)
        console.log(`✅ Arquivo "${file}" copiado com sucesso para ${destPath}.`)
      } catch (err) {
        throw new Error(`❌ Falha ao copiar o arquivo "${file}": ${err.message}`)
      }
    }
  }
}
