const packageJson = await import('../../package.json', { assert: { type: 'json' } })
import { logger } from '../../logger.js'

// Exibe a versão do CLI
export function showVersion() {
  logger.message(`${packageJson['name']} versão: ${packageJson['version']}`)
}
