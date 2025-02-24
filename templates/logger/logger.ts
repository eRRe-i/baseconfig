import winston from 'winston'

class Logger {
  private logger: winston.Logger

  constructor() {
    // Cores customizadas para cada nível
    const colors = {
      error: 'red',
      warn: 'yellow',
      success: 'green',
      info: 'cyan',
      debug: 'magenta',
      clock: 'gray', // Adicionei uma cor para o nível "clock"
    }

    winston.addColors(colors)

    const consoleFormat = winston.format.combine(
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.colorize({ all: true }),
      winston.format.printf(({ level, message }) => {
        const emojiMap = {
          error: '❌',
          warn: '⚠️ ',
          success: '✅',
          debug: '🐛',
          clock: '⏱️ ', // Emoji para o nível "clock"
        }

        // Remove códigos de cores para mapear corretamente o nível
        // eslint-disable-next-line no-control-regex
        const cleanLevel = level.replace(/\x1B\[\d+m/g, '')
        const emoji = emojiMap[cleanLevel] || ''
        return `${emoji} ${message}`
      }),
    )

    this.logger = winston.createLogger({
      levels: {
        error: 0,
        warn: 1,
        success: 2,
        info: 3,
        debug: 4,
        clock: 5, // Nível personalizado para logs de tempo
      },
      level: process.env.NODE_ENV === 'production' ? 'info' : 'clock',
      transports: [
        new winston.transports.Console({
          format: consoleFormat, // Usa o mesmo formato para todos os níveis
        }),
      ],
    })
  }

  success(message: string, meta: object = {}) {
    this.logger.log({ level: 'success', message, meta })
  }

  info(message: string, meta: object = {}) {
    this.logger.info(message, meta)
  }

  error(message: string, error?: Error, meta: object = {}) {
    this.logger.error(message, {
      ...meta,
      errorMessage: error?.message,
      stack: error?.stack,
    })
  }

  debug(message: string, meta: object = {}) {
    this.logger.debug(message, meta)
  }

  warn(message: string, meta: object = {}) {
    this.logger.warn(message, meta)
  }

  clock(message: string, meta: object = {}) {
    this.logger.log({ level: 'clock', message, meta })
  }

  message(message: string) {
    this.logger.log({ level: 'info', message })
  }
}

export const logger = new Logger()
