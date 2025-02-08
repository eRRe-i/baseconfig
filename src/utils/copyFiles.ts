import { copyFile } from 'fs/promises'
import path from 'path'

export class CopyFiles {
  constructor() {}

  copyFilesFromTemplate(src: string, dest: string, ...files: string[]) {
    if (!src) {
      throw new Error('src path not specified')
    }

    if (!dest) {
      throw new Error('dest path not specified')
    }

    if (!files.length) {
      throw new Error('files not specified')
    }

    for (const file of files) {
      if (!file) {
        throw new Error('fileName must be specified')
      }

      try {
        copyFile(path.join(src, file), path.join(dest, file))
        console.log(`✅ Arquivo de configuração ${file} copiado!`)
      } catch (err) {
        throw new Error(`❌ falha ao copiar arquivo ${file}: ${err.message}`)
      }
    }
  }
}
