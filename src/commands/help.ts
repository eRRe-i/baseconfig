import { logger } from '../../logger.js'

export function showHelp(toolList: string[]) {
  logger.message(`🛠️  BaseConfig CLI Help
Usage: baseconfig [options] [tools...]

Options:
  --help      Mostra esta mensagem de ajuda.
  --version   Mostra a versão atual do CLI.

Ferramentas Suportadas:
  ${toolList.join(', ')}

Exemplos:
  $ baseconfig --help                     # Mostra esta mensagem de ajuda
  $ baseconfig --all                      # Configura todas as ferramentas disponíveis
  $ baseconfig prettier eslint            # Configura apenas as ferramentas "prettier" e "eslint"

`)
}
