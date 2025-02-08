import path from 'path'

import * as dotenv from 'dotenv'
import fs from 'fs-extra'

import { CopyFiles } from './utils/copyFiles.js'

dotenv.config()
const copyFilesUtil = new CopyFiles()

if (!process.env.NODE_ENV) {
  throw new Error('Erro: NODE_ENV não está definido.')
  process.exit(1)
}

const isDev = process.env.NODE_ENV !== 'production'

const distDev = path.join(process.cwd(), isDev ? 'tmp' : '')

if (isDev && !fs.existsSync(distDev)) {
  fs.mkdirSync(distDev)
}

const templatesPath = path.join(__dirname, '..', 'templates')

copyFilesUtil.copyFilesFromTemplate(
  path.join(templatesPath, 'typescript'),
  distDev,
  'tsconfig.json',
)
