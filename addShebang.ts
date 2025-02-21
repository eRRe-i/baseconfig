import * as fs from 'fs'
const filePath = './dist/cli.es.js'
import { logger } from './logger.js'

// Adiciona a shebang ao arquivo gerado
const content = fs.readFileSync(filePath, 'utf8')
fs.writeFileSync(filePath, '#!/usr/bin/env node\n' + content)
logger.success('Shebang adicionada ao arquivo:')
