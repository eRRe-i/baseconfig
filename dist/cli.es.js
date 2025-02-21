#!/usr/bin/env node
import path, { dirname } from 'path'
import require$$0$6, { constants } from 'fs'
import { fileURLToPath } from 'url'
import require$$0$2 from 'util'
import require$$0$1 from 'os'
import require$$0$3 from 'stream'
import require$$0$4 from 'buffer'
import require$$0$5 from 'events'
import require$$3 from 'zlib'
import 'tty'
import require$$1 from 'string_decoder'
import require$$0$7 from 'http'
import require$$1$1 from 'https'
import fs, { exists } from 'fs-extra'
import require$$3$1 from 'crypto'
import { mkdir, copyFile } from 'fs/promises'
import { performance } from 'perf_hooks'

var commonjsGlobal =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
        ? global
        : typeof self !== 'undefined'
          ? self
          : {}

function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x
}

function getAugmentedNamespace(n) {
  if (n.__esModule) return n
  var f = n.default
  if (typeof f == 'function') {
    var a = function a() {
      if (this instanceof a) {
        return Reflect.construct(f, arguments, this.constructor)
      }
      return f.apply(this, arguments)
    }
    a.prototype = f.prototype
  } else a = {}
  Object.defineProperty(a, '__esModule', { value: true })
  Object.keys(n).forEach(function (k) {
    var d = Object.getOwnPropertyDescriptor(n, k)
    Object.defineProperty(
      a,
      k,
      d.get
        ? d
        : {
            enumerable: true,
            get: function () {
              return n[k]
            },
          },
    )
  })
  return a
}

var winston$1 = {}

var logform = {}

var format$1
var hasRequiredFormat

function requireFormat() {
  if (hasRequiredFormat) return format$1
  hasRequiredFormat = 1

  /*
   * Displays a helpful message and the source of
   * the format when it is invalid.
   */
  class InvalidFormatError extends Error {
    constructor(formatFn) {
      super(`Format functions must be synchronous taking a two arguments: (info, opts)
Found: ${formatFn.toString().split('\n')[0]}\n`)

      Error.captureStackTrace(this, InvalidFormatError)
    }
  }

  /*
   * function format (formatFn)
   * Returns a create function for the `formatFn`.
   */
  format$1 = (formatFn) => {
    if (formatFn.length > 2) {
      throw new InvalidFormatError(formatFn)
    }

    /*
     * function Format (options)
     * Base prototype which calls a `_format`
     * function and pushes the result.
     */
    function Format(options = {}) {
      this.options = options
    }

    Format.prototype.transform = formatFn

    //
    // Create a function which returns new instances of
    // FormatWrap for simple syntax like:
    //
    // require('winston').formats.json();
    //
    function createFormatWrap(opts) {
      return new Format(opts)
    }

    //
    // Expose the FormatWrap through the create function
    // for testability.
    //
    createFormatWrap.Format = Format
    return createFormatWrap
  }
  return format$1
}

var colorize = { exports: {} }

var safe = { exports: {} }

var colors = { exports: {} }

var styles = { exports: {} }

/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var hasRequiredStyles

function requireStyles() {
  if (hasRequiredStyles) return styles.exports
  hasRequiredStyles = 1
  ;(function (module) {
    var styles = {}
    module['exports'] = styles

    var codes = {
      reset: [0, 0],

      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29],

      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      gray: [90, 39],
      grey: [90, 39],

      brightRed: [91, 39],
      brightGreen: [92, 39],
      brightYellow: [93, 39],
      brightBlue: [94, 39],
      brightMagenta: [95, 39],
      brightCyan: [96, 39],
      brightWhite: [97, 39],

      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      bgGray: [100, 49],
      bgGrey: [100, 49],

      bgBrightRed: [101, 49],
      bgBrightGreen: [102, 49],
      bgBrightYellow: [103, 49],
      bgBrightBlue: [104, 49],
      bgBrightMagenta: [105, 49],
      bgBrightCyan: [106, 49],
      bgBrightWhite: [107, 49],

      // legacy styles for colors pre v1.0.0
      blackBG: [40, 49],
      redBG: [41, 49],
      greenBG: [42, 49],
      yellowBG: [43, 49],
      blueBG: [44, 49],
      magentaBG: [45, 49],
      cyanBG: [46, 49],
      whiteBG: [47, 49],
    }

    Object.keys(codes).forEach(function (key) {
      var val = codes[key]
      var style = (styles[key] = [])
      style.open = '\u001b[' + val[0] + 'm'
      style.close = '\u001b[' + val[1] + 'm'
    })
  })(styles)
  return styles.exports
}

/*
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var hasFlag
var hasRequiredHasFlag

function requireHasFlag() {
  if (hasRequiredHasFlag) return hasFlag
  hasRequiredHasFlag = 1

  hasFlag = function (flag, argv) {
    argv = argv || process.argv || []

    var terminatorPos = argv.indexOf('--')
    var prefix = /^-{1,2}/.test(flag) ? '' : '--'
    var pos = argv.indexOf(prefix + flag)

    return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos)
  }
  return hasFlag
}

/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var supportsColors
var hasRequiredSupportsColors

function requireSupportsColors() {
  if (hasRequiredSupportsColors) return supportsColors
  hasRequiredSupportsColors = 1

  var os = require$$0$1
  var hasFlag = requireHasFlag()

  var env = process.env

  var forceColor = void 0
  if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false')) {
    forceColor = false
  } else if (
    hasFlag('color') ||
    hasFlag('colors') ||
    hasFlag('color=true') ||
    hasFlag('color=always')
  ) {
    forceColor = true
  }
  if ('FORCE_COLOR' in env) {
    forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0
  }

  function translateLevel(level) {
    if (level === 0) {
      return false
    }

    return {
      level: level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3,
    }
  }

  function supportsColor(stream) {
    if (forceColor === false) {
      return 0
    }

    if (hasFlag('color=16m') || hasFlag('color=full') || hasFlag('color=truecolor')) {
      return 3
    }

    if (hasFlag('color=256')) {
      return 2
    }

    if (stream && !stream.isTTY && forceColor !== true) {
      return 0
    }

    var min = forceColor ? 1 : 0

    if (process.platform === 'win32') {
      // Node.js 7.5.0 is the first version of Node.js to include a patch to
      // libuv that enables 256 color output on Windows. Anything earlier and it
      // won't work. However, here we target Node.js 8 at minimum as it is an LTS
      // release, and Node.js 7 is not. Windows 10 build 10586 is the first
      // Windows release that supports 256 colors. Windows 10 build 14931 is the
      // first release that supports 16m/TrueColor.
      var osRelease = os.release().split('.')
      if (
        Number(process.versions.node.split('.')[0]) >= 8 &&
        Number(osRelease[0]) >= 10 &&
        Number(osRelease[2]) >= 10586
      ) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2
      }

      return 1
    }

    if ('CI' in env) {
      if (
        ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(function (sign) {
          return sign in env
        }) ||
        env.CI_NAME === 'codeship'
      ) {
        return 1
      }

      return min
    }

    if ('TEAMCITY_VERSION' in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0
    }

    if ('TERM_PROGRAM' in env) {
      var version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10)

      switch (env.TERM_PROGRAM) {
        case 'iTerm.app':
          return version >= 3 ? 3 : 2
        case 'Hyper':
          return 3
        case 'Apple_Terminal':
          return 2
        // No default
      }
    }

    if (/-256(color)?$/i.test(env.TERM)) {
      return 2
    }

    if (/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
      return 1
    }

    if ('COLORTERM' in env) {
      return 1
    }

    if (env.TERM === 'dumb') {
      return min
    }

    return min
  }

  function getSupportLevel(stream) {
    var level = supportsColor(stream)
    return translateLevel(level)
  }

  supportsColors = {
    supportsColor: getSupportLevel,
    stdout: getSupportLevel(process.stdout),
    stderr: getSupportLevel(process.stderr),
  }
  return supportsColors
}

var trap = { exports: {} }

var hasRequiredTrap

function requireTrap() {
  if (hasRequiredTrap) return trap.exports
  hasRequiredTrap = 1
  ;(function (module) {
    module['exports'] = function runTheTrap(text, options) {
      var result = ''
      text = text || 'Run the trap, drop the bass'
      text = text.split('')
      var trap = {
        a: ['\u0040', '\u0104', '\u023a', '\u0245', '\u0394', '\u039b', '\u0414'],
        b: ['\u00df', '\u0181', '\u0243', '\u026e', '\u03b2', '\u0e3f'],
        c: ['\u00a9', '\u023b', '\u03fe'],
        d: ['\u00d0', '\u018a', '\u0500', '\u0501', '\u0502', '\u0503'],
        e: ['\u00cb', '\u0115', '\u018e', '\u0258', '\u03a3', '\u03be', '\u04bc', '\u0a6c'],
        f: ['\u04fa'],
        g: ['\u0262'],
        h: ['\u0126', '\u0195', '\u04a2', '\u04ba', '\u04c7', '\u050a'],
        i: ['\u0f0f'],
        j: ['\u0134'],
        k: ['\u0138', '\u04a0', '\u04c3', '\u051e'],
        l: ['\u0139'],
        m: ['\u028d', '\u04cd', '\u04ce', '\u0520', '\u0521', '\u0d69'],
        n: ['\u00d1', '\u014b', '\u019d', '\u0376', '\u03a0', '\u048a'],
        o: [
          '\u00d8',
          '\u00f5',
          '\u00f8',
          '\u01fe',
          '\u0298',
          '\u047a',
          '\u05dd',
          '\u06dd',
          '\u0e4f',
        ],
        p: ['\u01f7', '\u048e'],
        q: ['\u09cd'],
        r: ['\u00ae', '\u01a6', '\u0210', '\u024c', '\u0280', '\u042f'],
        s: ['\u00a7', '\u03de', '\u03df', '\u03e8'],
        t: ['\u0141', '\u0166', '\u0373'],
        u: ['\u01b1', '\u054d'],
        v: ['\u05d8'],
        w: ['\u0428', '\u0460', '\u047c', '\u0d70'],
        x: ['\u04b2', '\u04fe', '\u04fc', '\u04fd'],
        y: ['\u00a5', '\u04b0', '\u04cb'],
        z: ['\u01b5', '\u0240'],
      }
      text.forEach(function (c) {
        c = c.toLowerCase()
        var chars = trap[c] || [' ']
        var rand = Math.floor(Math.random() * chars.length)
        if (typeof trap[c] !== 'undefined') {
          result += trap[c][rand]
        } else {
          result += c
        }
      })
      return result
    }
  })(trap)
  return trap.exports
}

var zalgo = { exports: {} }

var hasRequiredZalgo

function requireZalgo() {
  if (hasRequiredZalgo) return zalgo.exports
  hasRequiredZalgo = 1
  ;(function (module) {
    // please no
    module['exports'] = function zalgo(text, options) {
      text = text || '   he is here   '
      var soul = {
        up: [
          '̍',
          '̎',
          '̄',
          '̅',
          '̿',
          '̑',
          '̆',
          '̐',
          '͒',
          '͗',
          '͑',
          '̇',
          '̈',
          '̊',
          '͂',
          '̓',
          '̈',
          '͊',
          '͋',
          '͌',
          '̃',
          '̂',
          '̌',
          '͐',
          '̀',
          '́',
          '̋',
          '̏',
          '̒',
          '̓',
          '̔',
          '̽',
          '̉',
          'ͣ',
          'ͤ',
          'ͥ',
          'ͦ',
          'ͧ',
          'ͨ',
          'ͩ',
          'ͪ',
          'ͫ',
          'ͬ',
          'ͭ',
          'ͮ',
          'ͯ',
          '̾',
          '͛',
          '͆',
          '̚',
        ],
        down: [
          '̖',
          '̗',
          '̘',
          '̙',
          '̜',
          '̝',
          '̞',
          '̟',
          '̠',
          '̤',
          '̥',
          '̦',
          '̩',
          '̪',
          '̫',
          '̬',
          '̭',
          '̮',
          '̯',
          '̰',
          '̱',
          '̲',
          '̳',
          '̹',
          '̺',
          '̻',
          '̼',
          'ͅ',
          '͇',
          '͈',
          '͉',
          '͍',
          '͎',
          '͓',
          '͔',
          '͕',
          '͖',
          '͙',
          '͚',
          '̣',
        ],
        mid: [
          '̕',
          '̛',
          '̀',
          '́',
          '͘',
          '̡',
          '̢',
          '̧',
          '̨',
          '̴',
          '̵',
          '̶',
          '͜',
          '͝',
          '͞',
          '͟',
          '͠',
          '͢',
          '̸',
          '̷',
          '͡',
          ' ҉',
        ],
      }
      var all = [].concat(soul.up, soul.down, soul.mid)

      function randomNumber(range) {
        var r = Math.floor(Math.random() * range)
        return r
      }

      function isChar(character) {
        var bool = false
        all.filter(function (i) {
          bool = i === character
        })
        return bool
      }

      function heComes(text, options) {
        var result = ''
        var counts
        var l
        options = options || {}
        options['up'] = typeof options['up'] !== 'undefined' ? options['up'] : true
        options['mid'] = typeof options['mid'] !== 'undefined' ? options['mid'] : true
        options['down'] = typeof options['down'] !== 'undefined' ? options['down'] : true
        options['size'] = typeof options['size'] !== 'undefined' ? options['size'] : 'maxi'
        text = text.split('')
        for (l in text) {
          if (isChar(l)) {
            continue
          }
          result = result + text[l]
          counts = { up: 0, down: 0, mid: 0 }
          switch (options.size) {
            case 'mini':
              counts.up = randomNumber(8)
              counts.mid = randomNumber(2)
              counts.down = randomNumber(8)
              break
            case 'maxi':
              counts.up = randomNumber(16) + 3
              counts.mid = randomNumber(4) + 1
              counts.down = randomNumber(64) + 3
              break
            default:
              counts.up = randomNumber(8) + 1
              counts.mid = randomNumber(6) / 2
              counts.down = randomNumber(8) + 1
              break
          }

          var arr = ['up', 'mid', 'down']
          for (var d in arr) {
            var index = arr[d]
            for (var i = 0; i <= counts[index]; i++) {
              if (options[index]) {
                result = result + soul[index][randomNumber(soul[index].length)]
              }
            }
          }
        }
        return result
      }
      // don't summon him
      return heComes(text, options)
    }
  })(zalgo)
  return zalgo.exports
}

var america = { exports: {} }

var hasRequiredAmerica

function requireAmerica() {
  if (hasRequiredAmerica) return america.exports
  hasRequiredAmerica = 1
  ;(function (module) {
    module['exports'] = function (colors) {
      return function (letter, i, exploded) {
        if (letter === ' ') return letter
        switch (i % 3) {
          case 0:
            return colors.red(letter)
          case 1:
            return colors.white(letter)
          case 2:
            return colors.blue(letter)
        }
      }
    }
  })(america)
  return america.exports
}

var zebra = { exports: {} }

var hasRequiredZebra

function requireZebra() {
  if (hasRequiredZebra) return zebra.exports
  hasRequiredZebra = 1
  ;(function (module) {
    module['exports'] = function (colors) {
      return function (letter, i, exploded) {
        return i % 2 === 0 ? letter : colors.inverse(letter)
      }
    }
  })(zebra)
  return zebra.exports
}

var rainbow = { exports: {} }

var hasRequiredRainbow

function requireRainbow() {
  if (hasRequiredRainbow) return rainbow.exports
  hasRequiredRainbow = 1
  ;(function (module) {
    module['exports'] = function (colors) {
      // RoY G BiV
      var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta']
      return function (letter, i, exploded) {
        if (letter === ' ') {
          return letter
        } else {
          return colors[rainbowColors[i++ % rainbowColors.length]](letter)
        }
      }
    }
  })(rainbow)
  return rainbow.exports
}

var random = { exports: {} }

var hasRequiredRandom

function requireRandom() {
  if (hasRequiredRandom) return random.exports
  hasRequiredRandom = 1
  ;(function (module) {
    module['exports'] = function (colors) {
      var available = [
        'underline',
        'inverse',
        'grey',
        'yellow',
        'red',
        'green',
        'blue',
        'white',
        'cyan',
        'magenta',
        'brightYellow',
        'brightRed',
        'brightGreen',
        'brightBlue',
        'brightWhite',
        'brightCyan',
        'brightMagenta',
      ]
      return function (letter, i, exploded) {
        return letter === ' '
          ? letter
          : colors[available[Math.round(Math.random() * (available.length - 2))]](letter)
      }
    }
  })(random)
  return random.exports
}

/*

The MIT License (MIT)

Original Library
  - Copyright (c) Marak Squires

Additional functionality
 - Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var hasRequiredColors

function requireColors() {
  if (hasRequiredColors) return colors.exports
  hasRequiredColors = 1
  ;(function (module) {
    var colors = {}
    module['exports'] = colors

    colors.themes = {}

    var util = require$$0$2
    var ansiStyles = (colors.styles = requireStyles())
    var defineProps = Object.defineProperties
    var newLineRegex = new RegExp(/[\r\n]+/g)

    colors.supportsColor = requireSupportsColors().supportsColor

    if (typeof colors.enabled === 'undefined') {
      colors.enabled = colors.supportsColor() !== false
    }

    colors.enable = function () {
      colors.enabled = true
    }

    colors.disable = function () {
      colors.enabled = false
    }

    colors.stripColors = colors.strip = function (str) {
      return ('' + str).replace(/\x1B\[\d+m/g, '')
    }

    // eslint-disable-next-line no-unused-vars
    colors.stylize = function stylize(str, style) {
      if (!colors.enabled) {
        return str + ''
      }

      var styleMap = ansiStyles[style]

      // Stylize should work for non-ANSI styles, too
      if (!styleMap && style in colors) {
        // Style maps like trap operate as functions on strings;
        // they don't have properties like open or close.
        return colors[style](str)
      }

      return styleMap.open + str + styleMap.close
    }

    var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g
    var escapeStringRegexp = function (str) {
      if (typeof str !== 'string') {
        throw new TypeError('Expected a string')
      }
      return str.replace(matchOperatorsRe, '\\$&')
    }

    function build(_styles) {
      var builder = function builder() {
        return applyStyle.apply(builder, arguments)
      }
      builder._styles = _styles
      // __proto__ is used because we must return a function, but there is
      // no way to create a function with a different prototype.
      builder.__proto__ = proto
      return builder
    }

    var styles = (function () {
      var ret = {}
      ansiStyles.grey = ansiStyles.gray
      Object.keys(ansiStyles).forEach(function (key) {
        ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g')
        ret[key] = {
          get: function () {
            return build(this._styles.concat(key))
          },
        }
      })
      return ret
    })()

    var proto = defineProps(function colors() {}, styles)

    function applyStyle() {
      var args = Array.prototype.slice.call(arguments)

      var str = args
        .map(function (arg) {
          // Use weak equality check so we can colorize null/undefined in safe mode
          if (arg != null && arg.constructor === String) {
            return arg
          } else {
            return util.inspect(arg)
          }
        })
        .join(' ')

      if (!colors.enabled || !str) {
        return str
      }

      var newLinesPresent = str.indexOf('\n') != -1

      var nestedStyles = this._styles

      var i = nestedStyles.length
      while (i--) {
        var code = ansiStyles[nestedStyles[i]]
        str = code.open + str.replace(code.closeRe, code.open) + code.close
        if (newLinesPresent) {
          str = str.replace(newLineRegex, function (match) {
            return code.close + match + code.open
          })
        }
      }

      return str
    }

    colors.setTheme = function (theme) {
      if (typeof theme === 'string') {
        console.log(
          'colors.setTheme now only accepts an object, not a string.  ' +
            'If you are trying to set a theme from a file, it is now your (the ' +
            "caller's) responsibility to require the file.  The old syntax " +
            'looked like colors.setTheme(__dirname + ' +
            "'/../themes/generic-logging.js'); The new syntax looks like " +
            'colors.setTheme(require(__dirname + ' +
            "'/../themes/generic-logging.js'));",
        )
        return
      }
      for (var style in theme) {
        ;(function (style) {
          colors[style] = function (str) {
            if (typeof theme[style] === 'object') {
              var out = str
              for (var i in theme[style]) {
                out = colors[theme[style][i]](out)
              }
              return out
            }
            return colors[theme[style]](str)
          }
        })(style)
      }
    }

    function init() {
      var ret = {}
      Object.keys(styles).forEach(function (name) {
        ret[name] = {
          get: function () {
            return build([name])
          },
        }
      })
      return ret
    }

    var sequencer = function sequencer(map, str) {
      var exploded = str.split('')
      exploded = exploded.map(map)
      return exploded.join('')
    }

    // custom formatter methods
    colors.trap = requireTrap()
    colors.zalgo = requireZalgo()

    // maps
    colors.maps = {}
    colors.maps.america = requireAmerica()(colors)
    colors.maps.zebra = requireZebra()(colors)
    colors.maps.rainbow = requireRainbow()(colors)
    colors.maps.random = requireRandom()(colors)

    for (var map in colors.maps) {
      ;(function (map) {
        colors[map] = function (str) {
          return sequencer(colors.maps[map], str)
        }
      })(map)
    }

    defineProps(colors, init())
  })(colors)
  return colors.exports
}

var hasRequiredSafe

function requireSafe() {
  if (hasRequiredSafe) return safe.exports
  hasRequiredSafe = 1
  ;(function (module) {
    //
    // Remark: Requiring this file will use the "safe" colors API,
    // which will not touch String.prototype.
    //
    //   var colors = require('colors/safe');
    //   colors.red("foo")
    //
    //
    var colors = requireColors()
    module['exports'] = colors
  })(safe)
  return safe.exports
}

var tripleBeam = {}

var config$1 = {}

var cli$1 = {}

/**
 * cli.js: Config that conform to commonly used CLI logging levels.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var hasRequiredCli$1

function requireCli$1() {
  if (hasRequiredCli$1) return cli$1
  hasRequiredCli$1 = 1

  /**
   * Default levels for the CLI configuration.
   * @type {Object}
   */
  cli$1.levels = {
    error: 0,
    warn: 1,
    help: 2,
    data: 3,
    info: 4,
    debug: 5,
    prompt: 6,
    verbose: 7,
    input: 8,
    silly: 9,
  }

  /**
   * Default colors for the CLI configuration.
   * @type {Object}
   */
  cli$1.colors = {
    error: 'red',
    warn: 'yellow',
    help: 'cyan',
    data: 'grey',
    info: 'green',
    debug: 'blue',
    prompt: 'grey',
    verbose: 'cyan',
    input: 'grey',
    silly: 'magenta',
  }
  return cli$1
}

var npm = {}

/**
 * npm.js: Config that conform to npm logging levels.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var hasRequiredNpm

function requireNpm() {
  if (hasRequiredNpm) return npm
  hasRequiredNpm = 1

  /**
   * Default levels for the npm configuration.
   * @type {Object}
   */
  npm.levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  }

  /**
   * Default levels for the npm configuration.
   * @type {Object}
   */
  npm.colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'green',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'magenta',
  }
  return npm
}

var syslog = {}

/**
 * syslog.js: Config that conform to syslog logging levels.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var hasRequiredSyslog

function requireSyslog() {
  if (hasRequiredSyslog) return syslog
  hasRequiredSyslog = 1

  /**
   * Default levels for the syslog configuration.
   * @type {Object}
   */
  syslog.levels = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  }

  /**
   * Default levels for the syslog configuration.
   * @type {Object}
   */
  syslog.colors = {
    emerg: 'red',
    alert: 'yellow',
    crit: 'red',
    error: 'red',
    warning: 'red',
    notice: 'yellow',
    info: 'green',
    debug: 'blue',
  }
  return syslog
}

/**
 * index.js: Default settings for all levels that winston knows about.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var hasRequiredConfig$1

function requireConfig$1() {
  if (hasRequiredConfig$1) return config$1
  hasRequiredConfig$1 = 1
  ;(function (exports) {
    /**
     * Export config set for the CLI.
     * @type {Object}
     */
    Object.defineProperty(exports, 'cli', {
      value: requireCli$1(),
    })

    /**
     * Export config set for npm.
     * @type {Object}
     */
    Object.defineProperty(exports, 'npm', {
      value: requireNpm(),
    })

    /**
     * Export config set for the syslog.
     * @type {Object}
     */
    Object.defineProperty(exports, 'syslog', {
      value: requireSyslog(),
    })
  })(config$1)
  return config$1
}

var hasRequiredTripleBeam

function requireTripleBeam() {
  if (hasRequiredTripleBeam) return tripleBeam
  hasRequiredTripleBeam = 1
  ;(function (exports) {
    /**
     * A shareable symbol constant that can be used
     * as a non-enumerable / semi-hidden level identifier
     * to allow the readable level property to be mutable for
     * operations like colorization
     *
     * @type {Symbol}
     */
    Object.defineProperty(exports, 'LEVEL', {
      value: Symbol.for('level'),
    })

    /**
     * A shareable symbol constant that can be used
     * as a non-enumerable / semi-hidden message identifier
     * to allow the final message property to not have
     * side effects on another.
     *
     * @type {Symbol}
     */
    Object.defineProperty(exports, 'MESSAGE', {
      value: Symbol.for('message'),
    })

    /**
     * A shareable symbol constant that can be used
     * as a non-enumerable / semi-hidden message identifier
     * to allow the extracted splat property be hidden
     *
     * @type {Symbol}
     */
    Object.defineProperty(exports, 'SPLAT', {
      value: Symbol.for('splat'),
    })

    /**
     * A shareable object constant  that can be used
     * as a standard configuration for winston@3.
     *
     * @type {Object}
     */
    Object.defineProperty(exports, 'configs', {
      value: requireConfig$1(),
    })
  })(tripleBeam)
  return tripleBeam
}

var hasRequiredColorize

function requireColorize() {
  if (hasRequiredColorize) return colorize.exports
  hasRequiredColorize = 1

  const colors = requireSafe()
  const { LEVEL, MESSAGE } = requireTripleBeam()

  //
  // Fix colors not appearing in non-tty environments
  //
  colors.enabled = true

  /**
   * @property {RegExp} hasSpace
   * Simple regex to check for presence of spaces.
   */
  const hasSpace = /\s+/

  /*
   * Colorizer format. Wraps the `level` and/or `message` properties
   * of the `info` objects with ANSI color codes based on a few options.
   */
  class Colorizer {
    constructor(opts = {}) {
      if (opts.colors) {
        this.addColors(opts.colors)
      }

      this.options = opts
    }

    /*
     * Adds the colors Object to the set of allColors
     * known by the Colorizer
     *
     * @param {Object} colors Set of color mappings to add.
     */
    static addColors(clrs) {
      const nextColors = Object.keys(clrs).reduce((acc, level) => {
        acc[level] = hasSpace.test(clrs[level]) ? clrs[level].split(hasSpace) : clrs[level]

        return acc
      }, {})

      Colorizer.allColors = Object.assign({}, Colorizer.allColors || {}, nextColors)
      return Colorizer.allColors
    }

    /*
     * Adds the colors Object to the set of allColors
     * known by the Colorizer
     *
     * @param {Object} colors Set of color mappings to add.
     */
    addColors(clrs) {
      return Colorizer.addColors(clrs)
    }

    /*
     * function colorize (lookup, level, message)
     * Performs multi-step colorization using @colors/colors/safe
     */
    colorize(lookup, level, message) {
      if (typeof message === 'undefined') {
        message = level
      }

      //
      // If the color for the level is just a string
      // then attempt to colorize the message with it.
      //
      if (!Array.isArray(Colorizer.allColors[lookup])) {
        return colors[Colorizer.allColors[lookup]](message)
      }

      //
      // If it is an Array then iterate over that Array, applying
      // the colors function for each item.
      //
      for (let i = 0, len = Colorizer.allColors[lookup].length; i < len; i++) {
        message = colors[Colorizer.allColors[lookup][i]](message)
      }

      return message
    }

    /*
     * function transform (info, opts)
     * Attempts to colorize the { level, message } of the given
     * `logform` info object.
     */
    transform(info, opts) {
      if (opts.all && typeof info[MESSAGE] === 'string') {
        info[MESSAGE] = this.colorize(info[LEVEL], info.level, info[MESSAGE])
      }

      if (opts.level || opts.all || !opts.message) {
        info.level = this.colorize(info[LEVEL], info.level)
      }

      if (opts.all || opts.message) {
        info.message = this.colorize(info[LEVEL], info.level, info.message)
      }

      return info
    }
  }

  /*
   * function colorize (info)
   * Returns a new instance of the colorize Format that applies
   * level colors to `info` objects. This was previously exposed
   * as { colorize: true } to transports in `winston < 3.0.0`.
   */
  colorize.exports = (opts) => new Colorizer(opts)

  //
  // Attach the Colorizer for registration purposes
  //
  colorize.exports.Colorizer = colorize.exports.Format = Colorizer
  return colorize.exports
}

var levels
var hasRequiredLevels

function requireLevels() {
  if (hasRequiredLevels) return levels
  hasRequiredLevels = 1

  const { Colorizer } = requireColorize()

  /*
   * Simple method to register colors with a simpler require
   * path within the module.
   */
  levels = (config) => {
    Colorizer.addColors(config.colors || config)
    return config
  }
  return levels
}

var align
var hasRequiredAlign

function requireAlign() {
  if (hasRequiredAlign) return align
  hasRequiredAlign = 1

  const format = requireFormat()

  /*
   * function align (info)
   * Returns a new instance of the align Format which adds a `\t`
   * delimiter before the message to properly align it in the same place.
   * It was previously { align: true } in winston < 3.0.0
   */
  align = format((info) => {
    info.message = `\t${info.message}`
    return info
  })
  return align
}

/* eslint no-undefined: 0 */

var errors$1
var hasRequiredErrors$1

function requireErrors$1() {
  if (hasRequiredErrors$1) return errors$1
  hasRequiredErrors$1 = 1

  const format = requireFormat()
  const { LEVEL, MESSAGE } = requireTripleBeam()

  /*
   * function errors (info)
   * If the `message` property of the `info` object is an instance of `Error`,
   * replace the `Error` object its own `message` property.
   *
   * Optionally, the Error's `stack` and/or `cause` properties can also be appended to the `info` object.
   */
  errors$1 = format((einfo, { stack, cause }) => {
    if (einfo instanceof Error) {
      const info = Object.assign({}, einfo, {
        level: einfo.level,
        [LEVEL]: einfo[LEVEL] || einfo.level,
        message: einfo.message,
        [MESSAGE]: einfo[MESSAGE] || einfo.message,
      })

      if (stack) info.stack = einfo.stack
      if (cause) info.cause = einfo.cause
      return info
    }

    if (!(einfo.message instanceof Error)) return einfo

    // Assign all enumerable properties and the
    // message property from the error provided.
    const err = einfo.message
    Object.assign(einfo, err)
    einfo.message = err.message
    einfo[MESSAGE] = err.message

    // Assign the stack and/or cause if requested.
    if (stack) einfo.stack = err.stack
    if (cause) einfo.cause = err.cause
    return einfo
  })
  return errors$1
}

var cli = { exports: {} }

var padLevels = { exports: {} }

/* eslint no-unused-vars: 0 */

var hasRequiredPadLevels

function requirePadLevels() {
  if (hasRequiredPadLevels) return padLevels.exports
  hasRequiredPadLevels = 1

  const { configs, LEVEL, MESSAGE } = requireTripleBeam()

  class Padder {
    constructor(opts = { levels: configs.npm.levels }) {
      this.paddings = Padder.paddingForLevels(opts.levels, opts.filler)
      this.options = opts
    }

    /**
     * Returns the maximum length of keys in the specified `levels` Object.
     * @param  {Object} levels Set of all levels to calculate longest level against.
     * @returns {Number} Maximum length of the longest level string.
     */
    static getLongestLevel(levels) {
      const lvls = Object.keys(levels).map((level) => level.length)
      return Math.max(...lvls)
    }

    /**
     * Returns the padding for the specified `level` assuming that the
     * maximum length of all levels it's associated with is `maxLength`.
     * @param  {String} level Level to calculate padding for.
     * @param  {String} filler Repeatable text to use for padding.
     * @param  {Number} maxLength Length of the longest level
     * @returns {String} Padding string for the `level`
     */
    static paddingForLevel(level, filler, maxLength) {
      const targetLen = maxLength + 1 - level.length
      const rep = Math.floor(targetLen / filler.length)
      const padding = `${filler}${filler.repeat(rep)}`
      return padding.slice(0, targetLen)
    }

    /**
     * Returns an object with the string paddings for the given `levels`
     * using the specified `filler`.
     * @param  {Object} levels Set of all levels to calculate padding for.
     * @param  {String} filler Repeatable text to use for padding.
     * @returns {Object} Mapping of level to desired padding.
     */
    static paddingForLevels(levels, filler = ' ') {
      const maxLength = Padder.getLongestLevel(levels)
      return Object.keys(levels).reduce((acc, level) => {
        acc[level] = Padder.paddingForLevel(level, filler, maxLength)
        return acc
      }, {})
    }

    /**
     * Prepends the padding onto the `message` based on the `LEVEL` of
     * the `info`. This is based on the behavior of `winston@2` which also
     * prepended the level onto the message.
     *
     * See: https://github.com/winstonjs/winston/blob/2.x/lib/winston/logger.js#L198-L201
     *
     * @param  {Info} info Logform info object
     * @param  {Object} opts Options passed along to this instance.
     * @returns {Info} Modified logform info object.
     */
    transform(info, opts) {
      info.message = `${this.paddings[info[LEVEL]]}${info.message}`
      if (info[MESSAGE]) {
        info[MESSAGE] = `${this.paddings[info[LEVEL]]}${info[MESSAGE]}`
      }

      return info
    }
  }

  /*
   * function padLevels (info)
   * Returns a new instance of the padLevels Format which pads
   * levels to be the same length. This was previously exposed as
   * { padLevels: true } to transports in `winston < 3.0.0`.
   */
  padLevels.exports = (opts) => new Padder(opts)

  padLevels.exports.Padder = padLevels.exports.Format = Padder
  return padLevels.exports
}

var hasRequiredCli

function requireCli() {
  if (hasRequiredCli) return cli.exports
  hasRequiredCli = 1

  const { Colorizer } = requireColorize()
  const { Padder } = requirePadLevels()
  const { configs, MESSAGE } = requireTripleBeam()

  /**
   * Cli format class that handles initial state for a a separate
   * Colorizer and Padder instance.
   */
  class CliFormat {
    constructor(opts = {}) {
      if (!opts.levels) {
        opts.levels = configs.cli.levels
      }

      this.colorizer = new Colorizer(opts)
      this.padder = new Padder(opts)
      this.options = opts
    }

    /*
     * function transform (info, opts)
     * Attempts to both:
     * 1. Pad the { level }
     * 2. Colorize the { level, message }
     * of the given `logform` info object depending on the `opts`.
     */
    transform(info, opts) {
      this.colorizer.transform(this.padder.transform(info, opts), opts)

      info[MESSAGE] = `${info.level}:${info.message}`
      return info
    }
  }

  /*
   * function cli (opts)
   * Returns a new instance of the CLI format that turns a log
   * `info` object into the same format previously available
   * in `winston.cli()` in `winston < 3.0.0`.
   */
  cli.exports = (opts) => new CliFormat(opts)

  //
  // Attach the CliFormat for registration purposes
  //
  cli.exports.Format = CliFormat
  return cli.exports
}

var combine = { exports: {} }

var hasRequiredCombine

function requireCombine() {
  if (hasRequiredCombine) return combine.exports
  hasRequiredCombine = 1

  const format = requireFormat()

  /*
   * function cascade(formats)
   * Returns a function that invokes the `._format` function in-order
   * for the specified set of `formats`. In this manner we say that Formats
   * are "pipe-like", but not a pure pumpify implementation. Since there is no back
   * pressure we can remove all of the "readable" plumbing in Node streams.
   */
  function cascade(formats) {
    if (!formats.every(isValidFormat)) {
      return
    }

    return (info) => {
      let obj = info
      for (let i = 0; i < formats.length; i++) {
        obj = formats[i].transform(obj, formats[i].options)
        if (!obj) {
          return false
        }
      }

      return obj
    }
  }

  /*
   * function isValidFormat(format)
   * If the format does not define a `transform` function throw an error
   * with more detailed usage.
   */
  function isValidFormat(fmt) {
    if (typeof fmt.transform !== 'function') {
      throw new Error(
        [
          'No transform function found on format. Did you create a format instance?',
          'const myFormat = format(formatFn);',
          'const instance = myFormat();',
        ].join('\n'),
      )
    }

    return true
  }

  /*
   * function combine (info)
   * Returns a new instance of the combine Format which combines the specified
   * formats into a new format. This is similar to a pipe-chain in transform streams.
   * We choose to combine the prototypes this way because there is no back pressure in
   * an in-memory transform chain.
   */
  combine.exports = (...formats) => {
    const combinedFormat = format(cascade(formats))
    const instance = combinedFormat()
    instance.Format = combinedFormat.Format
    return instance
  }

  //
  // Export the cascade method for use in cli and other
  // combined formats that should not be assumed to be
  // singletons.
  //
  combine.exports.cascade = cascade
  return combine.exports
}

var safeStableStringify = { exports: {} }

var hasRequiredSafeStableStringify

function requireSafeStableStringify() {
  if (hasRequiredSafeStableStringify) return safeStableStringify.exports
  hasRequiredSafeStableStringify = 1
  ;(function (module, exports) {
    const { hasOwnProperty } = Object.prototype

    const stringify = configure()

    // @ts-expect-error
    stringify.configure = configure
    // @ts-expect-error
    stringify.stringify = stringify

    // @ts-expect-error
    stringify.default = stringify

    // @ts-expect-error used for named export
    exports.stringify = stringify
    // @ts-expect-error used for named export
    exports.configure = configure

    module.exports = stringify

    // eslint-disable-next-line no-control-regex
    const strEscapeSequencesRegExp = /[\u0000-\u001f\u0022\u005c\ud800-\udfff]/

    // Escape C0 control characters, double quotes, the backslash and every code
    // unit with a numeric value in the inclusive range 0xD800 to 0xDFFF.
    function strEscape(str) {
      // Some magic numbers that worked out fine while benchmarking with v8 8.0
      if (str.length < 5000 && !strEscapeSequencesRegExp.test(str)) {
        return `"${str}"`
      }
      return JSON.stringify(str)
    }

    function sort(array, comparator) {
      // Insertion sort is very efficient for small input sizes, but it has a bad
      // worst case complexity. Thus, use native array sort for bigger values.
      if (array.length > 2e2 || comparator) {
        return array.sort(comparator)
      }
      for (let i = 1; i < array.length; i++) {
        const currentValue = array[i]
        let position = i
        while (position !== 0 && array[position - 1] > currentValue) {
          array[position] = array[position - 1]
          position--
        }
        array[position] = currentValue
      }
      return array
    }

    const typedArrayPrototypeGetSymbolToStringTag = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(Object.getPrototypeOf(new Int8Array())),
      Symbol.toStringTag,
    ).get

    function isTypedArrayWithEntries(value) {
      return typedArrayPrototypeGetSymbolToStringTag.call(value) !== undefined && value.length !== 0
    }

    function stringifyTypedArray(array, separator, maximumBreadth) {
      if (array.length < maximumBreadth) {
        maximumBreadth = array.length
      }
      const whitespace = separator === ',' ? '' : ' '
      let res = `"0":${whitespace}${array[0]}`
      for (let i = 1; i < maximumBreadth; i++) {
        res += `${separator}"${i}":${whitespace}${array[i]}`
      }
      return res
    }

    function getCircularValueOption(options) {
      if (hasOwnProperty.call(options, 'circularValue')) {
        const circularValue = options.circularValue
        if (typeof circularValue === 'string') {
          return `"${circularValue}"`
        }
        if (circularValue == null) {
          return circularValue
        }
        if (circularValue === Error || circularValue === TypeError) {
          return {
            toString() {
              throw new TypeError('Converting circular structure to JSON')
            },
          }
        }
        throw new TypeError(
          'The "circularValue" argument must be of type string or the value null or undefined',
        )
      }
      return '"[Circular]"'
    }

    function getDeterministicOption(options) {
      let value
      if (hasOwnProperty.call(options, 'deterministic')) {
        value = options.deterministic
        if (typeof value !== 'boolean' && typeof value !== 'function') {
          throw new TypeError(
            'The "deterministic" argument must be of type boolean or comparator function',
          )
        }
      }
      return value === undefined ? true : value
    }

    function getBooleanOption(options, key) {
      let value
      if (hasOwnProperty.call(options, key)) {
        value = options[key]
        if (typeof value !== 'boolean') {
          throw new TypeError(`The "${key}" argument must be of type boolean`)
        }
      }
      return value === undefined ? true : value
    }

    function getPositiveIntegerOption(options, key) {
      let value
      if (hasOwnProperty.call(options, key)) {
        value = options[key]
        if (typeof value !== 'number') {
          throw new TypeError(`The "${key}" argument must be of type number`)
        }
        if (!Number.isInteger(value)) {
          throw new TypeError(`The "${key}" argument must be an integer`)
        }
        if (value < 1) {
          throw new RangeError(`The "${key}" argument must be >= 1`)
        }
      }
      return value === undefined ? Infinity : value
    }

    function getItemCount(number) {
      if (number === 1) {
        return '1 item'
      }
      return `${number} items`
    }

    function getUniqueReplacerSet(replacerArray) {
      const replacerSet = new Set()
      for (const value of replacerArray) {
        if (typeof value === 'string' || typeof value === 'number') {
          replacerSet.add(String(value))
        }
      }
      return replacerSet
    }

    function getStrictOption(options) {
      if (hasOwnProperty.call(options, 'strict')) {
        const value = options.strict
        if (typeof value !== 'boolean') {
          throw new TypeError('The "strict" argument must be of type boolean')
        }
        if (value) {
          return (value) => {
            let message = `Object can not safely be stringified. Received type ${typeof value}`
            if (typeof value !== 'function') message += ` (${value.toString()})`
            throw new Error(message)
          }
        }
      }
    }

    function configure(options) {
      options = { ...options }
      const fail = getStrictOption(options)
      if (fail) {
        if (options.bigint === undefined) {
          options.bigint = false
        }
        if (!('circularValue' in options)) {
          options.circularValue = Error
        }
      }
      const circularValue = getCircularValueOption(options)
      const bigint = getBooleanOption(options, 'bigint')
      const deterministic = getDeterministicOption(options)
      const comparator = typeof deterministic === 'function' ? deterministic : undefined
      const maximumDepth = getPositiveIntegerOption(options, 'maximumDepth')
      const maximumBreadth = getPositiveIntegerOption(options, 'maximumBreadth')

      function stringifyFnReplacer(key, parent, stack, replacer, spacer, indentation) {
        let value = parent[key]

        if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
          value = value.toJSON(key)
        }
        value = replacer.call(parent, key, value)

        switch (typeof value) {
          case 'string':
            return strEscape(value)
          case 'object': {
            if (value === null) {
              return 'null'
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue
            }

            let res = ''
            let join = ','
            const originalIndentation = indentation

            if (Array.isArray(value)) {
              if (value.length === 0) {
                return '[]'
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"'
              }
              stack.push(value)
              if (spacer !== '') {
                indentation += spacer
                res += `\n${indentation}`
                join = `,\n${indentation}`
              }
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
              let i = 0
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp = stringifyFnReplacer(
                  String(i),
                  value,
                  stack,
                  replacer,
                  spacer,
                  indentation,
                )
                res += tmp !== undefined ? tmp : 'null'
                res += join
              }
              const tmp = stringifyFnReplacer(
                String(i),
                value,
                stack,
                replacer,
                spacer,
                indentation,
              )
              res += tmp !== undefined ? tmp : 'null'
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1
                res += `${join}"... ${getItemCount(removedKeys)} not stringified"`
              }
              if (spacer !== '') {
                res += `\n${originalIndentation}`
              }
              stack.pop()
              return `[${res}]`
            }

            let keys = Object.keys(value)
            const keyLength = keys.length
            if (keyLength === 0) {
              return '{}'
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"'
            }
            let whitespace = ''
            let separator = ''
            if (spacer !== '') {
              indentation += spacer
              join = `,\n${indentation}`
              whitespace = ' '
            }
            const maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth)
            if (deterministic && !isTypedArrayWithEntries(value)) {
              keys = sort(keys, comparator)
            }
            stack.push(value)
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key = keys[i]
              const tmp = stringifyFnReplacer(key, value, stack, replacer, spacer, indentation)
              if (tmp !== undefined) {
                res += `${separator}${strEscape(key)}:${whitespace}${tmp}`
                separator = join
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth
              res += `${separator}"...":${whitespace}"${getItemCount(removedKeys)} not stringified"`
              separator = join
            }
            if (spacer !== '' && separator.length > 1) {
              res = `\n${indentation}${res}\n${originalIndentation}`
            }
            stack.pop()
            return `{${res}}`
          }
          case 'number':
            return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
          case 'boolean':
            return value === true ? 'true' : 'false'
          case 'undefined':
            return undefined
          case 'bigint':
            if (bigint) {
              return String(value)
            }
          // fallthrough
          default:
            return fail ? fail(value) : undefined
        }
      }

      function stringifyArrayReplacer(key, value, stack, replacer, spacer, indentation) {
        if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
          value = value.toJSON(key)
        }

        switch (typeof value) {
          case 'string':
            return strEscape(value)
          case 'object': {
            if (value === null) {
              return 'null'
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue
            }

            const originalIndentation = indentation
            let res = ''
            let join = ','

            if (Array.isArray(value)) {
              if (value.length === 0) {
                return '[]'
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"'
              }
              stack.push(value)
              if (spacer !== '') {
                indentation += spacer
                res += `\n${indentation}`
                join = `,\n${indentation}`
              }
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
              let i = 0
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp = stringifyArrayReplacer(
                  String(i),
                  value[i],
                  stack,
                  replacer,
                  spacer,
                  indentation,
                )
                res += tmp !== undefined ? tmp : 'null'
                res += join
              }
              const tmp = stringifyArrayReplacer(
                String(i),
                value[i],
                stack,
                replacer,
                spacer,
                indentation,
              )
              res += tmp !== undefined ? tmp : 'null'
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1
                res += `${join}"... ${getItemCount(removedKeys)} not stringified"`
              }
              if (spacer !== '') {
                res += `\n${originalIndentation}`
              }
              stack.pop()
              return `[${res}]`
            }
            stack.push(value)
            let whitespace = ''
            if (spacer !== '') {
              indentation += spacer
              join = `,\n${indentation}`
              whitespace = ' '
            }
            let separator = ''
            for (const key of replacer) {
              const tmp = stringifyArrayReplacer(
                key,
                value[key],
                stack,
                replacer,
                spacer,
                indentation,
              )
              if (tmp !== undefined) {
                res += `${separator}${strEscape(key)}:${whitespace}${tmp}`
                separator = join
              }
            }
            if (spacer !== '' && separator.length > 1) {
              res = `\n${indentation}${res}\n${originalIndentation}`
            }
            stack.pop()
            return `{${res}}`
          }
          case 'number':
            return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
          case 'boolean':
            return value === true ? 'true' : 'false'
          case 'undefined':
            return undefined
          case 'bigint':
            if (bigint) {
              return String(value)
            }
          // fallthrough
          default:
            return fail ? fail(value) : undefined
        }
      }

      function stringifyIndent(key, value, stack, spacer, indentation) {
        switch (typeof value) {
          case 'string':
            return strEscape(value)
          case 'object': {
            if (value === null) {
              return 'null'
            }
            if (typeof value.toJSON === 'function') {
              value = value.toJSON(key)
              // Prevent calling `toJSON` again.
              if (typeof value !== 'object') {
                return stringifyIndent(key, value, stack, spacer, indentation)
              }
              if (value === null) {
                return 'null'
              }
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue
            }
            const originalIndentation = indentation

            if (Array.isArray(value)) {
              if (value.length === 0) {
                return '[]'
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"'
              }
              stack.push(value)
              indentation += spacer
              let res = `\n${indentation}`
              const join = `,\n${indentation}`
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
              let i = 0
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation)
                res += tmp !== undefined ? tmp : 'null'
                res += join
              }
              const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation)
              res += tmp !== undefined ? tmp : 'null'
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1
                res += `${join}"... ${getItemCount(removedKeys)} not stringified"`
              }
              res += `\n${originalIndentation}`
              stack.pop()
              return `[${res}]`
            }

            let keys = Object.keys(value)
            const keyLength = keys.length
            if (keyLength === 0) {
              return '{}'
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"'
            }
            indentation += spacer
            const join = `,\n${indentation}`
            let res = ''
            let separator = ''
            let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth)
            if (isTypedArrayWithEntries(value)) {
              res += stringifyTypedArray(value, join, maximumBreadth)
              keys = keys.slice(value.length)
              maximumPropertiesToStringify -= value.length
              separator = join
            }
            if (deterministic) {
              keys = sort(keys, comparator)
            }
            stack.push(value)
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key = keys[i]
              const tmp = stringifyIndent(key, value[key], stack, spacer, indentation)
              if (tmp !== undefined) {
                res += `${separator}${strEscape(key)}: ${tmp}`
                separator = join
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth
              res += `${separator}"...": "${getItemCount(removedKeys)} not stringified"`
              separator = join
            }
            if (separator !== '') {
              res = `\n${indentation}${res}\n${originalIndentation}`
            }
            stack.pop()
            return `{${res}}`
          }
          case 'number':
            return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
          case 'boolean':
            return value === true ? 'true' : 'false'
          case 'undefined':
            return undefined
          case 'bigint':
            if (bigint) {
              return String(value)
            }
          // fallthrough
          default:
            return fail ? fail(value) : undefined
        }
      }

      function stringifySimple(key, value, stack) {
        switch (typeof value) {
          case 'string':
            return strEscape(value)
          case 'object': {
            if (value === null) {
              return 'null'
            }
            if (typeof value.toJSON === 'function') {
              value = value.toJSON(key)
              // Prevent calling `toJSON` again
              if (typeof value !== 'object') {
                return stringifySimple(key, value, stack)
              }
              if (value === null) {
                return 'null'
              }
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue
            }

            let res = ''

            const hasLength = value.length !== undefined
            if (hasLength && Array.isArray(value)) {
              if (value.length === 0) {
                return '[]'
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"'
              }
              stack.push(value)
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth)
              let i = 0
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp = stringifySimple(String(i), value[i], stack)
                res += tmp !== undefined ? tmp : 'null'
                res += ','
              }
              const tmp = stringifySimple(String(i), value[i], stack)
              res += tmp !== undefined ? tmp : 'null'
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1
                res += `,"... ${getItemCount(removedKeys)} not stringified"`
              }
              stack.pop()
              return `[${res}]`
            }

            let keys = Object.keys(value)
            const keyLength = keys.length
            if (keyLength === 0) {
              return '{}'
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"'
            }
            let separator = ''
            let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth)
            if (hasLength && isTypedArrayWithEntries(value)) {
              res += stringifyTypedArray(value, ',', maximumBreadth)
              keys = keys.slice(value.length)
              maximumPropertiesToStringify -= value.length
              separator = ','
            }
            if (deterministic) {
              keys = sort(keys, comparator)
            }
            stack.push(value)
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key = keys[i]
              const tmp = stringifySimple(key, value[key], stack)
              if (tmp !== undefined) {
                res += `${separator}${strEscape(key)}:${tmp}`
                separator = ','
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth
              res += `${separator}"...":"${getItemCount(removedKeys)} not stringified"`
            }
            stack.pop()
            return `{${res}}`
          }
          case 'number':
            return isFinite(value) ? String(value) : fail ? fail(value) : 'null'
          case 'boolean':
            return value === true ? 'true' : 'false'
          case 'undefined':
            return undefined
          case 'bigint':
            if (bigint) {
              return String(value)
            }
          // fallthrough
          default:
            return fail ? fail(value) : undefined
        }
      }

      function stringify(value, replacer, space) {
        if (arguments.length > 1) {
          let spacer = ''
          if (typeof space === 'number') {
            spacer = ' '.repeat(Math.min(space, 10))
          } else if (typeof space === 'string') {
            spacer = space.slice(0, 10)
          }
          if (replacer != null) {
            if (typeof replacer === 'function') {
              return stringifyFnReplacer('', { '': value }, [], replacer, spacer, '')
            }
            if (Array.isArray(replacer)) {
              return stringifyArrayReplacer(
                '',
                value,
                [],
                getUniqueReplacerSet(replacer),
                spacer,
                '',
              )
            }
          }
          if (spacer.length !== 0) {
            return stringifyIndent('', value, [], spacer, '')
          }
        }
        return stringifySimple('', value, [])
      }

      return stringify
    }
  })(safeStableStringify, safeStableStringify.exports)
  return safeStableStringify.exports
}

var json
var hasRequiredJson

function requireJson() {
  if (hasRequiredJson) return json
  hasRequiredJson = 1

  const format = requireFormat()
  const { MESSAGE } = requireTripleBeam()
  const stringify = requireSafeStableStringify()

  /*
   * function replacer (key, value)
   * Handles proper stringification of Buffer and bigint output.
   */
  function replacer(key, value) {
    // safe-stable-stringify does support BigInt, however, it doesn't wrap the value in quotes.
    // Leading to a loss in fidelity if the resulting string is parsed.
    // It would also be a breaking change for logform.
    if (typeof value === 'bigint') return value.toString()
    return value
  }

  /*
   * function json (info)
   * Returns a new instance of the JSON format that turns a log `info`
   * object into pure JSON. This was previously exposed as { json: true }
   * to transports in `winston < 3.0.0`.
   */
  json = format((info, opts) => {
    const jsonStringify = stringify.configure(opts)
    info[MESSAGE] = jsonStringify(info, opts.replacer || replacer, opts.space)
    return info
  })
  return json
}

var label
var hasRequiredLabel

function requireLabel() {
  if (hasRequiredLabel) return label
  hasRequiredLabel = 1

  const format = requireFormat()

  /*
   * function label (info)
   * Returns a new instance of the label Format which adds the specified
   * `opts.label` before the message. This was previously exposed as
   * { label: 'my label' } to transports in `winston < 3.0.0`.
   */
  label = format((info, opts) => {
    if (opts.message) {
      info.message = `[${opts.label}] ${info.message}`
      return info
    }

    info.label = opts.label
    return info
  })
  return label
}

var logstash
var hasRequiredLogstash

function requireLogstash() {
  if (hasRequiredLogstash) return logstash
  hasRequiredLogstash = 1

  const format = requireFormat()
  const { MESSAGE } = requireTripleBeam()
  const jsonStringify = requireSafeStableStringify()

  /*
   * function logstash (info)
   * Returns a new instance of the LogStash Format that turns a
   * log `info` object into pure JSON with the appropriate logstash
   * options. This was previously exposed as { logstash: true }
   * to transports in `winston < 3.0.0`.
   */
  logstash = format((info) => {
    const logstash = {}
    if (info.message) {
      logstash['@message'] = info.message
      delete info.message
    }

    if (info.timestamp) {
      logstash['@timestamp'] = info.timestamp
      delete info.timestamp
    }

    logstash['@fields'] = info
    info[MESSAGE] = jsonStringify(logstash)
    return info
  })
  return logstash
}

var metadata
var hasRequiredMetadata

function requireMetadata() {
  if (hasRequiredMetadata) return metadata
  hasRequiredMetadata = 1

  const format = requireFormat()

  function fillExcept(info, fillExceptKeys, metadataKey) {
    const savedKeys = fillExceptKeys.reduce((acc, key) => {
      acc[key] = info[key]
      delete info[key]
      return acc
    }, {})
    const metadata = Object.keys(info).reduce((acc, key) => {
      acc[key] = info[key]
      delete info[key]
      return acc
    }, {})

    Object.assign(info, savedKeys, {
      [metadataKey]: metadata,
    })
    return info
  }

  function fillWith(info, fillWithKeys, metadataKey) {
    info[metadataKey] = fillWithKeys.reduce((acc, key) => {
      acc[key] = info[key]
      delete info[key]
      return acc
    }, {})
    return info
  }

  /**
   * Adds in a "metadata" object to collect extraneous data, similar to the metadata
   * object in winston 2.x.
   */
  metadata = format((info, opts = {}) => {
    let metadataKey = 'metadata'
    if (opts.key) {
      metadataKey = opts.key
    }

    let fillExceptKeys = []
    if (!opts.fillExcept && !opts.fillWith) {
      fillExceptKeys.push('level')
      fillExceptKeys.push('message')
    }

    if (opts.fillExcept) {
      fillExceptKeys = opts.fillExcept
    }

    if (fillExceptKeys.length > 0) {
      return fillExcept(info, fillExceptKeys, metadataKey)
    }

    if (opts.fillWith) {
      return fillWith(info, opts.fillWith, metadataKey)
    }

    return info
  })
  return metadata
}

/**
 * Helpers.
 */

var ms
var hasRequiredMs$1

function requireMs$1() {
  if (hasRequiredMs$1) return ms
  hasRequiredMs$1 = 1
  var s = 1000
  var m = s * 60
  var h = m * 60
  var d = h * 24
  var w = d * 7
  var y = d * 365.25

  /**
   * Parse or format the given `val`.
   *
   * Options:
   *
   *  - `long` verbose formatting [false]
   *
   * @param {String|Number} val
   * @param {Object} [options]
   * @throws {Error} throw an error if val is not a non-empty string or a number
   * @return {String|Number}
   * @api public
   */

  ms = function (val, options) {
    options = options || {}
    var type = typeof val
    if (type === 'string' && val.length > 0) {
      return parse(val)
    } else if (type === 'number' && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val)
    }
    throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val))
  }

  /**
   * Parse the given `str` and return milliseconds.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */

  function parse(str) {
    str = String(str)
    if (str.length > 100) {
      return
    }
    var match =
      /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str,
      )
    if (!match) {
      return
    }
    var n = parseFloat(match[1])
    var type = (match[2] || 'ms').toLowerCase()
    switch (type) {
      case 'years':
      case 'year':
      case 'yrs':
      case 'yr':
      case 'y':
        return n * y
      case 'weeks':
      case 'week':
      case 'w':
        return n * w
      case 'days':
      case 'day':
      case 'd':
        return n * d
      case 'hours':
      case 'hour':
      case 'hrs':
      case 'hr':
      case 'h':
        return n * h
      case 'minutes':
      case 'minute':
      case 'mins':
      case 'min':
      case 'm':
        return n * m
      case 'seconds':
      case 'second':
      case 'secs':
      case 'sec':
      case 's':
        return n * s
      case 'milliseconds':
      case 'millisecond':
      case 'msecs':
      case 'msec':
      case 'ms':
        return n
      default:
        return undefined
    }
  }

  /**
   * Short format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtShort(ms) {
    var msAbs = Math.abs(ms)
    if (msAbs >= d) {
      return Math.round(ms / d) + 'd'
    }
    if (msAbs >= h) {
      return Math.round(ms / h) + 'h'
    }
    if (msAbs >= m) {
      return Math.round(ms / m) + 'm'
    }
    if (msAbs >= s) {
      return Math.round(ms / s) + 's'
    }
    return ms + 'ms'
  }

  /**
   * Long format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtLong(ms) {
    var msAbs = Math.abs(ms)
    if (msAbs >= d) {
      return plural(ms, msAbs, d, 'day')
    }
    if (msAbs >= h) {
      return plural(ms, msAbs, h, 'hour')
    }
    if (msAbs >= m) {
      return plural(ms, msAbs, m, 'minute')
    }
    if (msAbs >= s) {
      return plural(ms, msAbs, s, 'second')
    }
    return ms + ' ms'
  }

  /**
   * Pluralization helper.
   */

  function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5
    return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '')
  }
  return ms
}

var ms_1
var hasRequiredMs

function requireMs() {
  if (hasRequiredMs) return ms_1
  hasRequiredMs = 1

  const format = requireFormat()
  const ms = requireMs$1()

  /*
   * function ms (info)
   * Returns an `info` with a `ms` property. The `ms` property holds the Value
   * of the time difference between two calls in milliseconds.
   */
  ms_1 = format((info) => {
    const curr = +new Date()
    this.diff = curr - (this.prevTime || curr)
    this.prevTime = curr
    info.ms = `+${ms(this.diff)}`

    return info
  })
  return ms_1
}

var prettyPrint
var hasRequiredPrettyPrint

function requirePrettyPrint() {
  if (hasRequiredPrettyPrint) return prettyPrint
  hasRequiredPrettyPrint = 1

  const inspect = require$$0$2.inspect
  const format = requireFormat()
  const { LEVEL, MESSAGE, SPLAT } = requireTripleBeam()

  /*
   * function prettyPrint (info)
   * Returns a new instance of the prettyPrint Format that "prettyPrint"
   * serializes `info` objects. This was previously exposed as
   * { prettyPrint: true } to transports in `winston < 3.0.0`.
   */
  prettyPrint = format((info, opts = {}) => {
    //
    // info[{LEVEL, MESSAGE, SPLAT}] are enumerable here. Since they
    // are internal, we remove them before util.inspect so they
    // are not printed.
    //
    const stripped = Object.assign({}, info)

    // Remark (indexzero): update this technique in April 2019
    // when node@6 is EOL
    delete stripped[LEVEL]
    delete stripped[MESSAGE]
    delete stripped[SPLAT]

    info[MESSAGE] = inspect(stripped, false, opts.depth || null, opts.colorize)
    return info
  })
  return prettyPrint
}

var printf = { exports: {} }

var hasRequiredPrintf

function requirePrintf() {
  if (hasRequiredPrintf) return printf.exports
  hasRequiredPrintf = 1

  const { MESSAGE } = requireTripleBeam()

  class Printf {
    constructor(templateFn) {
      this.template = templateFn
    }

    transform(info) {
      info[MESSAGE] = this.template(info)
      return info
    }
  }

  /*
   * function printf (templateFn)
   * Returns a new instance of the printf Format that creates an
   * intermediate prototype to store the template string-based formatter
   * function.
   */
  printf.exports = (opts) => new Printf(opts)

  printf.exports.Printf = printf.exports.Format = Printf
  return printf.exports
}

/* eslint no-undefined: 0 */

var simple
var hasRequiredSimple

function requireSimple() {
  if (hasRequiredSimple) return simple
  hasRequiredSimple = 1

  const format = requireFormat()
  const { MESSAGE } = requireTripleBeam()
  const jsonStringify = requireSafeStableStringify()

  /*
   * function simple (info)
   * Returns a new instance of the simple format TransformStream
   * which writes a simple representation of logs.
   *
   *    const { level, message, splat, ...rest } = info;
   *
   *    ${level}: ${message}                            if rest is empty
   *    ${level}: ${message} ${JSON.stringify(rest)}    otherwise
   */
  simple = format((info) => {
    const stringifiedRest = jsonStringify(
      Object.assign({}, info, {
        level: undefined,
        message: undefined,
        splat: undefined,
      }),
    )

    const padding = (info.padding && info.padding[info.level]) || ''
    if (stringifiedRest !== '{}') {
      info[MESSAGE] = `${info.level}:${padding} ${info.message} ${stringifiedRest}`
    } else {
      info[MESSAGE] = `${info.level}:${padding} ${info.message}`
    }

    return info
  })
  return simple
}

var splat
var hasRequiredSplat

function requireSplat() {
  if (hasRequiredSplat) return splat
  hasRequiredSplat = 1

  const util = require$$0$2
  const { SPLAT } = requireTripleBeam()

  /**
   * Captures the number of format (i.e. %s strings) in a given string.
   * Based on `util.format`, see Node.js source:
   * https://github.com/nodejs/node/blob/b1c8f15c5f169e021f7c46eb7b219de95fe97603/lib/util.js#L201-L230
   * @type {RegExp}
   */
  const formatRegExp = /%[scdjifoO%]/g

  /**
   * Captures the number of escaped % signs in a format string (i.e. %s strings).
   * @type {RegExp}
   */
  const escapedPercent = /%%/g

  class Splatter {
    constructor(opts) {
      this.options = opts
    }

    /**
     * Check to see if tokens <= splat.length, assign { splat, meta } into the
     * `info` accordingly, and write to this instance.
     *
     * @param  {Info} info Logform info message.
     * @param  {String[]} tokens Set of string interpolation tokens.
     * @returns {Info} Modified info message
     * @private
     */
    _splat(info, tokens) {
      const msg = info.message
      const splat = info[SPLAT] || info.splat || []
      const percents = msg.match(escapedPercent)
      const escapes = (percents && percents.length) || 0

      // The expected splat is the number of tokens minus the number of escapes
      // e.g.
      // - { expectedSplat: 3 } '%d %s %j'
      // - { expectedSplat: 5 } '[%s] %d%% %d%% %s %j'
      //
      // Any "meta" will be arugments in addition to the expected splat size
      // regardless of type. e.g.
      //
      // logger.log('info', '%d%% %s %j', 100, 'wow', { such: 'js' }, { thisIsMeta: true });
      // would result in splat of four (4), but only three (3) are expected. Therefore:
      //
      // extraSplat = 3 - 4 = -1
      // metas = [100, 'wow', { such: 'js' }, { thisIsMeta: true }].splice(-1, -1 * -1);
      // splat = [100, 'wow', { such: 'js' }]
      const expectedSplat = tokens.length - escapes
      const extraSplat = expectedSplat - splat.length
      const metas = extraSplat < 0 ? splat.splice(extraSplat, -1 * extraSplat) : []

      // Now that { splat } has been separated from any potential { meta }. we
      // can assign this to the `info` object and write it to our format stream.
      // If the additional metas are **NOT** objects or **LACK** enumerable properties
      // you are going to have a bad time.
      const metalen = metas.length
      if (metalen) {
        for (let i = 0; i < metalen; i++) {
          Object.assign(info, metas[i])
        }
      }

      info.message = util.format(msg, ...splat)
      return info
    }

    /**
     * Transforms the `info` message by using `util.format` to complete
     * any `info.message` provided it has string interpolation tokens.
     * If no tokens exist then `info` is immutable.
     *
     * @param  {Info} info Logform info message.
     * @param  {Object} opts Options for this instance.
     * @returns {Info} Modified info message
     */
    transform(info) {
      const msg = info.message
      const splat = info[SPLAT] || info.splat

      // No need to process anything if splat is undefined
      if (!splat || !splat.length) {
        return info
      }

      // Extract tokens, if none available default to empty array to
      // ensure consistancy in expected results
      const tokens = msg && msg.match && msg.match(formatRegExp)

      // This condition will take care of inputs with info[SPLAT]
      // but no tokens present
      if (!tokens && (splat || splat.length)) {
        const metas = splat.length > 1 ? splat.splice(0) : splat

        // Now that { splat } has been separated from any potential { meta }. we
        // can assign this to the `info` object and write it to our format stream.
        // If the additional metas are **NOT** objects or **LACK** enumerable properties
        // you are going to have a bad time.
        const metalen = metas.length
        if (metalen) {
          for (let i = 0; i < metalen; i++) {
            Object.assign(info, metas[i])
          }
        }

        return info
      }

      if (tokens) {
        return this._splat(info, tokens)
      }

      return info
    }
  }

  /*
   * function splat (info)
   * Returns a new instance of the splat format TransformStream
   * which performs string interpolation from `info` objects. This was
   * previously exposed implicitly in `winston < 3.0.0`.
   */
  splat = (opts) => new Splatter(opts)
  return splat
}

var token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|Z|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g
var twoDigitsOptional = '\\d\\d?'
var twoDigits = '\\d\\d'
var threeDigits = '\\d{3}'
var fourDigits = '\\d{4}'
var word = '[^\\s]+'
var literal = /\[([^]*?)\]/gm
function shorten(arr, sLen) {
  var newArr = []
  for (var i = 0, len = arr.length; i < len; i++) {
    newArr.push(arr[i].substr(0, sLen))
  }
  return newArr
}
var monthUpdate = function (arrName) {
  return function (v, i18n) {
    var lowerCaseArr = i18n[arrName].map(function (v) {
      return v.toLowerCase()
    })
    var index = lowerCaseArr.indexOf(v.toLowerCase())
    if (index > -1) {
      return index
    }
    return null
  }
}
function assign(origObj) {
  var args = []
  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i]
  }
  for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
    var obj = args_1[_a]
    for (var key in obj) {
      // @ts-ignore ex
      origObj[key] = obj[key]
    }
  }
  return origObj
}
var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
var monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
var monthNamesShort = shorten(monthNames, 3)
var dayNamesShort = shorten(dayNames, 3)
var defaultI18n = {
  dayNamesShort: dayNamesShort,
  dayNames: dayNames,
  monthNamesShort: monthNamesShort,
  monthNames: monthNames,
  amPm: ['am', 'pm'],
  DoFn: function (dayOfMonth) {
    return (
      dayOfMonth +
      ['th', 'st', 'nd', 'rd'][
        dayOfMonth % 10 > 3
          ? 0
          : ((dayOfMonth - (dayOfMonth % 10) !== 10 ? 1 : 0) * dayOfMonth) % 10
      ]
    )
  },
}
var globalI18n = assign({}, defaultI18n)
var setGlobalDateI18n = function (i18n) {
  return (globalI18n = assign(globalI18n, i18n))
}
var regexEscape = function (str) {
  return str.replace(/[|\\{()[^$+*?.-]/g, '\\$&')
}
var pad = function (val, len) {
  if (len === void 0) {
    len = 2
  }
  val = String(val)
  while (val.length < len) {
    val = '0' + val
  }
  return val
}
var formatFlags = {
  D: function (dateObj) {
    return String(dateObj.getDate())
  },
  DD: function (dateObj) {
    return pad(dateObj.getDate())
  },
  Do: function (dateObj, i18n) {
    return i18n.DoFn(dateObj.getDate())
  },
  d: function (dateObj) {
    return String(dateObj.getDay())
  },
  dd: function (dateObj) {
    return pad(dateObj.getDay())
  },
  ddd: function (dateObj, i18n) {
    return i18n.dayNamesShort[dateObj.getDay()]
  },
  dddd: function (dateObj, i18n) {
    return i18n.dayNames[dateObj.getDay()]
  },
  M: function (dateObj) {
    return String(dateObj.getMonth() + 1)
  },
  MM: function (dateObj) {
    return pad(dateObj.getMonth() + 1)
  },
  MMM: function (dateObj, i18n) {
    return i18n.monthNamesShort[dateObj.getMonth()]
  },
  MMMM: function (dateObj, i18n) {
    return i18n.monthNames[dateObj.getMonth()]
  },
  YY: function (dateObj) {
    return pad(String(dateObj.getFullYear()), 4).substr(2)
  },
  YYYY: function (dateObj) {
    return pad(dateObj.getFullYear(), 4)
  },
  h: function (dateObj) {
    return String(dateObj.getHours() % 12 || 12)
  },
  hh: function (dateObj) {
    return pad(dateObj.getHours() % 12 || 12)
  },
  H: function (dateObj) {
    return String(dateObj.getHours())
  },
  HH: function (dateObj) {
    return pad(dateObj.getHours())
  },
  m: function (dateObj) {
    return String(dateObj.getMinutes())
  },
  mm: function (dateObj) {
    return pad(dateObj.getMinutes())
  },
  s: function (dateObj) {
    return String(dateObj.getSeconds())
  },
  ss: function (dateObj) {
    return pad(dateObj.getSeconds())
  },
  S: function (dateObj) {
    return String(Math.round(dateObj.getMilliseconds() / 100))
  },
  SS: function (dateObj) {
    return pad(Math.round(dateObj.getMilliseconds() / 10), 2)
  },
  SSS: function (dateObj) {
    return pad(dateObj.getMilliseconds(), 3)
  },
  a: function (dateObj, i18n) {
    return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1]
  },
  A: function (dateObj, i18n) {
    return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase()
  },
  ZZ: function (dateObj) {
    var offset = dateObj.getTimezoneOffset()
    return (
      (offset > 0 ? '-' : '+') +
      pad(Math.floor(Math.abs(offset) / 60) * 100 + (Math.abs(offset) % 60), 4)
    )
  },
  Z: function (dateObj) {
    var offset = dateObj.getTimezoneOffset()
    return (
      (offset > 0 ? '-' : '+') +
      pad(Math.floor(Math.abs(offset) / 60), 2) +
      ':' +
      pad(Math.abs(offset) % 60, 2)
    )
  },
}
var monthParse = function (v) {
  return +v - 1
}
var emptyDigits = [null, twoDigitsOptional]
var emptyWord = [null, word]
var amPm = [
  'isPm',
  word,
  function (v, i18n) {
    var val = v.toLowerCase()
    if (val === i18n.amPm[0]) {
      return 0
    } else if (val === i18n.amPm[1]) {
      return 1
    }
    return null
  },
]
var timezoneOffset = [
  'timezoneOffset',
  '[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z?',
  function (v) {
    var parts = (v + '').match(/([+-]|\d\d)/gi)
    if (parts) {
      var minutes = +parts[1] * 60 + parseInt(parts[2], 10)
      return parts[0] === '+' ? minutes : -minutes
    }
    return 0
  },
]
var parseFlags = {
  D: ['day', twoDigitsOptional],
  DD: ['day', twoDigits],
  Do: [
    'day',
    twoDigitsOptional + word,
    function (v) {
      return parseInt(v, 10)
    },
  ],
  M: ['month', twoDigitsOptional, monthParse],
  MM: ['month', twoDigits, monthParse],
  YY: [
    'year',
    twoDigits,
    function (v) {
      var now = new Date()
      var cent = +('' + now.getFullYear()).substr(0, 2)
      return +('' + (+v > 68 ? cent - 1 : cent) + v)
    },
  ],
  h: ['hour', twoDigitsOptional, undefined, 'isPm'],
  hh: ['hour', twoDigits, undefined, 'isPm'],
  H: ['hour', twoDigitsOptional],
  HH: ['hour', twoDigits],
  m: ['minute', twoDigitsOptional],
  mm: ['minute', twoDigits],
  s: ['second', twoDigitsOptional],
  ss: ['second', twoDigits],
  YYYY: ['year', fourDigits],
  S: [
    'millisecond',
    '\\d',
    function (v) {
      return +v * 100
    },
  ],
  SS: [
    'millisecond',
    twoDigits,
    function (v) {
      return +v * 10
    },
  ],
  SSS: ['millisecond', threeDigits],
  d: emptyDigits,
  dd: emptyDigits,
  ddd: emptyWord,
  dddd: emptyWord,
  MMM: ['month', word, monthUpdate('monthNamesShort')],
  MMMM: ['month', word, monthUpdate('monthNames')],
  a: amPm,
  A: amPm,
  ZZ: timezoneOffset,
  Z: timezoneOffset,
}
// Some common format strings
var globalMasks = {
  default: 'ddd MMM DD YYYY HH:mm:ss',
  shortDate: 'M/D/YY',
  mediumDate: 'MMM D, YYYY',
  longDate: 'MMMM D, YYYY',
  fullDate: 'dddd, MMMM D, YYYY',
  isoDate: 'YYYY-MM-DD',
  isoDateTime: 'YYYY-MM-DDTHH:mm:ssZ',
  shortTime: 'HH:mm',
  mediumTime: 'HH:mm:ss',
  longTime: 'HH:mm:ss.SSS',
}
var setGlobalDateMasks = function (masks) {
  return assign(globalMasks, masks)
}
/***
 * Format a date
 * @method format
 * @param {Date|number} dateObj
 * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
 * @returns {string} Formatted date string
 */
var format = function (dateObj, mask, i18n) {
  if (mask === void 0) {
    mask = globalMasks['default']
  }
  if (i18n === void 0) {
    i18n = {}
  }
  if (typeof dateObj === 'number') {
    dateObj = new Date(dateObj)
  }
  if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
    throw new Error('Invalid Date pass to format')
  }
  mask = globalMasks[mask] || mask
  var literals = []
  // Make literals inactive by replacing them with @@@
  mask = mask.replace(literal, function ($0, $1) {
    literals.push($1)
    return '@@@'
  })
  var combinedI18nSettings = assign(assign({}, globalI18n), i18n)
  // Apply formatting rules
  mask = mask.replace(token, function ($0) {
    return formatFlags[$0](dateObj, combinedI18nSettings)
  })
  // Inline literal values back into the formatted value
  return mask.replace(/@@@/g, function () {
    return literals.shift()
  })
}
/**
 * Parse a date string into a Javascript Date object /
 * @method parse
 * @param {string} dateStr Date string
 * @param {string} format Date parse format
 * @param {i18n} I18nSettingsOptional Full or subset of I18N settings
 * @returns {Date|null} Returns Date object. Returns null what date string is invalid or doesn't match format
 */
function parse(dateStr, format, i18n) {
  if (i18n === void 0) {
    i18n = {}
  }
  if (typeof format !== 'string') {
    throw new Error('Invalid format in fecha parse')
  }
  // Check to see if the format is actually a mask
  format = globalMasks[format] || format
  // Avoid regular expression denial of service, fail early for really long strings
  // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
  if (dateStr.length > 1000) {
    return null
  }
  // Default to the beginning of the year.
  var today = new Date()
  var dateInfo = {
    year: today.getFullYear(),
    month: 0,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    isPm: null,
    timezoneOffset: null,
  }
  var parseInfo = []
  var literals = []
  // Replace all the literals with @@@. Hopefully a string that won't exist in the format
  var newFormat = format.replace(literal, function ($0, $1) {
    literals.push(regexEscape($1))
    return '@@@'
  })
  var specifiedFields = {}
  var requiredFields = {}
  // Change every token that we find into the correct regex
  newFormat = regexEscape(newFormat).replace(token, function ($0) {
    var info = parseFlags[$0]
    var field = info[0],
      regex = info[1],
      requiredField = info[3]
    // Check if the person has specified the same field twice. This will lead to confusing results.
    if (specifiedFields[field]) {
      throw new Error('Invalid format. ' + field + ' specified twice in format')
    }
    specifiedFields[field] = true
    // Check if there are any required fields. For instance, 12 hour time requires AM/PM specified
    if (requiredField) {
      requiredFields[requiredField] = true
    }
    parseInfo.push(info)
    return '(' + regex + ')'
  })
  // Check all the required fields are present
  Object.keys(requiredFields).forEach(function (field) {
    if (!specifiedFields[field]) {
      throw new Error('Invalid format. ' + field + ' is required in specified format')
    }
  })
  // Add back all the literals after
  newFormat = newFormat.replace(/@@@/g, function () {
    return literals.shift()
  })
  // Check if the date string matches the format. If it doesn't return null
  var matches = dateStr.match(new RegExp(newFormat, 'i'))
  if (!matches) {
    return null
  }
  var combinedI18nSettings = assign(assign({}, globalI18n), i18n)
  // For each match, call the parser function for that date part
  for (var i = 1; i < matches.length; i++) {
    var _a = parseInfo[i - 1],
      field = _a[0],
      parser = _a[2]
    var value = parser ? parser(matches[i], combinedI18nSettings) : +matches[i]
    // If the parser can't make sense of the value, return null
    if (value == null) {
      return null
    }
    dateInfo[field] = value
  }
  if (dateInfo.isPm === 1 && dateInfo.hour != null && +dateInfo.hour !== 12) {
    dateInfo.hour = +dateInfo.hour + 12
  } else if (dateInfo.isPm === 0 && +dateInfo.hour === 12) {
    dateInfo.hour = 0
  }
  var dateTZ
  if (dateInfo.timezoneOffset == null) {
    dateTZ = new Date(
      dateInfo.year,
      dateInfo.month,
      dateInfo.day,
      dateInfo.hour,
      dateInfo.minute,
      dateInfo.second,
      dateInfo.millisecond,
    )
    var validateFields = [
      ['month', 'getMonth'],
      ['day', 'getDate'],
      ['hour', 'getHours'],
      ['minute', 'getMinutes'],
      ['second', 'getSeconds'],
    ]
    for (var i = 0, len = validateFields.length; i < len; i++) {
      // Check to make sure the date field is within the allowed range. Javascript dates allows values
      // outside the allowed range. If the values don't match the value was invalid
      if (
        specifiedFields[validateFields[i][0]] &&
        dateInfo[validateFields[i][0]] !== dateTZ[validateFields[i][1]]()
      ) {
        return null
      }
    }
  } else {
    dateTZ = new Date(
      Date.UTC(
        dateInfo.year,
        dateInfo.month,
        dateInfo.day,
        dateInfo.hour,
        dateInfo.minute - dateInfo.timezoneOffset,
        dateInfo.second,
        dateInfo.millisecond,
      ),
    )
    // We can't validate dates in another timezone unfortunately. Do a basic check instead
    if (
      dateInfo.month > 11 ||
      dateInfo.month < 0 ||
      dateInfo.day > 31 ||
      dateInfo.day < 1 ||
      dateInfo.hour > 23 ||
      dateInfo.hour < 0 ||
      dateInfo.minute > 59 ||
      dateInfo.minute < 0 ||
      dateInfo.second > 59 ||
      dateInfo.second < 0
    ) {
      return null
    }
  }
  // Don't allow invalid dates
  return dateTZ
}
var fecha = {
  format: format,
  parse: parse,
  defaultI18n: defaultI18n,
  setGlobalDateI18n: setGlobalDateI18n,
  setGlobalDateMasks: setGlobalDateMasks,
}

var fecha$1 = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  assign: assign,
  default: fecha,
  defaultI18n: defaultI18n,
  format: format,
  parse: parse,
  setGlobalDateI18n: setGlobalDateI18n,
  setGlobalDateMasks: setGlobalDateMasks,
})

var require$$0 = /*@__PURE__*/ getAugmentedNamespace(fecha$1)

var timestamp
var hasRequiredTimestamp

function requireTimestamp() {
  if (hasRequiredTimestamp) return timestamp
  hasRequiredTimestamp = 1

  const fecha = require$$0
  const format = requireFormat()

  /*
   * function timestamp (info)
   * Returns a new instance of the timestamp Format which adds a timestamp
   * to the info. It was previously available in winston < 3.0.0 as:
   *
   * - { timestamp: true }             // `new Date.toISOString()`
   * - { timestamp: function:String }  // Value returned by `timestamp()`
   */
  timestamp = format((info, opts = {}) => {
    if (opts.format) {
      info.timestamp =
        typeof opts.format === 'function' ? opts.format() : fecha.format(new Date(), opts.format)
    }

    if (!info.timestamp) {
      info.timestamp = new Date().toISOString()
    }

    if (opts.alias) {
      info[opts.alias] = info.timestamp
    }

    return info
  })
  return timestamp
}

var uncolorize
var hasRequiredUncolorize

function requireUncolorize() {
  if (hasRequiredUncolorize) return uncolorize
  hasRequiredUncolorize = 1

  const colors = requireSafe()
  const format = requireFormat()
  const { MESSAGE } = requireTripleBeam()

  /*
   * function uncolorize (info)
   * Returns a new instance of the uncolorize Format that strips colors
   * from `info` objects. This was previously exposed as { stripColors: true }
   * to transports in `winston < 3.0.0`.
   */
  uncolorize = format((info, opts) => {
    if (opts.level !== false) {
      info.level = colors.strip(info.level)
    }

    if (opts.message !== false) {
      info.message = colors.strip(String(info.message))
    }

    if (opts.raw !== false && info[MESSAGE]) {
      info[MESSAGE] = colors.strip(String(info[MESSAGE]))
    }

    return info
  })
  return uncolorize
}

var hasRequiredLogform

function requireLogform() {
  if (hasRequiredLogform) return logform
  hasRequiredLogform = 1

  /*
   * @api public
   * @property {function} format
   * Both the construction method and set of exposed
   * formats.
   */
  const format = (logform.format = requireFormat())

  /*
   * @api public
   * @method {function} levels
   * Registers the specified levels with logform.
   */
  logform.levels = requireLevels()

  /*
   * @api private
   * method {function} exposeFormat
   * Exposes a sub-format on the main format object
   * as a lazy-loaded getter.
   */
  function exposeFormat(name, requireFormat) {
    Object.defineProperty(format, name, {
      get() {
        return requireFormat()
      },
      configurable: true,
    })
  }

  //
  // Setup all transports as lazy-loaded getters.
  //
  exposeFormat('align', function () {
    return requireAlign()
  })
  exposeFormat('errors', function () {
    return requireErrors$1()
  })
  exposeFormat('cli', function () {
    return requireCli()
  })
  exposeFormat('combine', function () {
    return requireCombine()
  })
  exposeFormat('colorize', function () {
    return requireColorize()
  })
  exposeFormat('json', function () {
    return requireJson()
  })
  exposeFormat('label', function () {
    return requireLabel()
  })
  exposeFormat('logstash', function () {
    return requireLogstash()
  })
  exposeFormat('metadata', function () {
    return requireMetadata()
  })
  exposeFormat('ms', function () {
    return requireMs()
  })
  exposeFormat('padLevels', function () {
    return requirePadLevels()
  })
  exposeFormat('prettyPrint', function () {
    return requirePrettyPrint()
  })
  exposeFormat('printf', function () {
    return requirePrintf()
  })
  exposeFormat('simple', function () {
    return requireSimple()
  })
  exposeFormat('splat', function () {
    return requireSplat()
  })
  exposeFormat('timestamp', function () {
    return requireTimestamp()
  })
  exposeFormat('uncolorize', function () {
    return requireUncolorize()
  })
  return logform
}

var common = {}

/**
 * common.js: Internal helper and utility functions for winston.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var hasRequiredCommon

function requireCommon() {
  if (hasRequiredCommon) return common
  hasRequiredCommon = 1
  ;(function (exports) {
    const { format } = require$$0$2

    /**
     * Set of simple deprecation notices and a way to expose them for a set of
     * properties.
     * @type {Object}
     * @private
     */
    exports.warn = {
      deprecated(prop) {
        return () => {
          throw new Error(format('{ %s } was removed in winston@3.0.0.', prop))
        }
      },
      useFormat(prop) {
        return () => {
          throw new Error(
            [
              format('{ %s } was removed in winston@3.0.0.', prop),
              'Use a custom winston.format = winston.format(function) instead.',
            ].join('\n'),
          )
        }
      },
      forFunctions(obj, type, props) {
        props.forEach((prop) => {
          obj[prop] = exports.warn[type](prop)
        })
      },
      forProperties(obj, type, props) {
        props.forEach((prop) => {
          const notice = exports.warn[type](prop)
          Object.defineProperty(obj, prop, {
            get: notice,
            set: notice,
          })
        })
      },
    }
  })(common)
  return common
}

var version$1 = '3.17.0'
var require$$2 = {
  version: version$1,
}

var transports = {}

var winstonTransport = { exports: {} }

var modern = { exports: {} }

var node$1
var hasRequiredNode$1

function requireNode$1() {
  if (hasRequiredNode$1) return node$1
  hasRequiredNode$1 = 1
  /**
   * For Node.js, simply re-export the core `util.deprecate` function.
   */

  node$1 = require$$0$2.deprecate
  return node$1
}

var stream$1
var hasRequiredStream$1

function requireStream$1() {
  if (hasRequiredStream$1) return stream$1
  hasRequiredStream$1 = 1
  stream$1 = require$$0$3
  return stream$1
}

var destroy_1
var hasRequiredDestroy

function requireDestroy() {
  if (hasRequiredDestroy) return destroy_1
  hasRequiredDestroy = 1

  // undocumented cb() API, needed for core, not for public API
  function destroy(err, cb) {
    var _this = this
    var readableDestroyed = this._readableState && this._readableState.destroyed
    var writableDestroyed = this._writableState && this._writableState.destroyed
    if (readableDestroyed || writableDestroyed) {
      if (cb) {
        cb(err)
      } else if (err) {
        if (!this._writableState) {
          process.nextTick(emitErrorNT, this, err)
        } else if (!this._writableState.errorEmitted) {
          this._writableState.errorEmitted = true
          process.nextTick(emitErrorNT, this, err)
        }
      }
      return this
    }

    // we set destroyed to true before firing error callbacks in order
    // to make it re-entrance safe in case destroy() is called within callbacks

    if (this._readableState) {
      this._readableState.destroyed = true
    }

    // if this is a duplex stream mark the writable part as destroyed as well
    if (this._writableState) {
      this._writableState.destroyed = true
    }
    this._destroy(err || null, function (err) {
      if (!cb && err) {
        if (!_this._writableState) {
          process.nextTick(emitErrorAndCloseNT, _this, err)
        } else if (!_this._writableState.errorEmitted) {
          _this._writableState.errorEmitted = true
          process.nextTick(emitErrorAndCloseNT, _this, err)
        } else {
          process.nextTick(emitCloseNT, _this)
        }
      } else if (cb) {
        process.nextTick(emitCloseNT, _this)
        cb(err)
      } else {
        process.nextTick(emitCloseNT, _this)
      }
    })
    return this
  }
  function emitErrorAndCloseNT(self, err) {
    emitErrorNT(self, err)
    emitCloseNT(self)
  }
  function emitCloseNT(self) {
    if (self._writableState && !self._writableState.emitClose) return
    if (self._readableState && !self._readableState.emitClose) return
    self.emit('close')
  }
  function undestroy() {
    if (this._readableState) {
      this._readableState.destroyed = false
      this._readableState.reading = false
      this._readableState.ended = false
      this._readableState.endEmitted = false
    }
    if (this._writableState) {
      this._writableState.destroyed = false
      this._writableState.ended = false
      this._writableState.ending = false
      this._writableState.finalCalled = false
      this._writableState.prefinished = false
      this._writableState.finished = false
      this._writableState.errorEmitted = false
    }
  }
  function emitErrorNT(self, err) {
    self.emit('error', err)
  }
  function errorOrDestroy(stream, err) {
    // We have tests that rely on errors being emitted
    // in the same tick, so changing this is semver major.
    // For now when you opt-in to autoDestroy we allow
    // the error to be emitted nextTick. In a future
    // semver major update we should change the default to this.

    var rState = stream._readableState
    var wState = stream._writableState
    if ((rState && rState.autoDestroy) || (wState && wState.autoDestroy)) stream.destroy(err)
    else stream.emit('error', err)
  }
  destroy_1 = {
    destroy: destroy,
    undestroy: undestroy,
    errorOrDestroy: errorOrDestroy,
  }
  return destroy_1
}

var errors = {}

var hasRequiredErrors

function requireErrors() {
  if (hasRequiredErrors) return errors
  hasRequiredErrors = 1

  const codes = {}

  function createErrorType(code, message, Base) {
    if (!Base) {
      Base = Error
    }

    function getMessage(arg1, arg2, arg3) {
      if (typeof message === 'string') {
        return message
      } else {
        return message(arg1, arg2, arg3)
      }
    }

    class NodeError extends Base {
      constructor(arg1, arg2, arg3) {
        super(getMessage(arg1, arg2, arg3))
      }
    }

    NodeError.prototype.name = Base.name
    NodeError.prototype.code = code

    codes[code] = NodeError
  }

  // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js
  function oneOf(expected, thing) {
    if (Array.isArray(expected)) {
      const len = expected.length
      expected = expected.map((i) => String(i))
      if (len > 2) {
        return `one of ${thing} ${expected.slice(0, len - 1).join(', ')}, or ` + expected[len - 1]
      } else if (len === 2) {
        return `one of ${thing} ${expected[0]} or ${expected[1]}`
      } else {
        return `of ${thing} ${expected[0]}`
      }
    } else {
      return `of ${thing} ${String(expected)}`
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
  function startsWith(str, search, pos) {
    return str.substr(0, search.length) === search
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
  function endsWith(str, search, this_len) {
    if (this_len === undefined || this_len > str.length) {
      this_len = str.length
    }
    return str.substring(this_len - search.length, this_len) === search
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
  function includes(str, search, start) {
    if (typeof start !== 'number') {
      start = 0
    }

    if (start + search.length > str.length) {
      return false
    } else {
      return str.indexOf(search, start) !== -1
    }
  }

  createErrorType(
    'ERR_INVALID_OPT_VALUE',
    function (name, value) {
      return 'The value "' + value + '" is invalid for option "' + name + '"'
    },
    TypeError,
  )
  createErrorType(
    'ERR_INVALID_ARG_TYPE',
    function (name, expected, actual) {
      // determiner: 'must be' or 'must not be'
      let determiner
      if (typeof expected === 'string' && startsWith(expected, 'not ')) {
        determiner = 'must not be'
        expected = expected.replace(/^not /, '')
      } else {
        determiner = 'must be'
      }

      let msg
      if (endsWith(name, ' argument')) {
        // For cases like 'first argument'
        msg = `The ${name} ${determiner} ${oneOf(expected, 'type')}`
      } else {
        const type = includes(name, '.') ? 'property' : 'argument'
        msg = `The "${name}" ${type} ${determiner} ${oneOf(expected, 'type')}`
      }

      msg += `. Received type ${typeof actual}`
      return msg
    },
    TypeError,
  )
  createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF')
  createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
    return 'The ' + name + ' method is not implemented'
  })
  createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close')
  createErrorType('ERR_STREAM_DESTROYED', function (name) {
    return 'Cannot call ' + name + ' after a stream was destroyed'
  })
  createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times')
  createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable')
  createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end')
  createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError)
  createErrorType(
    'ERR_UNKNOWN_ENCODING',
    function (arg) {
      return 'Unknown encoding: ' + arg
    },
    TypeError,
  )
  createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event')

  errors.codes = codes
  return errors
}

var state
var hasRequiredState

function requireState() {
  if (hasRequiredState) return state
  hasRequiredState = 1

  var ERR_INVALID_OPT_VALUE = requireErrors().codes.ERR_INVALID_OPT_VALUE
  function highWaterMarkFrom(options, isDuplex, duplexKey) {
    return options.highWaterMark != null
      ? options.highWaterMark
      : isDuplex
        ? options[duplexKey]
        : null
  }
  function getHighWaterMark(state, options, duplexKey, isDuplex) {
    var hwm = highWaterMarkFrom(options, isDuplex, duplexKey)
    if (hwm != null) {
      if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
        var name = isDuplex ? duplexKey : 'highWaterMark'
        throw new ERR_INVALID_OPT_VALUE(name, hwm)
      }
      return Math.floor(hwm)
    }

    // Default value
    return state.objectMode ? 16 : 16 * 1024
  }
  state = {
    getHighWaterMark: getHighWaterMark,
  }
  return state
}

var inherits = { exports: {} }

var inherits_browser = { exports: {} }

var hasRequiredInherits_browser

function requireInherits_browser() {
  if (hasRequiredInherits_browser) return inherits_browser.exports
  hasRequiredInherits_browser = 1
  if (typeof Object.create === 'function') {
    // implementation from standard node.js 'util' module
    inherits_browser.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true,
          },
        })
      }
    }
  } else {
    // old school shim for old browsers
    inherits_browser.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor
        var TempCtor = function () {}
        TempCtor.prototype = superCtor.prototype
        ctor.prototype = new TempCtor()
        ctor.prototype.constructor = ctor
      }
    }
  }
  return inherits_browser.exports
}

var hasRequiredInherits

function requireInherits() {
  if (hasRequiredInherits) return inherits.exports
  hasRequiredInherits = 1
  try {
    var util = require('util')
    /* istanbul ignore next */
    if (typeof util.inherits !== 'function') throw ''
    inherits.exports = util.inherits
  } catch (e) {
    /* istanbul ignore next */
    inherits.exports = requireInherits_browser()
  }
  return inherits.exports
}

var buffer_list
var hasRequiredBuffer_list

function requireBuffer_list() {
  if (hasRequiredBuffer_list) return buffer_list
  hasRequiredBuffer_list = 1

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object)
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object)
      enumerableOnly &&
        (symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable
        })),
        keys.push.apply(keys, symbols)
    }
    return keys
  }
  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {}
      i % 2
        ? ownKeys(Object(source), true).forEach(function (key) {
            _defineProperty(target, key, source[key])
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
          : ownKeys(Object(source)).forEach(function (key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
            })
    }
    return target
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key)
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true,
      })
    } else {
      obj[key] = value
    }
    return obj
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function')
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor)
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps)
    Object.defineProperty(Constructor, 'prototype', { writable: false })
    return Constructor
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, 'string')
    return typeof key === 'symbol' ? key : String(key)
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== 'object' || input === null) return input
    var prim = input[Symbol.toPrimitive]
    if (prim !== undefined) {
      var res = prim.call(input, hint)
      if (typeof res !== 'object') return res
      throw new TypeError('@@toPrimitive must return a primitive value.')
    }
    return String(input)
  }
  var _require = require$$0$4,
    Buffer = _require.Buffer
  var _require2 = require$$0$2,
    inspect = _require2.inspect
  var custom = (inspect && inspect.custom) || 'inspect'
  function copyBuffer(src, target, offset) {
    Buffer.prototype.copy.call(src, target, offset)
  }
  buffer_list = /*#__PURE__*/ (function () {
    function BufferList() {
      _classCallCheck(this, BufferList)
      this.head = null
      this.tail = null
      this.length = 0
    }
    _createClass(BufferList, [
      {
        key: 'push',
        value: function push(v) {
          var entry = {
            data: v,
            next: null,
          }
          if (this.length > 0) this.tail.next = entry
          else this.head = entry
          this.tail = entry
          ++this.length
        },
      },
      {
        key: 'unshift',
        value: function unshift(v) {
          var entry = {
            data: v,
            next: this.head,
          }
          if (this.length === 0) this.tail = entry
          this.head = entry
          ++this.length
        },
      },
      {
        key: 'shift',
        value: function shift() {
          if (this.length === 0) return
          var ret = this.head.data
          if (this.length === 1) this.head = this.tail = null
          else this.head = this.head.next
          --this.length
          return ret
        },
      },
      {
        key: 'clear',
        value: function clear() {
          this.head = this.tail = null
          this.length = 0
        },
      },
      {
        key: 'join',
        value: function join(s) {
          if (this.length === 0) return ''
          var p = this.head
          var ret = '' + p.data
          while ((p = p.next)) ret += s + p.data
          return ret
        },
      },
      {
        key: 'concat',
        value: function concat(n) {
          if (this.length === 0) return Buffer.alloc(0)
          var ret = Buffer.allocUnsafe(n >>> 0)
          var p = this.head
          var i = 0
          while (p) {
            copyBuffer(p.data, ret, i)
            i += p.data.length
            p = p.next
          }
          return ret
        },

        // Consumes a specified amount of bytes or characters from the buffered data.
      },
      {
        key: 'consume',
        value: function consume(n, hasStrings) {
          var ret
          if (n < this.head.data.length) {
            // `slice` is the same for buffers and strings.
            ret = this.head.data.slice(0, n)
            this.head.data = this.head.data.slice(n)
          } else if (n === this.head.data.length) {
            // First chunk is a perfect match.
            ret = this.shift()
          } else {
            // Result spans more than one buffer.
            ret = hasStrings ? this._getString(n) : this._getBuffer(n)
          }
          return ret
        },
      },
      {
        key: 'first',
        value: function first() {
          return this.head.data
        },

        // Consumes a specified amount of characters from the buffered data.
      },
      {
        key: '_getString',
        value: function _getString(n) {
          var p = this.head
          var c = 1
          var ret = p.data
          n -= ret.length
          while ((p = p.next)) {
            var str = p.data
            var nb = n > str.length ? str.length : n
            if (nb === str.length) ret += str
            else ret += str.slice(0, n)
            n -= nb
            if (n === 0) {
              if (nb === str.length) {
                ++c
                if (p.next) this.head = p.next
                else this.head = this.tail = null
              } else {
                this.head = p
                p.data = str.slice(nb)
              }
              break
            }
            ++c
          }
          this.length -= c
          return ret
        },

        // Consumes a specified amount of bytes from the buffered data.
      },
      {
        key: '_getBuffer',
        value: function _getBuffer(n) {
          var ret = Buffer.allocUnsafe(n)
          var p = this.head
          var c = 1
          p.data.copy(ret)
          n -= p.data.length
          while ((p = p.next)) {
            var buf = p.data
            var nb = n > buf.length ? buf.length : n
            buf.copy(ret, ret.length - n, 0, nb)
            n -= nb
            if (n === 0) {
              if (nb === buf.length) {
                ++c
                if (p.next) this.head = p.next
                else this.head = this.tail = null
              } else {
                this.head = p
                p.data = buf.slice(nb)
              }
              break
            }
            ++c
          }
          this.length -= c
          return ret
        },

        // Make sure the linked list only shows the minimal necessary information.
      },
      {
        key: custom,
        value: function value(_, options) {
          return inspect(
            this,
            _objectSpread(
              _objectSpread({}, options),
              {},
              {
                // Only inspect one level.
                depth: 0,
                // It should not recurse.
                customInspect: false,
              },
            ),
          )
        },
      },
    ])
    return BufferList
  })()
  return buffer_list
}

var string_decoder = {}

var safeBuffer = { exports: {} }

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

var hasRequiredSafeBuffer

function requireSafeBuffer() {
  if (hasRequiredSafeBuffer) return safeBuffer.exports
  hasRequiredSafeBuffer = 1
  ;(function (module, exports) {
    /* eslint-disable node/no-deprecated-api */
    var buffer = require$$0$4
    var Buffer = buffer.Buffer

    // alternative to using Object.keys for old browsers
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key]
      }
    }
    if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
      module.exports = buffer
    } else {
      // Copy properties from require('buffer')
      copyProps(buffer, exports)
      exports.Buffer = SafeBuffer
    }

    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer(arg, encodingOrOffset, length)
    }

    SafeBuffer.prototype = Object.create(Buffer.prototype)

    // Copy static methods from Buffer
    copyProps(Buffer, SafeBuffer)

    SafeBuffer.from = function (arg, encodingOrOffset, length) {
      if (typeof arg === 'number') {
        throw new TypeError('Argument must not be a number')
      }
      return Buffer(arg, encodingOrOffset, length)
    }

    SafeBuffer.alloc = function (size, fill, encoding) {
      if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number')
      }
      var buf = Buffer(size)
      if (fill !== undefined) {
        if (typeof encoding === 'string') {
          buf.fill(fill, encoding)
        } else {
          buf.fill(fill)
        }
      } else {
        buf.fill(0)
      }
      return buf
    }

    SafeBuffer.allocUnsafe = function (size) {
      if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number')
      }
      return Buffer(size)
    }

    SafeBuffer.allocUnsafeSlow = function (size) {
      if (typeof size !== 'number') {
        throw new TypeError('Argument must be a number')
      }
      return buffer.SlowBuffer(size)
    }
  })(safeBuffer, safeBuffer.exports)
  return safeBuffer.exports
}

var hasRequiredString_decoder

function requireString_decoder() {
  if (hasRequiredString_decoder) return string_decoder
  hasRequiredString_decoder = 1

  /*<replacement>*/

  var Buffer = requireSafeBuffer().Buffer
  /*</replacement>*/

  var isEncoding =
    Buffer.isEncoding ||
    function (encoding) {
      encoding = '' + encoding
      switch (encoding && encoding.toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
        case 'raw':
          return true
        default:
          return false
      }
    }

  function _normalizeEncoding(enc) {
    if (!enc) return 'utf8'
    var retried
    while (true) {
      switch (enc) {
        case 'utf8':
        case 'utf-8':
          return 'utf8'
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return 'utf16le'
        case 'latin1':
        case 'binary':
          return 'latin1'
        case 'base64':
        case 'ascii':
        case 'hex':
          return enc
        default:
          if (retried) return // undefined
          enc = ('' + enc).toLowerCase()
          retried = true
      }
    }
  }
  // Do not cache `Buffer.isEncoding` when checking encoding names as some
  // modules monkey-patch it to support additional encodings
  function normalizeEncoding(enc) {
    var nenc = _normalizeEncoding(enc)
    if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc)))
      throw new Error('Unknown encoding: ' + enc)
    return nenc || enc
  }

  // StringDecoder provides an interface for efficiently splitting a series of
  // buffers into a series of JS strings without breaking apart multi-byte
  // characters.
  string_decoder.StringDecoder = StringDecoder
  function StringDecoder(encoding) {
    this.encoding = normalizeEncoding(encoding)
    var nb
    switch (this.encoding) {
      case 'utf16le':
        this.text = utf16Text
        this.end = utf16End
        nb = 4
        break
      case 'utf8':
        this.fillLast = utf8FillLast
        nb = 4
        break
      case 'base64':
        this.text = base64Text
        this.end = base64End
        nb = 3
        break
      default:
        this.write = simpleWrite
        this.end = simpleEnd
        return
    }
    this.lastNeed = 0
    this.lastTotal = 0
    this.lastChar = Buffer.allocUnsafe(nb)
  }

  StringDecoder.prototype.write = function (buf) {
    if (buf.length === 0) return ''
    var r
    var i
    if (this.lastNeed) {
      r = this.fillLast(buf)
      if (r === undefined) return ''
      i = this.lastNeed
      this.lastNeed = 0
    } else {
      i = 0
    }
    if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i)
    return r || ''
  }

  StringDecoder.prototype.end = utf8End

  // Returns only complete characters in a Buffer
  StringDecoder.prototype.text = utf8Text

  // Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
  StringDecoder.prototype.fillLast = function (buf) {
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed)
      return this.lastChar.toString(this.encoding, 0, this.lastTotal)
    }
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length)
    this.lastNeed -= buf.length
  }

  // Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
  // continuation byte. If an invalid byte is detected, -2 is returned.
  function utf8CheckByte(byte) {
    if (byte <= 0x7f) return 0
    else if (byte >> 5 === 0x06) return 2
    else if (byte >> 4 === 0x0e) return 3
    else if (byte >> 3 === 0x1e) return 4
    return byte >> 6 === 0x02 ? -1 : -2
  }

  // Checks at most 3 bytes at the end of a Buffer in order to detect an
  // incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
  // needed to complete the UTF-8 character (if applicable) are returned.
  function utf8CheckIncomplete(self, buf, i) {
    var j = buf.length - 1
    if (j < i) return 0
    var nb = utf8CheckByte(buf[j])
    if (nb >= 0) {
      if (nb > 0) self.lastNeed = nb - 1
      return nb
    }
    if (--j < i || nb === -2) return 0
    nb = utf8CheckByte(buf[j])
    if (nb >= 0) {
      if (nb > 0) self.lastNeed = nb - 2
      return nb
    }
    if (--j < i || nb === -2) return 0
    nb = utf8CheckByte(buf[j])
    if (nb >= 0) {
      if (nb > 0) {
        if (nb === 2) nb = 0
        else self.lastNeed = nb - 3
      }
      return nb
    }
    return 0
  }

  // Validates as many continuation bytes for a multi-byte UTF-8 character as
  // needed or are available. If we see a non-continuation byte where we expect
  // one, we "replace" the validated continuation bytes we've seen so far with
  // a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
  // behavior. The continuation byte check is included three times in the case
  // where all of the continuation bytes for a character exist in the same buffer.
  // It is also done this way as a slight performance increase instead of using a
  // loop.
  function utf8CheckExtraBytes(self, buf, p) {
    if ((buf[0] & 0xc0) !== 0x80) {
      self.lastNeed = 0
      return '\ufffd'
    }
    if (self.lastNeed > 1 && buf.length > 1) {
      if ((buf[1] & 0xc0) !== 0x80) {
        self.lastNeed = 1
        return '\ufffd'
      }
      if (self.lastNeed > 2 && buf.length > 2) {
        if ((buf[2] & 0xc0) !== 0x80) {
          self.lastNeed = 2
          return '\ufffd'
        }
      }
    }
  }

  // Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
  function utf8FillLast(buf) {
    var p = this.lastTotal - this.lastNeed
    var r = utf8CheckExtraBytes(this, buf)
    if (r !== undefined) return r
    if (this.lastNeed <= buf.length) {
      buf.copy(this.lastChar, p, 0, this.lastNeed)
      return this.lastChar.toString(this.encoding, 0, this.lastTotal)
    }
    buf.copy(this.lastChar, p, 0, buf.length)
    this.lastNeed -= buf.length
  }

  // Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
  // partial character, the character's bytes are buffered until the required
  // number of bytes are available.
  function utf8Text(buf, i) {
    var total = utf8CheckIncomplete(this, buf, i)
    if (!this.lastNeed) return buf.toString('utf8', i)
    this.lastTotal = total
    var end = buf.length - (total - this.lastNeed)
    buf.copy(this.lastChar, 0, end)
    return buf.toString('utf8', i, end)
  }

  // For UTF-8, a replacement character is added when ending on a partial
  // character.
  function utf8End(buf) {
    var r = buf && buf.length ? this.write(buf) : ''
    if (this.lastNeed) return r + '\ufffd'
    return r
  }

  // UTF-16LE typically needs two bytes per character, but even if we have an even
  // number of bytes available, we need to check if we end on a leading/high
  // surrogate. In that case, we need to wait for the next two bytes in order to
  // decode the last character properly.
  function utf16Text(buf, i) {
    if ((buf.length - i) % 2 === 0) {
      var r = buf.toString('utf16le', i)
      if (r) {
        var c = r.charCodeAt(r.length - 1)
        if (c >= 0xd800 && c <= 0xdbff) {
          this.lastNeed = 2
          this.lastTotal = 4
          this.lastChar[0] = buf[buf.length - 2]
          this.lastChar[1] = buf[buf.length - 1]
          return r.slice(0, -1)
        }
      }
      return r
    }
    this.lastNeed = 1
    this.lastTotal = 2
    this.lastChar[0] = buf[buf.length - 1]
    return buf.toString('utf16le', i, buf.length - 1)
  }

  // For UTF-16LE we do not explicitly append special replacement characters if we
  // end on a partial character, we simply let v8 handle that.
  function utf16End(buf) {
    var r = buf && buf.length ? this.write(buf) : ''
    if (this.lastNeed) {
      var end = this.lastTotal - this.lastNeed
      return r + this.lastChar.toString('utf16le', 0, end)
    }
    return r
  }

  function base64Text(buf, i) {
    var n = (buf.length - i) % 3
    if (n === 0) return buf.toString('base64', i)
    this.lastNeed = 3 - n
    this.lastTotal = 3
    if (n === 1) {
      this.lastChar[0] = buf[buf.length - 1]
    } else {
      this.lastChar[0] = buf[buf.length - 2]
      this.lastChar[1] = buf[buf.length - 1]
    }
    return buf.toString('base64', i, buf.length - n)
  }

  function base64End(buf) {
    var r = buf && buf.length ? this.write(buf) : ''
    if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed)
    return r
  }

  // Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
  function simpleWrite(buf) {
    return buf.toString(this.encoding)
  }

  function simpleEnd(buf) {
    return buf && buf.length ? this.write(buf) : ''
  }
  return string_decoder
}

var endOfStream
var hasRequiredEndOfStream

function requireEndOfStream() {
  if (hasRequiredEndOfStream) return endOfStream
  hasRequiredEndOfStream = 1

  var ERR_STREAM_PREMATURE_CLOSE = requireErrors().codes.ERR_STREAM_PREMATURE_CLOSE
  function once(callback) {
    var called = false
    return function () {
      if (called) return
      called = true
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key]
      }
      callback.apply(this, args)
    }
  }
  function noop() {}
  function isRequest(stream) {
    return stream.setHeader && typeof stream.abort === 'function'
  }
  function eos(stream, opts, callback) {
    if (typeof opts === 'function') return eos(stream, null, opts)
    if (!opts) opts = {}
    callback = once(callback || noop)
    var readable = opts.readable || (opts.readable !== false && stream.readable)
    var writable = opts.writable || (opts.writable !== false && stream.writable)
    var onlegacyfinish = function onlegacyfinish() {
      if (!stream.writable) onfinish()
    }
    var writableEnded = stream._writableState && stream._writableState.finished
    var onfinish = function onfinish() {
      writable = false
      writableEnded = true
      if (!readable) callback.call(stream)
    }
    var readableEnded = stream._readableState && stream._readableState.endEmitted
    var onend = function onend() {
      readable = false
      readableEnded = true
      if (!writable) callback.call(stream)
    }
    var onerror = function onerror(err) {
      callback.call(stream, err)
    }
    var onclose = function onclose() {
      var err
      if (readable && !readableEnded) {
        if (!stream._readableState || !stream._readableState.ended)
          err = new ERR_STREAM_PREMATURE_CLOSE()
        return callback.call(stream, err)
      }
      if (writable && !writableEnded) {
        if (!stream._writableState || !stream._writableState.ended)
          err = new ERR_STREAM_PREMATURE_CLOSE()
        return callback.call(stream, err)
      }
    }
    var onrequest = function onrequest() {
      stream.req.on('finish', onfinish)
    }
    if (isRequest(stream)) {
      stream.on('complete', onfinish)
      stream.on('abort', onclose)
      if (stream.req) onrequest()
      else stream.on('request', onrequest)
    } else if (writable && !stream._writableState) {
      // legacy streams
      stream.on('end', onlegacyfinish)
      stream.on('close', onlegacyfinish)
    }
    stream.on('end', onend)
    stream.on('finish', onfinish)
    if (opts.error !== false) stream.on('error', onerror)
    stream.on('close', onclose)
    return function () {
      stream.removeListener('complete', onfinish)
      stream.removeListener('abort', onclose)
      stream.removeListener('request', onrequest)
      if (stream.req) stream.req.removeListener('finish', onfinish)
      stream.removeListener('end', onlegacyfinish)
      stream.removeListener('close', onlegacyfinish)
      stream.removeListener('finish', onfinish)
      stream.removeListener('end', onend)
      stream.removeListener('error', onerror)
      stream.removeListener('close', onclose)
    }
  }
  endOfStream = eos
  return endOfStream
}

var async_iterator
var hasRequiredAsync_iterator

function requireAsync_iterator() {
  if (hasRequiredAsync_iterator) return async_iterator
  hasRequiredAsync_iterator = 1

  var _Object$setPrototypeO
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key)
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true,
      })
    } else {
      obj[key] = value
    }
    return obj
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, 'string')
    return typeof key === 'symbol' ? key : String(key)
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== 'object' || input === null) return input
    var prim = input[Symbol.toPrimitive]
    if (prim !== undefined) {
      var res = prim.call(input, hint)
      if (typeof res !== 'object') return res
      throw new TypeError('@@toPrimitive must return a primitive value.')
    }
    return (hint === 'string' ? String : Number)(input)
  }
  var finished = requireEndOfStream()
  var kLastResolve = Symbol('lastResolve')
  var kLastReject = Symbol('lastReject')
  var kError = Symbol('error')
  var kEnded = Symbol('ended')
  var kLastPromise = Symbol('lastPromise')
  var kHandlePromise = Symbol('handlePromise')
  var kStream = Symbol('stream')
  function createIterResult(value, done) {
    return {
      value: value,
      done: done,
    }
  }
  function readAndResolve(iter) {
    var resolve = iter[kLastResolve]
    if (resolve !== null) {
      var data = iter[kStream].read()
      // we defer if data is null
      // we can be expecting either 'end' or
      // 'error'
      if (data !== null) {
        iter[kLastPromise] = null
        iter[kLastResolve] = null
        iter[kLastReject] = null
        resolve(createIterResult(data, false))
      }
    }
  }
  function onReadable(iter) {
    // we wait for the next tick, because it might
    // emit an error with process.nextTick
    process.nextTick(readAndResolve, iter)
  }
  function wrapForNext(lastPromise, iter) {
    return function (resolve, reject) {
      lastPromise.then(function () {
        if (iter[kEnded]) {
          resolve(createIterResult(undefined, true))
          return
        }
        iter[kHandlePromise](resolve, reject)
      }, reject)
    }
  }
  var AsyncIteratorPrototype = Object.getPrototypeOf(function () {})
  var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf(
    ((_Object$setPrototypeO = {
      get stream() {
        return this[kStream]
      },
      next: function next() {
        var _this = this
        // if we have detected an error in the meanwhile
        // reject straight away
        var error = this[kError]
        if (error !== null) {
          return Promise.reject(error)
        }
        if (this[kEnded]) {
          return Promise.resolve(createIterResult(undefined, true))
        }
        if (this[kStream].destroyed) {
          // We need to defer via nextTick because if .destroy(err) is
          // called, the error will be emitted via nextTick, and
          // we cannot guarantee that there is no error lingering around
          // waiting to be emitted.
          return new Promise(function (resolve, reject) {
            process.nextTick(function () {
              if (_this[kError]) {
                reject(_this[kError])
              } else {
                resolve(createIterResult(undefined, true))
              }
            })
          })
        }

        // if we have multiple next() calls
        // we will wait for the previous Promise to finish
        // this logic is optimized to support for await loops,
        // where next() is only called once at a time
        var lastPromise = this[kLastPromise]
        var promise
        if (lastPromise) {
          promise = new Promise(wrapForNext(lastPromise, this))
        } else {
          // fast path needed to support multiple this.push()
          // without triggering the next() queue
          var data = this[kStream].read()
          if (data !== null) {
            return Promise.resolve(createIterResult(data, false))
          }
          promise = new Promise(this[kHandlePromise])
        }
        this[kLastPromise] = promise
        return promise
      },
    }),
    _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function () {
      return this
    }),
    _defineProperty(_Object$setPrototypeO, 'return', function _return() {
      var _this2 = this
      // destroy(err, cb) is a private API
      // we can guarantee we have that here, because we control the
      // Readable class this is attached to
      return new Promise(function (resolve, reject) {
        _this2[kStream].destroy(null, function (err) {
          if (err) {
            reject(err)
            return
          }
          resolve(createIterResult(undefined, true))
        })
      })
    }),
    _Object$setPrototypeO),
    AsyncIteratorPrototype,
  )
  var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
    var _Object$create
    var iterator = Object.create(
      ReadableStreamAsyncIteratorPrototype,
      ((_Object$create = {}),
      _defineProperty(_Object$create, kStream, {
        value: stream,
        writable: true,
      }),
      _defineProperty(_Object$create, kLastResolve, {
        value: null,
        writable: true,
      }),
      _defineProperty(_Object$create, kLastReject, {
        value: null,
        writable: true,
      }),
      _defineProperty(_Object$create, kError, {
        value: null,
        writable: true,
      }),
      _defineProperty(_Object$create, kEnded, {
        value: stream._readableState.endEmitted,
        writable: true,
      }),
      _defineProperty(_Object$create, kHandlePromise, {
        value: function value(resolve, reject) {
          var data = iterator[kStream].read()
          if (data) {
            iterator[kLastPromise] = null
            iterator[kLastResolve] = null
            iterator[kLastReject] = null
            resolve(createIterResult(data, false))
          } else {
            iterator[kLastResolve] = resolve
            iterator[kLastReject] = reject
          }
        },
        writable: true,
      }),
      _Object$create),
    )
    iterator[kLastPromise] = null
    finished(stream, function (err) {
      if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
        var reject = iterator[kLastReject]
        // reject if we are waiting for data in the Promise
        // returned by next() and store the error
        if (reject !== null) {
          iterator[kLastPromise] = null
          iterator[kLastResolve] = null
          iterator[kLastReject] = null
          reject(err)
        }
        iterator[kError] = err
        return
      }
      var resolve = iterator[kLastResolve]
      if (resolve !== null) {
        iterator[kLastPromise] = null
        iterator[kLastResolve] = null
        iterator[kLastReject] = null
        resolve(createIterResult(undefined, true))
      }
      iterator[kEnded] = true
    })
    stream.on('readable', onReadable.bind(null, iterator))
    return iterator
  }
  async_iterator = createReadableStreamAsyncIterator
  return async_iterator
}

var from_1
var hasRequiredFrom

function requireFrom() {
  if (hasRequiredFrom) return from_1
  hasRequiredFrom = 1

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg)
      var value = info.value
    } catch (error) {
      reject(error)
      return
    }
    if (info.done) {
      resolve(value)
    } else {
      Promise.resolve(value).then(_next, _throw)
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args)
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value)
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err)
        }
        _next(undefined)
      })
    }
  }
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object)
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object)
      enumerableOnly &&
        (symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable
        })),
        keys.push.apply(keys, symbols)
    }
    return keys
  }
  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {}
      i % 2
        ? ownKeys(Object(source), true).forEach(function (key) {
            _defineProperty(target, key, source[key])
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
          : ownKeys(Object(source)).forEach(function (key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
            })
    }
    return target
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key)
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true,
      })
    } else {
      obj[key] = value
    }
    return obj
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, 'string')
    return typeof key === 'symbol' ? key : String(key)
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== 'object' || input === null) return input
    var prim = input[Symbol.toPrimitive]
    if (prim !== undefined) {
      var res = prim.call(input, hint)
      if (typeof res !== 'object') return res
      throw new TypeError('@@toPrimitive must return a primitive value.')
    }
    return (hint === 'string' ? String : Number)(input)
  }
  var ERR_INVALID_ARG_TYPE = requireErrors().codes.ERR_INVALID_ARG_TYPE
  function from(Readable, iterable, opts) {
    var iterator
    if (iterable && typeof iterable.next === 'function') {
      iterator = iterable
    } else if (iterable && iterable[Symbol.asyncIterator])
      iterator = iterable[Symbol.asyncIterator]()
    else if (iterable && iterable[Symbol.iterator]) iterator = iterable[Symbol.iterator]()
    else throw new ERR_INVALID_ARG_TYPE('iterable', ['Iterable'], iterable)
    var readable = new Readable(
      _objectSpread(
        {
          objectMode: true,
        },
        opts,
      ),
    )
    // Reading boolean to protect against _read
    // being called before last iteration completion.
    var reading = false
    readable._read = function () {
      if (!reading) {
        reading = true
        next()
      }
    }
    function next() {
      return _next2.apply(this, arguments)
    }
    function _next2() {
      _next2 = _asyncToGenerator(function* () {
        try {
          var _yield$iterator$next = yield iterator.next(),
            value = _yield$iterator$next.value,
            done = _yield$iterator$next.done
          if (done) {
            readable.push(null)
          } else if (readable.push(yield value)) {
            next()
          } else {
            reading = false
          }
        } catch (err) {
          readable.destroy(err)
        }
      })
      return _next2.apply(this, arguments)
    }
    return readable
  }
  from_1 = from
  return from_1
}

var _stream_readable
var hasRequired_stream_readable

function require_stream_readable() {
  if (hasRequired_stream_readable) return _stream_readable
  hasRequired_stream_readable = 1

  _stream_readable = Readable

  /*<replacement>*/
  var Duplex
  /*</replacement>*/

  Readable.ReadableState = ReadableState

  /*<replacement>*/
  require$$0$5.EventEmitter
  var EElistenerCount = function EElistenerCount(emitter, type) {
    return emitter.listeners(type).length
  }
  /*</replacement>*/

  /*<replacement>*/
  var Stream = requireStream$1()
  /*</replacement>*/

  var Buffer = require$$0$4.Buffer
  var OurUint8Array =
    (typeof commonjsGlobal !== 'undefined'
      ? commonjsGlobal
      : typeof window !== 'undefined'
        ? window
        : typeof self !== 'undefined'
          ? self
          : {}
    ).Uint8Array || function () {}
  function _uint8ArrayToBuffer(chunk) {
    return Buffer.from(chunk)
  }
  function _isUint8Array(obj) {
    return Buffer.isBuffer(obj) || obj instanceof OurUint8Array
  }

  /*<replacement>*/
  var debugUtil = require$$0$2
  var debug
  if (debugUtil && debugUtil.debuglog) {
    debug = debugUtil.debuglog('stream')
  } else {
    debug = function debug() {}
  }
  /*</replacement>*/

  var BufferList = requireBuffer_list()
  var destroyImpl = requireDestroy()
  var _require = requireState(),
    getHighWaterMark = _require.getHighWaterMark
  var _require$codes = requireErrors().codes,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT

  // Lazy loaded to improve the startup performance.
  var StringDecoder
  var createReadableStreamAsyncIterator
  var from
  requireInherits()(Readable, Stream)
  var errorOrDestroy = destroyImpl.errorOrDestroy
  var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume']
  function prependListener(emitter, event, fn) {
    // Sadly this is not cacheable as some libraries bundle their own
    // event emitter implementation with them.
    if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn)

    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn)
    else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn)
    else emitter._events[event] = [fn, emitter._events[event]]
  }
  function ReadableState(options, stream, isDuplex) {
    Duplex = Duplex || require_stream_duplex()
    options = options || {}

    // Duplex streams are both readable and writable, but share
    // the same options object.
    // However, some cases require setting options to different
    // values for the readable and the writable sides of the duplex stream.
    // These options can be provided separately as readableXXX and writableXXX.
    if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex

    // object stream flag. Used to make read(n) ignore n and to
    // make all the buffer merging and length checks go away
    this.objectMode = !!options.objectMode
    if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode

    // the point at which it stops calling _read() to fill the buffer
    // Note: 0 is a valid value, means "don't call _read preemptively ever"
    this.highWaterMark = getHighWaterMark(this, options, 'readableHighWaterMark', isDuplex)

    // A linked list is used to store data chunks instead of an array because the
    // linked list can remove elements from the beginning faster than
    // array.shift()
    this.buffer = new BufferList()
    this.length = 0
    this.pipes = null
    this.pipesCount = 0
    this.flowing = null
    this.ended = false
    this.endEmitted = false
    this.reading = false

    // a flag to be able to tell if the event 'readable'/'data' is emitted
    // immediately, or on a later tick.  We set this to true at first, because
    // any actions that shouldn't happen until "later" should generally also
    // not happen before the first read call.
    this.sync = true

    // whenever we return null, then we set a flag to say
    // that we're awaiting a 'readable' event emission.
    this.needReadable = false
    this.emittedReadable = false
    this.readableListening = false
    this.resumeScheduled = false
    this.paused = true

    // Should close be emitted on destroy. Defaults to true.
    this.emitClose = options.emitClose !== false

    // Should .destroy() be called after 'end' (and potentially 'finish')
    this.autoDestroy = !!options.autoDestroy

    // has it been destroyed
    this.destroyed = false

    // Crypto is kind of old and crusty.  Historically, its default string
    // encoding is 'binary' so we have to make this configurable.
    // Everything else in the universe uses 'utf8', though.
    this.defaultEncoding = options.defaultEncoding || 'utf8'

    // the number of writers that are awaiting a drain event in .pipe()s
    this.awaitDrain = 0

    // if true, a maybeReadMore has been scheduled
    this.readingMore = false
    this.decoder = null
    this.encoding = null
    if (options.encoding) {
      if (!StringDecoder) StringDecoder = requireString_decoder().StringDecoder
      this.decoder = new StringDecoder(options.encoding)
      this.encoding = options.encoding
    }
  }
  function Readable(options) {
    Duplex = Duplex || require_stream_duplex()
    if (!(this instanceof Readable)) return new Readable(options)

    // Checking for a Stream.Duplex instance is faster here instead of inside
    // the ReadableState constructor, at least with V8 6.5
    var isDuplex = this instanceof Duplex
    this._readableState = new ReadableState(options, this, isDuplex)

    // legacy
    this.readable = true
    if (options) {
      if (typeof options.read === 'function') this._read = options.read
      if (typeof options.destroy === 'function') this._destroy = options.destroy
    }
    Stream.call(this)
  }
  Object.defineProperty(Readable.prototype, 'destroyed', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      if (this._readableState === undefined) {
        return false
      }
      return this._readableState.destroyed
    },
    set: function set(value) {
      // we ignore the value if the stream
      // has not been initialized yet
      if (!this._readableState) {
        return
      }

      // backward compatibility, the user is explicitly
      // managing destroyed
      this._readableState.destroyed = value
    },
  })
  Readable.prototype.destroy = destroyImpl.destroy
  Readable.prototype._undestroy = destroyImpl.undestroy
  Readable.prototype._destroy = function (err, cb) {
    cb(err)
  }

  // Manually shove something into the read() buffer.
  // This returns true if the highWaterMark has not been hit yet,
  // similar to how Writable.write() returns true if you should
  // write() some more.
  Readable.prototype.push = function (chunk, encoding) {
    var state = this._readableState
    var skipChunkCheck
    if (!state.objectMode) {
      if (typeof chunk === 'string') {
        encoding = encoding || state.defaultEncoding
        if (encoding !== state.encoding) {
          chunk = Buffer.from(chunk, encoding)
          encoding = ''
        }
        skipChunkCheck = true
      }
    } else {
      skipChunkCheck = true
    }
    return readableAddChunk(this, chunk, encoding, false, skipChunkCheck)
  }

  // Unshift should *always* be something directly out of read()
  Readable.prototype.unshift = function (chunk) {
    return readableAddChunk(this, chunk, null, true, false)
  }
  function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
    debug('readableAddChunk', chunk)
    var state = stream._readableState
    if (chunk === null) {
      state.reading = false
      onEofChunk(stream, state)
    } else {
      var er
      if (!skipChunkCheck) er = chunkInvalid(state, chunk)
      if (er) {
        errorOrDestroy(stream, er)
      } else if (state.objectMode || (chunk && chunk.length > 0)) {
        if (
          typeof chunk !== 'string' &&
          !state.objectMode &&
          Object.getPrototypeOf(chunk) !== Buffer.prototype
        ) {
          chunk = _uint8ArrayToBuffer(chunk)
        }
        if (addToFront) {
          if (state.endEmitted) errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT())
          else addChunk(stream, state, chunk, true)
        } else if (state.ended) {
          errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF())
        } else if (state.destroyed) {
          return false
        } else {
          state.reading = false
          if (state.decoder && !encoding) {
            chunk = state.decoder.write(chunk)
            if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false)
            else maybeReadMore(stream, state)
          } else {
            addChunk(stream, state, chunk, false)
          }
        }
      } else if (!addToFront) {
        state.reading = false
        maybeReadMore(stream, state)
      }
    }

    // We can push more data if we are below the highWaterMark.
    // Also, if we have no data yet, we can stand some more bytes.
    // This is to work around cases where hwm=0, such as the repl.
    return !state.ended && (state.length < state.highWaterMark || state.length === 0)
  }
  function addChunk(stream, state, chunk, addToFront) {
    if (state.flowing && state.length === 0 && !state.sync) {
      state.awaitDrain = 0
      stream.emit('data', chunk)
    } else {
      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length
      if (addToFront) state.buffer.unshift(chunk)
      else state.buffer.push(chunk)
      if (state.needReadable) emitReadable(stream)
    }
    maybeReadMore(stream, state)
  }
  function chunkInvalid(state, chunk) {
    var er
    if (
      !_isUint8Array(chunk) &&
      typeof chunk !== 'string' &&
      chunk !== undefined &&
      !state.objectMode
    ) {
      er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer', 'Uint8Array'], chunk)
    }
    return er
  }
  Readable.prototype.isPaused = function () {
    return this._readableState.flowing === false
  }

  // backwards compatibility.
  Readable.prototype.setEncoding = function (enc) {
    if (!StringDecoder) StringDecoder = requireString_decoder().StringDecoder
    var decoder = new StringDecoder(enc)
    this._readableState.decoder = decoder
    // If setEncoding(null), decoder.encoding equals utf8
    this._readableState.encoding = this._readableState.decoder.encoding

    // Iterate over current buffer to convert already stored Buffers:
    var p = this._readableState.buffer.head
    var content = ''
    while (p !== null) {
      content += decoder.write(p.data)
      p = p.next
    }
    this._readableState.buffer.clear()
    if (content !== '') this._readableState.buffer.push(content)
    this._readableState.length = content.length
    return this
  }

  // Don't raise the hwm > 1GB
  var MAX_HWM = 0x40000000
  function computeNewHighWaterMark(n) {
    if (n >= MAX_HWM) {
      // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
      n = MAX_HWM
    } else {
      // Get the next highest power of 2 to prevent increasing hwm excessively in
      // tiny amounts
      n--
      n |= n >>> 1
      n |= n >>> 2
      n |= n >>> 4
      n |= n >>> 8
      n |= n >>> 16
      n++
    }
    return n
  }

  // This function is designed to be inlinable, so please take care when making
  // changes to the function body.
  function howMuchToRead(n, state) {
    if (n <= 0 || (state.length === 0 && state.ended)) return 0
    if (state.objectMode) return 1
    if (n !== n) {
      // Only flow one buffer at a time
      if (state.flowing && state.length) return state.buffer.head.data.length
      else return state.length
    }
    // If we're asking for more than the current hwm, then raise the hwm.
    if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n)
    if (n <= state.length) return n
    // Don't have enough
    if (!state.ended) {
      state.needReadable = true
      return 0
    }
    return state.length
  }

  // you can override either this method, or the async _read(n) below.
  Readable.prototype.read = function (n) {
    debug('read', n)
    n = parseInt(n, 10)
    var state = this._readableState
    var nOrig = n
    if (n !== 0) state.emittedReadable = false

    // if we're doing read(0) to trigger a readable event, but we
    // already have a bunch of data in the buffer, then just trigger
    // the 'readable' event and move on.
    if (
      n === 0 &&
      state.needReadable &&
      ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) ||
        state.ended)
    ) {
      debug('read: emitReadable', state.length, state.ended)
      if (state.length === 0 && state.ended) endReadable(this)
      else emitReadable(this)
      return null
    }
    n = howMuchToRead(n, state)

    // if we've ended, and we're now clear, then finish it up.
    if (n === 0 && state.ended) {
      if (state.length === 0) endReadable(this)
      return null
    }

    // All the actual chunk generation logic needs to be
    // *below* the call to _read.  The reason is that in certain
    // synthetic stream cases, such as passthrough streams, _read
    // may be a completely synchronous operation which may change
    // the state of the read buffer, providing enough data when
    // before there was *not* enough.
    //
    // So, the steps are:
    // 1. Figure out what the state of things will be after we do
    // a read from the buffer.
    //
    // 2. If that resulting state will trigger a _read, then call _read.
    // Note that this may be asynchronous, or synchronous.  Yes, it is
    // deeply ugly to write APIs this way, but that still doesn't mean
    // that the Readable class should behave improperly, as streams are
    // designed to be sync/async agnostic.
    // Take note if the _read call is sync or async (ie, if the read call
    // has returned yet), so that we know whether or not it's safe to emit
    // 'readable' etc.
    //
    // 3. Actually pull the requested chunks out of the buffer and return.

    // if we need a readable event, then we need to do some reading.
    var doRead = state.needReadable
    debug('need readable', doRead)

    // if we currently have less than the highWaterMark, then also read some
    if (state.length === 0 || state.length - n < state.highWaterMark) {
      doRead = true
      debug('length less than watermark', doRead)
    }

    // however, if we've ended, then there's no point, and if we're already
    // reading, then it's unnecessary.
    if (state.ended || state.reading) {
      doRead = false
      debug('reading or ended', doRead)
    } else if (doRead) {
      debug('do read')
      state.reading = true
      state.sync = true
      // if the length is currently zero, then we *need* a readable event.
      if (state.length === 0) state.needReadable = true
      // call internal read method
      this._read(state.highWaterMark)
      state.sync = false
      // If _read pushed data synchronously, then `reading` will be false,
      // and we need to re-evaluate how much data we can return to the user.
      if (!state.reading) n = howMuchToRead(nOrig, state)
    }
    var ret
    if (n > 0) ret = fromList(n, state)
    else ret = null
    if (ret === null) {
      state.needReadable = state.length <= state.highWaterMark
      n = 0
    } else {
      state.length -= n
      state.awaitDrain = 0
    }
    if (state.length === 0) {
      // If we have nothing in the buffer, then we want to know
      // as soon as we *do* get something into the buffer.
      if (!state.ended) state.needReadable = true

      // If we tried to read() past the EOF, then emit end on the next tick.
      if (nOrig !== n && state.ended) endReadable(this)
    }
    if (ret !== null) this.emit('data', ret)
    return ret
  }
  function onEofChunk(stream, state) {
    debug('onEofChunk')
    if (state.ended) return
    if (state.decoder) {
      var chunk = state.decoder.end()
      if (chunk && chunk.length) {
        state.buffer.push(chunk)
        state.length += state.objectMode ? 1 : chunk.length
      }
    }
    state.ended = true
    if (state.sync) {
      // if we are sync, wait until next tick to emit the data.
      // Otherwise we risk emitting data in the flow()
      // the readable code triggers during a read() call
      emitReadable(stream)
    } else {
      // emit 'readable' now to make sure it gets picked up.
      state.needReadable = false
      if (!state.emittedReadable) {
        state.emittedReadable = true
        emitReadable_(stream)
      }
    }
  }

  // Don't emit readable right away in sync mode, because this can trigger
  // another read() call => stack overflow.  This way, it might trigger
  // a nextTick recursion warning, but that's not so bad.
  function emitReadable(stream) {
    var state = stream._readableState
    debug('emitReadable', state.needReadable, state.emittedReadable)
    state.needReadable = false
    if (!state.emittedReadable) {
      debug('emitReadable', state.flowing)
      state.emittedReadable = true
      process.nextTick(emitReadable_, stream)
    }
  }
  function emitReadable_(stream) {
    var state = stream._readableState
    debug('emitReadable_', state.destroyed, state.length, state.ended)
    if (!state.destroyed && (state.length || state.ended)) {
      stream.emit('readable')
      state.emittedReadable = false
    }

    // The stream needs another readable event if
    // 1. It is not flowing, as the flow mechanism will take
    //    care of it.
    // 2. It is not ended.
    // 3. It is below the highWaterMark, so we can schedule
    //    another readable later.
    state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark
    flow(stream)
  }

  // at this point, the user has presumably seen the 'readable' event,
  // and called read() to consume some data.  that may have triggered
  // in turn another _read(n) call, in which case reading = true if
  // it's in progress.
  // However, if we're not ended, or reading, and the length < hwm,
  // then go ahead and try to read some more preemptively.
  function maybeReadMore(stream, state) {
    if (!state.readingMore) {
      state.readingMore = true
      process.nextTick(maybeReadMore_, stream, state)
    }
  }
  function maybeReadMore_(stream, state) {
    // Attempt to read more data if we should.
    //
    // The conditions for reading more data are (one of):
    // - Not enough data buffered (state.length < state.highWaterMark). The loop
    //   is responsible for filling the buffer with enough data if such data
    //   is available. If highWaterMark is 0 and we are not in the flowing mode
    //   we should _not_ attempt to buffer any extra data. We'll get more data
    //   when the stream consumer calls read() instead.
    // - No data in the buffer, and the stream is in flowing mode. In this mode
    //   the loop below is responsible for ensuring read() is called. Failing to
    //   call read here would abort the flow and there's no other mechanism for
    //   continuing the flow if the stream consumer has just subscribed to the
    //   'data' event.
    //
    // In addition to the above conditions to keep reading data, the following
    // conditions prevent the data from being read:
    // - The stream has ended (state.ended).
    // - There is already a pending 'read' operation (state.reading). This is a
    //   case where the the stream has called the implementation defined _read()
    //   method, but they are processing the call asynchronously and have _not_
    //   called push() with new data. In this case we skip performing more
    //   read()s. The execution ends in this method again after the _read() ends
    //   up calling push() with more data.
    while (
      !state.reading &&
      !state.ended &&
      (state.length < state.highWaterMark || (state.flowing && state.length === 0))
    ) {
      var len = state.length
      debug('maybeReadMore read 0')
      stream.read(0)
      if (len === state.length)
        // didn't get any data, stop spinning.
        break
    }
    state.readingMore = false
  }

  // abstract method.  to be overridden in specific implementation classes.
  // call cb(er, data) where data is <= n in length.
  // for virtual (non-string, non-buffer) streams, "length" is somewhat
  // arbitrary, and perhaps not very meaningful.
  Readable.prototype._read = function (n) {
    errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'))
  }
  Readable.prototype.pipe = function (dest, pipeOpts) {
    var src = this
    var state = this._readableState
    switch (state.pipesCount) {
      case 0:
        state.pipes = dest
        break
      case 1:
        state.pipes = [state.pipes, dest]
        break
      default:
        state.pipes.push(dest)
        break
    }
    state.pipesCount += 1
    debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts)
    var doEnd =
      (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr
    var endFn = doEnd ? onend : unpipe
    if (state.endEmitted) process.nextTick(endFn)
    else src.once('end', endFn)
    dest.on('unpipe', onunpipe)
    function onunpipe(readable, unpipeInfo) {
      debug('onunpipe')
      if (readable === src) {
        if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
          unpipeInfo.hasUnpiped = true
          cleanup()
        }
      }
    }
    function onend() {
      debug('onend')
      dest.end()
    }

    // when the dest drains, it reduces the awaitDrain counter
    // on the source.  This would be more elegant with a .once()
    // handler in flow(), but adding and removing repeatedly is
    // too slow.
    var ondrain = pipeOnDrain(src)
    dest.on('drain', ondrain)
    var cleanedUp = false
    function cleanup() {
      debug('cleanup')
      // cleanup event handlers once the pipe is broken
      dest.removeListener('close', onclose)
      dest.removeListener('finish', onfinish)
      dest.removeListener('drain', ondrain)
      dest.removeListener('error', onerror)
      dest.removeListener('unpipe', onunpipe)
      src.removeListener('end', onend)
      src.removeListener('end', unpipe)
      src.removeListener('data', ondata)
      cleanedUp = true

      // if the reader is waiting for a drain event from this
      // specific writer, then it would cause it to never start
      // flowing again.
      // So, if this is awaiting a drain, then we just call it now.
      // If we don't know, then assume that we are waiting for one.
      if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain()
    }
    src.on('data', ondata)
    function ondata(chunk) {
      debug('ondata')
      var ret = dest.write(chunk)
      debug('dest.write', ret)
      if (ret === false) {
        // If the user unpiped during `dest.write()`, it is possible
        // to get stuck in a permanently paused state if that write
        // also returned false.
        // => Check whether `dest` is still a piping destination.
        if (
          ((state.pipesCount === 1 && state.pipes === dest) ||
            (state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1)) &&
          !cleanedUp
        ) {
          debug('false write response, pause', state.awaitDrain)
          state.awaitDrain++
        }
        src.pause()
      }
    }

    // if the dest has an error, then stop piping into it.
    // however, don't suppress the throwing behavior for this.
    function onerror(er) {
      debug('onerror', er)
      unpipe()
      dest.removeListener('error', onerror)
      if (EElistenerCount(dest, 'error') === 0) errorOrDestroy(dest, er)
    }

    // Make sure our error handler is attached before userland ones.
    prependListener(dest, 'error', onerror)

    // Both close and finish should trigger unpipe, but only once.
    function onclose() {
      dest.removeListener('finish', onfinish)
      unpipe()
    }
    dest.once('close', onclose)
    function onfinish() {
      debug('onfinish')
      dest.removeListener('close', onclose)
      unpipe()
    }
    dest.once('finish', onfinish)
    function unpipe() {
      debug('unpipe')
      src.unpipe(dest)
    }

    // tell the dest that it's being piped to
    dest.emit('pipe', src)

    // start the flow if it hasn't been started already.
    if (!state.flowing) {
      debug('pipe resume')
      src.resume()
    }
    return dest
  }
  function pipeOnDrain(src) {
    return function pipeOnDrainFunctionResult() {
      var state = src._readableState
      debug('pipeOnDrain', state.awaitDrain)
      if (state.awaitDrain) state.awaitDrain--
      if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
        state.flowing = true
        flow(src)
      }
    }
  }
  Readable.prototype.unpipe = function (dest) {
    var state = this._readableState
    var unpipeInfo = {
      hasUnpiped: false,
    }

    // if we're not piping anywhere, then do nothing.
    if (state.pipesCount === 0) return this

    // just one destination.  most common case.
    if (state.pipesCount === 1) {
      // passed in one, but it's not the right one.
      if (dest && dest !== state.pipes) return this
      if (!dest) dest = state.pipes

      // got a match.
      state.pipes = null
      state.pipesCount = 0
      state.flowing = false
      if (dest) dest.emit('unpipe', this, unpipeInfo)
      return this
    }

    // slow case. multiple pipe destinations.

    if (!dest) {
      // remove all.
      var dests = state.pipes
      var len = state.pipesCount
      state.pipes = null
      state.pipesCount = 0
      state.flowing = false
      for (var i = 0; i < len; i++)
        dests[i].emit('unpipe', this, {
          hasUnpiped: false,
        })
      return this
    }

    // try to find the right one.
    var index = indexOf(state.pipes, dest)
    if (index === -1) return this
    state.pipes.splice(index, 1)
    state.pipesCount -= 1
    if (state.pipesCount === 1) state.pipes = state.pipes[0]
    dest.emit('unpipe', this, unpipeInfo)
    return this
  }

  // set up data events if they are asked for
  // Ensure readable listeners eventually get something
  Readable.prototype.on = function (ev, fn) {
    var res = Stream.prototype.on.call(this, ev, fn)
    var state = this._readableState
    if (ev === 'data') {
      // update readableListening so that resume() may be a no-op
      // a few lines down. This is needed to support once('readable').
      state.readableListening = this.listenerCount('readable') > 0

      // Try start flowing on next tick if stream isn't explicitly paused
      if (state.flowing !== false) this.resume()
    } else if (ev === 'readable') {
      if (!state.endEmitted && !state.readableListening) {
        state.readableListening = state.needReadable = true
        state.flowing = false
        state.emittedReadable = false
        debug('on readable', state.length, state.reading)
        if (state.length) {
          emitReadable(this)
        } else if (!state.reading) {
          process.nextTick(nReadingNextTick, this)
        }
      }
    }
    return res
  }
  Readable.prototype.addListener = Readable.prototype.on
  Readable.prototype.removeListener = function (ev, fn) {
    var res = Stream.prototype.removeListener.call(this, ev, fn)
    if (ev === 'readable') {
      // We need to check if there is someone still listening to
      // readable and reset the state. However this needs to happen
      // after readable has been emitted but before I/O (nextTick) to
      // support once('readable', fn) cycles. This means that calling
      // resume within the same tick will have no
      // effect.
      process.nextTick(updateReadableListening, this)
    }
    return res
  }
  Readable.prototype.removeAllListeners = function (ev) {
    var res = Stream.prototype.removeAllListeners.apply(this, arguments)
    if (ev === 'readable' || ev === undefined) {
      // We need to check if there is someone still listening to
      // readable and reset the state. However this needs to happen
      // after readable has been emitted but before I/O (nextTick) to
      // support once('readable', fn) cycles. This means that calling
      // resume within the same tick will have no
      // effect.
      process.nextTick(updateReadableListening, this)
    }
    return res
  }
  function updateReadableListening(self) {
    var state = self._readableState
    state.readableListening = self.listenerCount('readable') > 0
    if (state.resumeScheduled && !state.paused) {
      // flowing needs to be set to true now, otherwise
      // the upcoming resume will not flow.
      state.flowing = true

      // crude way to check if we should resume
    } else if (self.listenerCount('data') > 0) {
      self.resume()
    }
  }
  function nReadingNextTick(self) {
    debug('readable nexttick read 0')
    self.read(0)
  }

  // pause() and resume() are remnants of the legacy readable stream API
  // If the user uses them, then switch into old mode.
  Readable.prototype.resume = function () {
    var state = this._readableState
    if (!state.flowing) {
      debug('resume')
      // we flow only if there is no one listening
      // for readable, but we still have to call
      // resume()
      state.flowing = !state.readableListening
      resume(this, state)
    }
    state.paused = false
    return this
  }
  function resume(stream, state) {
    if (!state.resumeScheduled) {
      state.resumeScheduled = true
      process.nextTick(resume_, stream, state)
    }
  }
  function resume_(stream, state) {
    debug('resume', state.reading)
    if (!state.reading) {
      stream.read(0)
    }
    state.resumeScheduled = false
    stream.emit('resume')
    flow(stream)
    if (state.flowing && !state.reading) stream.read(0)
  }
  Readable.prototype.pause = function () {
    debug('call pause flowing=%j', this._readableState.flowing)
    if (this._readableState.flowing !== false) {
      debug('pause')
      this._readableState.flowing = false
      this.emit('pause')
    }
    this._readableState.paused = true
    return this
  }
  function flow(stream) {
    var state = stream._readableState
    debug('flow', state.flowing)
    while (state.flowing && stream.read() !== null);
  }

  // wrap an old-style stream as the async data source.
  // This is *not* part of the readable stream interface.
  // It is an ugly unfortunate mess of history.
  Readable.prototype.wrap = function (stream) {
    var _this = this
    var state = this._readableState
    var paused = false
    stream.on('end', function () {
      debug('wrapped end')
      if (state.decoder && !state.ended) {
        var chunk = state.decoder.end()
        if (chunk && chunk.length) _this.push(chunk)
      }
      _this.push(null)
    })
    stream.on('data', function (chunk) {
      debug('wrapped data')
      if (state.decoder) chunk = state.decoder.write(chunk)

      // don't skip over falsy values in objectMode
      if (state.objectMode && (chunk === null || chunk === undefined)) return
      else if (!state.objectMode && (!chunk || !chunk.length)) return
      var ret = _this.push(chunk)
      if (!ret) {
        paused = true
        stream.pause()
      }
    })

    // proxy all the other methods.
    // important when wrapping filters and duplexes.
    for (var i in stream) {
      if (this[i] === undefined && typeof stream[i] === 'function') {
        this[i] = (function methodWrap(method) {
          return function methodWrapReturnFunction() {
            return stream[method].apply(stream, arguments)
          }
        })(i)
      }
    }

    // proxy certain important events.
    for (var n = 0; n < kProxyEvents.length; n++) {
      stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]))
    }

    // when we try to consume some more bytes, simply unpause the
    // underlying stream.
    this._read = function (n) {
      debug('wrapped _read', n)
      if (paused) {
        paused = false
        stream.resume()
      }
    }
    return this
  }
  if (typeof Symbol === 'function') {
    Readable.prototype[Symbol.asyncIterator] = function () {
      if (createReadableStreamAsyncIterator === undefined) {
        createReadableStreamAsyncIterator = requireAsync_iterator()
      }
      return createReadableStreamAsyncIterator(this)
    }
  }
  Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._readableState.highWaterMark
    },
  })
  Object.defineProperty(Readable.prototype, 'readableBuffer', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._readableState && this._readableState.buffer
    },
  })
  Object.defineProperty(Readable.prototype, 'readableFlowing', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._readableState.flowing
    },
    set: function set(state) {
      if (this._readableState) {
        this._readableState.flowing = state
      }
    },
  })

  // exposed for testing purposes only.
  Readable._fromList = fromList
  Object.defineProperty(Readable.prototype, 'readableLength', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._readableState.length
    },
  })

  // Pluck off n bytes from an array of buffers.
  // Length is the combined lengths of all the buffers in the list.
  // This function is designed to be inlinable, so please take care when making
  // changes to the function body.
  function fromList(n, state) {
    // nothing buffered
    if (state.length === 0) return null
    var ret
    if (state.objectMode) ret = state.buffer.shift()
    else if (!n || n >= state.length) {
      // read it all, truncate the list
      if (state.decoder) ret = state.buffer.join('')
      else if (state.buffer.length === 1) ret = state.buffer.first()
      else ret = state.buffer.concat(state.length)
      state.buffer.clear()
    } else {
      // read part of list
      ret = state.buffer.consume(n, state.decoder)
    }
    return ret
  }
  function endReadable(stream) {
    var state = stream._readableState
    debug('endReadable', state.endEmitted)
    if (!state.endEmitted) {
      state.ended = true
      process.nextTick(endReadableNT, state, stream)
    }
  }
  function endReadableNT(state, stream) {
    debug('endReadableNT', state.endEmitted, state.length)

    // Check that we didn't get one last unshift.
    if (!state.endEmitted && state.length === 0) {
      state.endEmitted = true
      stream.readable = false
      stream.emit('end')
      if (state.autoDestroy) {
        // In case of duplex streams we need a way to detect
        // if the writable side is ready for autoDestroy as well
        var wState = stream._writableState
        if (!wState || (wState.autoDestroy && wState.finished)) {
          stream.destroy()
        }
      }
    }
  }
  if (typeof Symbol === 'function') {
    Readable.from = function (iterable, opts) {
      if (from === undefined) {
        from = requireFrom()
      }
      return from(Readable, iterable, opts)
    }
  }
  function indexOf(xs, x) {
    for (var i = 0, l = xs.length; i < l; i++) {
      if (xs[i] === x) return i
    }
    return -1
  }
  return _stream_readable
}

var _stream_duplex
var hasRequired_stream_duplex

function require_stream_duplex() {
  if (hasRequired_stream_duplex) return _stream_duplex
  hasRequired_stream_duplex = 1

  /*<replacement>*/
  var objectKeys =
    Object.keys ||
    function (obj) {
      var keys = []
      for (var key in obj) keys.push(key)
      return keys
    }
  /*</replacement>*/

  _stream_duplex = Duplex
  var Readable = require_stream_readable()
  var Writable = require_stream_writable()
  requireInherits()(Duplex, Readable)
  {
    // Allow the keys array to be GC'ed.
    var keys = objectKeys(Writable.prototype)
    for (var v = 0; v < keys.length; v++) {
      var method = keys[v]
      if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method]
    }
  }
  function Duplex(options) {
    if (!(this instanceof Duplex)) return new Duplex(options)
    Readable.call(this, options)
    Writable.call(this, options)
    this.allowHalfOpen = true
    if (options) {
      if (options.readable === false) this.readable = false
      if (options.writable === false) this.writable = false
      if (options.allowHalfOpen === false) {
        this.allowHalfOpen = false
        this.once('end', onend)
      }
    }
  }
  Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState.highWaterMark
    },
  })
  Object.defineProperty(Duplex.prototype, 'writableBuffer', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState && this._writableState.getBuffer()
    },
  })
  Object.defineProperty(Duplex.prototype, 'writableLength', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState.length
    },
  })

  // the no-half-open enforcer
  function onend() {
    // If the writable side ended, then we're ok.
    if (this._writableState.ended) return

    // no more data can be written.
    // But allow more writes to happen in this tick.
    process.nextTick(onEndNT, this)
  }
  function onEndNT(self) {
    self.end()
  }
  Object.defineProperty(Duplex.prototype, 'destroyed', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      if (this._readableState === undefined || this._writableState === undefined) {
        return false
      }
      return this._readableState.destroyed && this._writableState.destroyed
    },
    set: function set(value) {
      // we ignore the value if the stream
      // has not been initialized yet
      if (this._readableState === undefined || this._writableState === undefined) {
        return
      }

      // backward compatibility, the user is explicitly
      // managing destroyed
      this._readableState.destroyed = value
      this._writableState.destroyed = value
    },
  })
  return _stream_duplex
}

var _stream_writable
var hasRequired_stream_writable

function require_stream_writable() {
  if (hasRequired_stream_writable) return _stream_writable
  hasRequired_stream_writable = 1

  _stream_writable = Writable

  // It seems a linked list but it is not
  // there will be only 2 of these for each stream
  function CorkedRequest(state) {
    var _this = this
    this.next = null
    this.entry = null
    this.finish = function () {
      onCorkedFinish(_this, state)
    }
  }
  /* </replacement> */

  /*<replacement>*/
  var Duplex
  /*</replacement>*/

  Writable.WritableState = WritableState

  /*<replacement>*/
  var internalUtil = {
    deprecate: requireNode$1(),
  }
  /*</replacement>*/

  /*<replacement>*/
  var Stream = requireStream$1()
  /*</replacement>*/

  var Buffer = require$$0$4.Buffer
  var OurUint8Array =
    (typeof commonjsGlobal !== 'undefined'
      ? commonjsGlobal
      : typeof window !== 'undefined'
        ? window
        : typeof self !== 'undefined'
          ? self
          : {}
    ).Uint8Array || function () {}
  function _uint8ArrayToBuffer(chunk) {
    return Buffer.from(chunk)
  }
  function _isUint8Array(obj) {
    return Buffer.isBuffer(obj) || obj instanceof OurUint8Array
  }
  var destroyImpl = requireDestroy()
  var _require = requireState(),
    getHighWaterMark = _require.getHighWaterMark
  var _require$codes = requireErrors().codes,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
    ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED,
    ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES,
    ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END,
    ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING
  var errorOrDestroy = destroyImpl.errorOrDestroy
  requireInherits()(Writable, Stream)
  function nop() {}
  function WritableState(options, stream, isDuplex) {
    Duplex = Duplex || require_stream_duplex()
    options = options || {}

    // Duplex streams are both readable and writable, but share
    // the same options object.
    // However, some cases require setting options to different
    // values for the readable and the writable sides of the duplex stream,
    // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.
    if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex

    // object stream flag to indicate whether or not this stream
    // contains buffers or objects.
    this.objectMode = !!options.objectMode
    if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode

    // the point at which write() starts returning false
    // Note: 0 is a valid value, means that we always return false if
    // the entire buffer is not flushed immediately on write()
    this.highWaterMark = getHighWaterMark(this, options, 'writableHighWaterMark', isDuplex)

    // if _final has been called
    this.finalCalled = false

    // drain event flag.
    this.needDrain = false
    // at the start of calling end()
    this.ending = false
    // when end() has been called, and returned
    this.ended = false
    // when 'finish' is emitted
    this.finished = false

    // has it been destroyed
    this.destroyed = false

    // should we decode strings into buffers before passing to _write?
    // this is here so that some node-core streams can optimize string
    // handling at a lower level.
    var noDecode = options.decodeStrings === false
    this.decodeStrings = !noDecode

    // Crypto is kind of old and crusty.  Historically, its default string
    // encoding is 'binary' so we have to make this configurable.
    // Everything else in the universe uses 'utf8', though.
    this.defaultEncoding = options.defaultEncoding || 'utf8'

    // not an actual buffer we keep track of, but a measurement
    // of how much we're waiting to get pushed to some underlying
    // socket or file.
    this.length = 0

    // a flag to see when we're in the middle of a write.
    this.writing = false

    // when true all writes will be buffered until .uncork() call
    this.corked = 0

    // a flag to be able to tell if the onwrite cb is called immediately,
    // or on a later tick.  We set this to true at first, because any
    // actions that shouldn't happen until "later" should generally also
    // not happen before the first write call.
    this.sync = true

    // a flag to know if we're processing previously buffered items, which
    // may call the _write() callback in the same tick, so that we don't
    // end up in an overlapped onwrite situation.
    this.bufferProcessing = false

    // the callback that's passed to _write(chunk,cb)
    this.onwrite = function (er) {
      onwrite(stream, er)
    }

    // the callback that the user supplies to write(chunk,encoding,cb)
    this.writecb = null

    // the amount that is being written when _write is called.
    this.writelen = 0
    this.bufferedRequest = null
    this.lastBufferedRequest = null

    // number of pending user-supplied write callbacks
    // this must be 0 before 'finish' can be emitted
    this.pendingcb = 0

    // emit prefinish if the only thing we're waiting for is _write cbs
    // This is relevant for synchronous Transform streams
    this.prefinished = false

    // True if the error was already emitted and should not be thrown again
    this.errorEmitted = false

    // Should close be emitted on destroy. Defaults to true.
    this.emitClose = options.emitClose !== false

    // Should .destroy() be called after 'finish' (and potentially 'end')
    this.autoDestroy = !!options.autoDestroy

    // count buffered requests
    this.bufferedRequestCount = 0

    // allocate the first CorkedRequest, there is always
    // one allocated and free to use, and we maintain at most two
    this.corkedRequestsFree = new CorkedRequest(this)
  }
  WritableState.prototype.getBuffer = function getBuffer() {
    var current = this.bufferedRequest
    var out = []
    while (current) {
      out.push(current)
      current = current.next
    }
    return out
  }
  ;(function () {
    try {
      Object.defineProperty(WritableState.prototype, 'buffer', {
        get: internalUtil.deprecate(
          function writableStateBufferGetter() {
            return this.getBuffer()
          },
          '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.',
          'DEP0003',
        ),
      })
    } catch (_) {}
  })()

  // Test _writableState for inheritance to account for Duplex streams,
  // whose prototype chain only points to Readable.
  var realHasInstance
  if (
    typeof Symbol === 'function' &&
    Symbol.hasInstance &&
    typeof Function.prototype[Symbol.hasInstance] === 'function'
  ) {
    realHasInstance = Function.prototype[Symbol.hasInstance]
    Object.defineProperty(Writable, Symbol.hasInstance, {
      value: function value(object) {
        if (realHasInstance.call(this, object)) return true
        if (this !== Writable) return false
        return object && object._writableState instanceof WritableState
      },
    })
  } else {
    realHasInstance = function realHasInstance(object) {
      return object instanceof this
    }
  }
  function Writable(options) {
    Duplex = Duplex || require_stream_duplex()

    // Writable ctor is applied to Duplexes, too.
    // `realHasInstance` is necessary because using plain `instanceof`
    // would return false, as no `_writableState` property is attached.

    // Trying to use the custom `instanceof` for Writable here will also break the
    // Node.js LazyTransform implementation, which has a non-trivial getter for
    // `_writableState` that would lead to infinite recursion.

    // Checking for a Stream.Duplex instance is faster here instead of inside
    // the WritableState constructor, at least with V8 6.5
    var isDuplex = this instanceof Duplex
    if (!isDuplex && !realHasInstance.call(Writable, this)) return new Writable(options)
    this._writableState = new WritableState(options, this, isDuplex)

    // legacy.
    this.writable = true
    if (options) {
      if (typeof options.write === 'function') this._write = options.write
      if (typeof options.writev === 'function') this._writev = options.writev
      if (typeof options.destroy === 'function') this._destroy = options.destroy
      if (typeof options.final === 'function') this._final = options.final
    }
    Stream.call(this)
  }

  // Otherwise people can pipe Writable streams, which is just wrong.
  Writable.prototype.pipe = function () {
    errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE())
  }
  function writeAfterEnd(stream, cb) {
    var er = new ERR_STREAM_WRITE_AFTER_END()
    // TODO: defer error events consistently everywhere, not just the cb
    errorOrDestroy(stream, er)
    process.nextTick(cb, er)
  }

  // Checks that a user-supplied chunk is valid, especially for the particular
  // mode the stream is in. Currently this means that `null` is never accepted
  // and undefined/non-string values are only allowed in object mode.
  function validChunk(stream, state, chunk, cb) {
    var er
    if (chunk === null) {
      er = new ERR_STREAM_NULL_VALUES()
    } else if (typeof chunk !== 'string' && !state.objectMode) {
      er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk)
    }
    if (er) {
      errorOrDestroy(stream, er)
      process.nextTick(cb, er)
      return false
    }
    return true
  }
  Writable.prototype.write = function (chunk, encoding, cb) {
    var state = this._writableState
    var ret = false
    var isBuf = !state.objectMode && _isUint8Array(chunk)
    if (isBuf && !Buffer.isBuffer(chunk)) {
      chunk = _uint8ArrayToBuffer(chunk)
    }
    if (typeof encoding === 'function') {
      cb = encoding
      encoding = null
    }
    if (isBuf) encoding = 'buffer'
    else if (!encoding) encoding = state.defaultEncoding
    if (typeof cb !== 'function') cb = nop
    if (state.ending) writeAfterEnd(this, cb)
    else if (isBuf || validChunk(this, state, chunk, cb)) {
      state.pendingcb++
      ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb)
    }
    return ret
  }
  Writable.prototype.cork = function () {
    this._writableState.corked++
  }
  Writable.prototype.uncork = function () {
    var state = this._writableState
    if (state.corked) {
      state.corked--
      if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest)
        clearBuffer(this, state)
    }
  }
  Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
    // node::ParseEncoding() requires lower case.
    if (typeof encoding === 'string') encoding = encoding.toLowerCase()
    if (
      !(
        [
          'hex',
          'utf8',
          'utf-8',
          'ascii',
          'binary',
          'base64',
          'ucs2',
          'ucs-2',
          'utf16le',
          'utf-16le',
          'raw',
        ].indexOf((encoding + '').toLowerCase()) > -1
      )
    )
      throw new ERR_UNKNOWN_ENCODING(encoding)
    this._writableState.defaultEncoding = encoding
    return this
  }
  Object.defineProperty(Writable.prototype, 'writableBuffer', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState && this._writableState.getBuffer()
    },
  })
  function decodeChunk(state, chunk, encoding) {
    if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
      chunk = Buffer.from(chunk, encoding)
    }
    return chunk
  }
  Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState.highWaterMark
    },
  })

  // if we're already writing something, then just put this
  // in the queue, and wait our turn.  Otherwise, call _write
  // If we return false, then we need a drain event, so set that flag.
  function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
    if (!isBuf) {
      var newChunk = decodeChunk(state, chunk, encoding)
      if (chunk !== newChunk) {
        isBuf = true
        encoding = 'buffer'
        chunk = newChunk
      }
    }
    var len = state.objectMode ? 1 : chunk.length
    state.length += len
    var ret = state.length < state.highWaterMark
    // we must ensure that previous needDrain will not be reset to false.
    if (!ret) state.needDrain = true
    if (state.writing || state.corked) {
      var last = state.lastBufferedRequest
      state.lastBufferedRequest = {
        chunk: chunk,
        encoding: encoding,
        isBuf: isBuf,
        callback: cb,
        next: null,
      }
      if (last) {
        last.next = state.lastBufferedRequest
      } else {
        state.bufferedRequest = state.lastBufferedRequest
      }
      state.bufferedRequestCount += 1
    } else {
      doWrite(stream, state, false, len, chunk, encoding, cb)
    }
    return ret
  }
  function doWrite(stream, state, writev, len, chunk, encoding, cb) {
    state.writelen = len
    state.writecb = cb
    state.writing = true
    state.sync = true
    if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write'))
    else if (writev) stream._writev(chunk, state.onwrite)
    else stream._write(chunk, encoding, state.onwrite)
    state.sync = false
  }
  function onwriteError(stream, state, sync, er, cb) {
    --state.pendingcb
    if (sync) {
      // defer the callback if we are being called synchronously
      // to avoid piling up things on the stack
      process.nextTick(cb, er)
      // this can emit finish, and it will always happen
      // after error
      process.nextTick(finishMaybe, stream, state)
      stream._writableState.errorEmitted = true
      errorOrDestroy(stream, er)
    } else {
      // the caller expect this to happen before if
      // it is async
      cb(er)
      stream._writableState.errorEmitted = true
      errorOrDestroy(stream, er)
      // this can emit finish, but finish must
      // always follow error
      finishMaybe(stream, state)
    }
  }
  function onwriteStateUpdate(state) {
    state.writing = false
    state.writecb = null
    state.length -= state.writelen
    state.writelen = 0
  }
  function onwrite(stream, er) {
    var state = stream._writableState
    var sync = state.sync
    var cb = state.writecb
    if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK()
    onwriteStateUpdate(state)
    if (er) onwriteError(stream, state, sync, er, cb)
    else {
      // Check if we're actually ready to finish, but don't emit yet
      var finished = needFinish(state) || stream.destroyed
      if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
        clearBuffer(stream, state)
      }
      if (sync) {
        process.nextTick(afterWrite, stream, state, finished, cb)
      } else {
        afterWrite(stream, state, finished, cb)
      }
    }
  }
  function afterWrite(stream, state, finished, cb) {
    if (!finished) onwriteDrain(stream, state)
    state.pendingcb--
    cb()
    finishMaybe(stream, state)
  }

  // Must force callback to be called on nextTick, so that we don't
  // emit 'drain' before the write() consumer gets the 'false' return
  // value, and has a chance to attach a 'drain' listener.
  function onwriteDrain(stream, state) {
    if (state.length === 0 && state.needDrain) {
      state.needDrain = false
      stream.emit('drain')
    }
  }

  // if there's something in the buffer waiting, then process it
  function clearBuffer(stream, state) {
    state.bufferProcessing = true
    var entry = state.bufferedRequest
    if (stream._writev && entry && entry.next) {
      // Fast case, write everything using _writev()
      var l = state.bufferedRequestCount
      var buffer = new Array(l)
      var holder = state.corkedRequestsFree
      holder.entry = entry
      var count = 0
      var allBuffers = true
      while (entry) {
        buffer[count] = entry
        if (!entry.isBuf) allBuffers = false
        entry = entry.next
        count += 1
      }
      buffer.allBuffers = allBuffers
      doWrite(stream, state, true, state.length, buffer, '', holder.finish)

      // doWrite is almost always async, defer these to save a bit of time
      // as the hot path ends with doWrite
      state.pendingcb++
      state.lastBufferedRequest = null
      if (holder.next) {
        state.corkedRequestsFree = holder.next
        holder.next = null
      } else {
        state.corkedRequestsFree = new CorkedRequest(state)
      }
      state.bufferedRequestCount = 0
    } else {
      // Slow case, write chunks one-by-one
      while (entry) {
        var chunk = entry.chunk
        var encoding = entry.encoding
        var cb = entry.callback
        var len = state.objectMode ? 1 : chunk.length
        doWrite(stream, state, false, len, chunk, encoding, cb)
        entry = entry.next
        state.bufferedRequestCount--
        // if we didn't call the onwrite immediately, then
        // it means that we need to wait until it does.
        // also, that means that the chunk and cb are currently
        // being processed, so move the buffer counter past them.
        if (state.writing) {
          break
        }
      }
      if (entry === null) state.lastBufferedRequest = null
    }
    state.bufferedRequest = entry
    state.bufferProcessing = false
  }
  Writable.prototype._write = function (chunk, encoding, cb) {
    cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'))
  }
  Writable.prototype._writev = null
  Writable.prototype.end = function (chunk, encoding, cb) {
    var state = this._writableState
    if (typeof chunk === 'function') {
      cb = chunk
      chunk = null
      encoding = null
    } else if (typeof encoding === 'function') {
      cb = encoding
      encoding = null
    }
    if (chunk !== null && chunk !== undefined) this.write(chunk, encoding)

    // .end() fully uncorks
    if (state.corked) {
      state.corked = 1
      this.uncork()
    }

    // ignore unnecessary end() calls.
    if (!state.ending) endWritable(this, state, cb)
    return this
  }
  Object.defineProperty(Writable.prototype, 'writableLength', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      return this._writableState.length
    },
  })
  function needFinish(state) {
    return (
      state.ending &&
      state.length === 0 &&
      state.bufferedRequest === null &&
      !state.finished &&
      !state.writing
    )
  }
  function callFinal(stream, state) {
    stream._final(function (err) {
      state.pendingcb--
      if (err) {
        errorOrDestroy(stream, err)
      }
      state.prefinished = true
      stream.emit('prefinish')
      finishMaybe(stream, state)
    })
  }
  function prefinish(stream, state) {
    if (!state.prefinished && !state.finalCalled) {
      if (typeof stream._final === 'function' && !state.destroyed) {
        state.pendingcb++
        state.finalCalled = true
        process.nextTick(callFinal, stream, state)
      } else {
        state.prefinished = true
        stream.emit('prefinish')
      }
    }
  }
  function finishMaybe(stream, state) {
    var need = needFinish(state)
    if (need) {
      prefinish(stream, state)
      if (state.pendingcb === 0) {
        state.finished = true
        stream.emit('finish')
        if (state.autoDestroy) {
          // In case of duplex streams we need a way to detect
          // if the readable side is ready for autoDestroy as well
          var rState = stream._readableState
          if (!rState || (rState.autoDestroy && rState.endEmitted)) {
            stream.destroy()
          }
        }
      }
    }
    return need
  }
  function endWritable(stream, state, cb) {
    state.ending = true
    finishMaybe(stream, state)
    if (cb) {
      if (state.finished) process.nextTick(cb)
      else stream.once('finish', cb)
    }
    state.ended = true
    stream.writable = false
  }
  function onCorkedFinish(corkReq, state, err) {
    var entry = corkReq.entry
    corkReq.entry = null
    while (entry) {
      var cb = entry.callback
      state.pendingcb--
      cb(err)
      entry = entry.next
    }

    // reuse the free corkReq.
    state.corkedRequestsFree.next = corkReq
  }
  Object.defineProperty(Writable.prototype, 'destroyed', {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: false,
    get: function get() {
      if (this._writableState === undefined) {
        return false
      }
      return this._writableState.destroyed
    },
    set: function set(value) {
      // we ignore the value if the stream
      // has not been initialized yet
      if (!this._writableState) {
        return
      }

      // backward compatibility, the user is explicitly
      // managing destroyed
      this._writableState.destroyed = value
    },
  })
  Writable.prototype.destroy = destroyImpl.destroy
  Writable.prototype._undestroy = destroyImpl.undestroy
  Writable.prototype._destroy = function (err, cb) {
    cb(err)
  }
  return _stream_writable
}

var hasRequiredModern

function requireModern() {
  if (hasRequiredModern) return modern.exports
  hasRequiredModern = 1

  const util = require$$0$2
  const Writable = require_stream_writable()
  const { LEVEL } = requireTripleBeam()

  /**
   * Constructor function for the TransportStream. This is the base prototype
   * that all `winston >= 3` transports should inherit from.
   * @param {Object} options - Options for this TransportStream instance
   * @param {String} options.level - Highest level according to RFC5424.
   * @param {Boolean} options.handleExceptions - If true, info with
   * { exception: true } will be written.
   * @param {Function} options.log - Custom log function for simple Transport
   * creation
   * @param {Function} options.close - Called on "unpipe" from parent.
   */
  const TransportStream = (modern.exports = function TransportStream(options = {}) {
    Writable.call(this, { objectMode: true, highWaterMark: options.highWaterMark })

    this.format = options.format
    this.level = options.level
    this.handleExceptions = options.handleExceptions
    this.handleRejections = options.handleRejections
    this.silent = options.silent

    if (options.log) this.log = options.log
    if (options.logv) this.logv = options.logv
    if (options.close) this.close = options.close

    // Get the levels from the source we are piped from.
    this.once('pipe', (logger) => {
      // Remark (indexzero): this bookkeeping can only support multiple
      // Logger parents with the same `levels`. This comes into play in
      // the `winston.Container` code in which `container.add` takes
      // a fully realized set of options with pre-constructed TransportStreams.
      this.levels = logger.levels
      this.parent = logger
    })

    // If and/or when the transport is removed from this instance
    this.once('unpipe', (src) => {
      // Remark (indexzero): this bookkeeping can only support multiple
      // Logger parents with the same `levels`. This comes into play in
      // the `winston.Container` code in which `container.add` takes
      // a fully realized set of options with pre-constructed TransportStreams.
      if (src === this.parent) {
        this.parent = null
        if (this.close) {
          this.close()
        }
      }
    })
  })

  /*
   * Inherit from Writeable using Node.js built-ins
   */
  util.inherits(TransportStream, Writable)

  /**
   * Writes the info object to our transport instance.
   * @param {mixed} info - TODO: add param description.
   * @param {mixed} enc - TODO: add param description.
   * @param {function} callback - TODO: add param description.
   * @returns {undefined}
   * @private
   */
  TransportStream.prototype._write = function _write(info, enc, callback) {
    if (this.silent || (info.exception === true && !this.handleExceptions)) {
      return callback(null)
    }

    // Remark: This has to be handled in the base transport now because we
    // cannot conditionally write to our pipe targets as stream. We always
    // prefer any explicit level set on the Transport itself falling back to
    // any level set on the parent.
    const level = this.level || (this.parent && this.parent.level)

    if (!level || this.levels[level] >= this.levels[info[LEVEL]]) {
      if (info && !this.format) {
        return this.log(info, callback)
      }

      let errState
      let transformed

      // We trap(and re-throw) any errors generated by the user-provided format, but also
      // guarantee that the streams callback is invoked so that we can continue flowing.
      try {
        transformed = this.format.transform(Object.assign({}, info), this.format.options)
      } catch (err) {
        errState = err
      }

      if (errState || !transformed) {
        // eslint-disable-next-line callback-return
        callback()
        if (errState) throw errState
        return
      }

      return this.log(transformed, callback)
    }
    this._writableState.sync = false
    return callback(null)
  }

  /**
   * Writes the batch of info objects (i.e. "object chunks") to our transport
   * instance after performing any necessary filtering.
   * @param {mixed} chunks - TODO: add params description.
   * @param {function} callback - TODO: add params description.
   * @returns {mixed} - TODO: add returns description.
   * @private
   */
  TransportStream.prototype._writev = function _writev(chunks, callback) {
    if (this.logv) {
      const infos = chunks.filter(this._accept, this)
      if (!infos.length) {
        return callback(null)
      }

      // Remark (indexzero): from a performance perspective if Transport
      // implementers do choose to implement logv should we make it their
      // responsibility to invoke their format?
      return this.logv(infos, callback)
    }

    for (let i = 0; i < chunks.length; i++) {
      if (!this._accept(chunks[i])) continue

      if (chunks[i].chunk && !this.format) {
        this.log(chunks[i].chunk, chunks[i].callback)
        continue
      }

      let errState
      let transformed

      // We trap(and re-throw) any errors generated by the user-provided format, but also
      // guarantee that the streams callback is invoked so that we can continue flowing.
      try {
        transformed = this.format.transform(Object.assign({}, chunks[i].chunk), this.format.options)
      } catch (err) {
        errState = err
      }

      if (errState || !transformed) {
        // eslint-disable-next-line callback-return
        chunks[i].callback()
        if (errState) {
          // eslint-disable-next-line callback-return
          callback(null)
          throw errState
        }
      } else {
        this.log(transformed, chunks[i].callback)
      }
    }

    return callback(null)
  }

  /**
   * Predicate function that returns true if the specfied `info` on the
   * WriteReq, `write`, should be passed down into the derived
   * TransportStream's I/O via `.log(info, callback)`.
   * @param {WriteReq} write - winston@3 Node.js WriteReq for the `info` object
   * representing the log message.
   * @returns {Boolean} - Value indicating if the `write` should be accepted &
   * logged.
   */
  TransportStream.prototype._accept = function _accept(write) {
    const info = write.chunk
    if (this.silent) {
      return false
    }

    // We always prefer any explicit level set on the Transport itself
    // falling back to any level set on the parent.
    const level = this.level || (this.parent && this.parent.level)

    // Immediately check the average case: log level filtering.
    if (info.exception === true || !level || this.levels[level] >= this.levels[info[LEVEL]]) {
      // Ensure the info object is valid based on `{ exception }`:
      // 1. { handleExceptions: true }: all `info` objects are valid
      // 2. { exception: false }: accepted by all transports.
      if (this.handleExceptions || info.exception !== true) {
        return true
      }
    }

    return false
  }

  /**
   * _nop is short for "No operation"
   * @returns {Boolean} Intentionally false.
   */
  TransportStream.prototype._nop = function _nop() {
    // eslint-disable-next-line no-undefined
    return void 0
  }
  return modern.exports
}

var legacy = { exports: {} }

var hasRequiredLegacy

function requireLegacy() {
  if (hasRequiredLegacy) return legacy.exports
  hasRequiredLegacy = 1

  const util = require$$0$2
  const { LEVEL } = requireTripleBeam()
  const TransportStream = requireModern()

  /**
   * Constructor function for the LegacyTransportStream. This is an internal
   * wrapper `winston >= 3` uses to wrap older transports implementing
   * log(level, message, meta).
   * @param {Object} options - Options for this TransportStream instance.
   * @param {Transpot} options.transport - winston@2 or older Transport to wrap.
   */

  const LegacyTransportStream = (legacy.exports = function LegacyTransportStream(options = {}) {
    TransportStream.call(this, options)
    if (!options.transport || typeof options.transport.log !== 'function') {
      throw new Error('Invalid transport, must be an object with a log method.')
    }

    this.transport = options.transport
    this.level = this.level || options.transport.level
    this.handleExceptions = this.handleExceptions || options.transport.handleExceptions

    // Display our deprecation notice.
    this._deprecated()

    // Properly bubble up errors from the transport to the
    // LegacyTransportStream instance, but only once no matter how many times
    // this transport is shared.
    function transportError(err) {
      this.emit('error', err, this.transport)
    }

    if (!this.transport.__winstonError) {
      this.transport.__winstonError = transportError.bind(this)
      this.transport.on('error', this.transport.__winstonError)
    }
  })

  /*
   * Inherit from TransportStream using Node.js built-ins
   */
  util.inherits(LegacyTransportStream, TransportStream)

  /**
   * Writes the info object to our transport instance.
   * @param {mixed} info - TODO: add param description.
   * @param {mixed} enc - TODO: add param description.
   * @param {function} callback - TODO: add param description.
   * @returns {undefined}
   * @private
   */
  LegacyTransportStream.prototype._write = function _write(info, enc, callback) {
    if (this.silent || (info.exception === true && !this.handleExceptions)) {
      return callback(null)
    }

    // Remark: This has to be handled in the base transport now because we
    // cannot conditionally write to our pipe targets as stream.
    if (!this.level || this.levels[this.level] >= this.levels[info[LEVEL]]) {
      this.transport.log(info[LEVEL], info.message, info, this._nop)
    }

    callback(null)
  }

  /**
   * Writes the batch of info objects (i.e. "object chunks") to our transport
   * instance after performing any necessary filtering.
   * @param {mixed} chunks - TODO: add params description.
   * @param {function} callback - TODO: add params description.
   * @returns {mixed} - TODO: add returns description.
   * @private
   */
  LegacyTransportStream.prototype._writev = function _writev(chunks, callback) {
    for (let i = 0; i < chunks.length; i++) {
      if (this._accept(chunks[i])) {
        this.transport.log(
          chunks[i].chunk[LEVEL],
          chunks[i].chunk.message,
          chunks[i].chunk,
          this._nop,
        )
        chunks[i].callback()
      }
    }

    return callback(null)
  }

  /**
   * Displays a deprecation notice. Defined as a function so it can be
   * overriden in tests.
   * @returns {undefined}
   */
  LegacyTransportStream.prototype._deprecated = function _deprecated() {
    // eslint-disable-next-line no-console
    console.error(
      [
        `${this.transport.name} is a legacy winston transport. Consider upgrading: `,
        '- Upgrade docs: https://github.com/winstonjs/winston/blob/master/UPGRADE-3.0.md',
      ].join('\n'),
    )
  }

  /**
   * Clean up error handling state on the legacy transport associated
   * with this instance.
   * @returns {undefined}
   */
  LegacyTransportStream.prototype.close = function close() {
    if (this.transport.close) {
      this.transport.close()
    }

    if (this.transport.__winstonError) {
      this.transport.removeListener('error', this.transport.__winstonError)
      this.transport.__winstonError = null
    }
  }
  return legacy.exports
}

var hasRequiredWinstonTransport

function requireWinstonTransport() {
  if (hasRequiredWinstonTransport) return winstonTransport.exports
  hasRequiredWinstonTransport = 1

  // Expose modern transport directly as the export
  winstonTransport.exports = requireModern()

  // Expose legacy stream
  winstonTransport.exports.LegacyTransportStream = requireLegacy()
  return winstonTransport.exports
}

/* eslint-disable no-console */

var console_1
var hasRequiredConsole

function requireConsole() {
  if (hasRequiredConsole) return console_1
  hasRequiredConsole = 1

  const os = require$$0$1
  const { LEVEL, MESSAGE } = requireTripleBeam()
  const TransportStream = requireWinstonTransport()

  /**
   * Transport for outputting to the console.
   * @type {Console}
   * @extends {TransportStream}
   */
  console_1 = class Console extends TransportStream {
    /**
     * Constructor function for the Console transport object responsible for
     * persisting log messages and metadata to a terminal or TTY.
     * @param {!Object} [options={}] - Options for this instance.
     */
    constructor(options = {}) {
      super(options)

      // Expose the name of this Transport on the prototype
      this.name = options.name || 'console'
      this.stderrLevels = this._stringArrayToSet(options.stderrLevels)
      this.consoleWarnLevels = this._stringArrayToSet(options.consoleWarnLevels)
      this.eol = typeof options.eol === 'string' ? options.eol : os.EOL
      this.forceConsole = options.forceConsole || false

      // Keep a reference to the log, warn, and error console methods
      // in case they get redirected to this transport after the logger is
      // instantiated. This prevents a circular reference issue.
      this._consoleLog = console.log.bind(console)
      this._consoleWarn = console.warn.bind(console)
      this._consoleError = console.error.bind(console)

      this.setMaxListeners(30)
    }

    /**
     * Core logging method exposed to Winston.
     * @param {Object} info - TODO: add param description.
     * @param {Function} callback - TODO: add param description.
     * @returns {undefined}
     */
    log(info, callback) {
      setImmediate(() => this.emit('logged', info))

      // Remark: what if there is no raw...?
      if (this.stderrLevels[info[LEVEL]]) {
        if (console._stderr && !this.forceConsole) {
          // Node.js maps `process.stderr` to `console._stderr`.
          console._stderr.write(`${info[MESSAGE]}${this.eol}`)
        } else {
          // console.error adds a newline
          this._consoleError(info[MESSAGE])
        }

        if (callback) {
          callback() // eslint-disable-line callback-return
        }
        return
      } else if (this.consoleWarnLevels[info[LEVEL]]) {
        if (console._stderr && !this.forceConsole) {
          // Node.js maps `process.stderr` to `console._stderr`.
          // in Node.js console.warn is an alias for console.error
          console._stderr.write(`${info[MESSAGE]}${this.eol}`)
        } else {
          // console.warn adds a newline
          this._consoleWarn(info[MESSAGE])
        }

        if (callback) {
          callback() // eslint-disable-line callback-return
        }
        return
      }

      if (console._stdout && !this.forceConsole) {
        // Node.js maps `process.stdout` to `console._stdout`.
        console._stdout.write(`${info[MESSAGE]}${this.eol}`)
      } else {
        // console.log adds a newline.
        this._consoleLog(info[MESSAGE])
      }

      if (callback) {
        callback() // eslint-disable-line callback-return
      }
    }

    /**
     * Returns a Set-like object with strArray's elements as keys (each with the
     * value true).
     * @param {Array} strArray - Array of Set-elements as strings.
     * @param {?string} [errMsg] - Custom error message thrown on invalid input.
     * @returns {Object} - TODO: add return description.
     * @private
     */
    _stringArrayToSet(strArray, errMsg) {
      if (!strArray) return {}

      errMsg = errMsg || 'Cannot make set from type other than Array of string elements'

      if (!Array.isArray(strArray)) {
        throw new Error(errMsg)
      }

      return strArray.reduce((set, el) => {
        if (typeof el !== 'string') {
          throw new Error(errMsg)
        }
        set[el] = true

        return set
      }, {})
    }
  }
  return console_1
}

var series = { exports: {} }

var parallel = { exports: {} }

var isArrayLike = { exports: {} }

var hasRequiredIsArrayLike

function requireIsArrayLike() {
  if (hasRequiredIsArrayLike) return isArrayLike.exports
  hasRequiredIsArrayLike = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.default = isArrayLike
    function isArrayLike(value) {
      return (
        value && typeof value.length === 'number' && value.length >= 0 && value.length % 1 === 0
      )
    }
    module.exports = exports.default
  })(isArrayLike, isArrayLike.exports)
  return isArrayLike.exports
}

var wrapAsync = {}

var asyncify = { exports: {} }

var initialParams = { exports: {} }

var hasRequiredInitialParams

function requireInitialParams() {
  if (hasRequiredInitialParams) return initialParams.exports
  hasRequiredInitialParams = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })

    exports.default = function (fn) {
      return function (...args /*, callback*/) {
        var callback = args.pop()
        return fn.call(this, args, callback)
      }
    }

    module.exports = exports.default
  })(initialParams, initialParams.exports)
  return initialParams.exports
}

var setImmediate$1 = {}

var hasRequiredSetImmediate

function requireSetImmediate() {
  if (hasRequiredSetImmediate) return setImmediate$1
  hasRequiredSetImmediate = 1

  Object.defineProperty(setImmediate$1, '__esModule', {
    value: true,
  })
  setImmediate$1.fallback = fallback
  setImmediate$1.wrap = wrap
  /* istanbul ignore file */

  var hasQueueMicrotask = (setImmediate$1.hasQueueMicrotask =
    typeof queueMicrotask === 'function' && queueMicrotask)
  var hasSetImmediate = (setImmediate$1.hasSetImmediate =
    typeof setImmediate === 'function' && setImmediate)
  var hasNextTick = (setImmediate$1.hasNextTick =
    typeof process === 'object' && typeof process.nextTick === 'function')

  function fallback(fn) {
    setTimeout(fn, 0)
  }

  function wrap(defer) {
    return (fn, ...args) => defer(() => fn(...args))
  }

  var _defer

  if (hasQueueMicrotask) {
    _defer = queueMicrotask
  } else if (hasSetImmediate) {
    _defer = setImmediate
  } else if (hasNextTick) {
    _defer = process.nextTick
  } else {
    _defer = fallback
  }

  setImmediate$1.default = wrap(_defer)
  return setImmediate$1
}

var hasRequiredAsyncify

function requireAsyncify() {
  if (hasRequiredAsyncify) return asyncify.exports
  hasRequiredAsyncify = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.default = asyncify

    var _initialParams = requireInitialParams()

    var _initialParams2 = _interopRequireDefault(_initialParams)

    var _setImmediate = requireSetImmediate()

    var _setImmediate2 = _interopRequireDefault(_setImmediate)

    var _wrapAsync = requireWrapAsync()

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj }
    }

    /**
     * Take a sync function and make it async, passing its return value to a
     * callback. This is useful for plugging sync functions into a waterfall,
     * series, or other async functions. Any arguments passed to the generated
     * function will be passed to the wrapped function (except for the final
     * callback argument). Errors thrown will be passed to the callback.
     *
     * If the function passed to `asyncify` returns a Promise, that promises's
     * resolved/rejected state will be used to call the callback, rather than simply
     * the synchronous return value.
     *
     * This also means you can asyncify ES2017 `async` functions.
     *
     * @name asyncify
     * @static
     * @memberOf module:Utils
     * @method
     * @alias wrapSync
     * @category Util
     * @param {Function} func - The synchronous function, or Promise-returning
     * function to convert to an {@link AsyncFunction}.
     * @returns {AsyncFunction} An asynchronous wrapper of the `func`. To be
     * invoked with `(args..., callback)`.
     * @example
     *
     * // passing a regular synchronous function
     * async.waterfall([
     *     async.apply(fs.readFile, filename, "utf8"),
     *     async.asyncify(JSON.parse),
     *     function (data, next) {
     *         // data is the result of parsing the text.
     *         // If there was a parsing error, it would have been caught.
     *     }
     * ], callback);
     *
     * // passing a function returning a promise
     * async.waterfall([
     *     async.apply(fs.readFile, filename, "utf8"),
     *     async.asyncify(function (contents) {
     *         return db.model.create(contents);
     *     }),
     *     function (model, next) {
     *         // `model` is the instantiated model object.
     *         // If there was an error, this function would be skipped.
     *     }
     * ], callback);
     *
     * // es2017 example, though `asyncify` is not needed if your JS environment
     * // supports async functions out of the box
     * var q = async.queue(async.asyncify(async function(file) {
     *     var intermediateStep = await processFile(file);
     *     return await somePromise(intermediateStep)
     * }));
     *
     * q.push(files);
     */
    function asyncify(func) {
      if ((0, _wrapAsync.isAsync)(func)) {
        return function (...args /*, callback*/) {
          const callback = args.pop()
          const promise = func.apply(this, args)
          return handlePromise(promise, callback)
        }
      }

      return (0, _initialParams2.default)(function (args, callback) {
        var result
        try {
          result = func.apply(this, args)
        } catch (e) {
          return callback(e)
        }
        // if result is Promise object
        if (result && typeof result.then === 'function') {
          return handlePromise(result, callback)
        } else {
          callback(null, result)
        }
      })
    }

    function handlePromise(promise, callback) {
      return promise.then(
        (value) => {
          invokeCallback(callback, null, value)
        },
        (err) => {
          invokeCallback(
            callback,
            err && (err instanceof Error || err.message) ? err : new Error(err),
          )
        },
      )
    }

    function invokeCallback(callback, error, value) {
      try {
        callback(error, value)
      } catch (err) {
        ;(0, _setImmediate2.default)((e) => {
          throw e
        }, err)
      }
    }
    module.exports = exports.default
  })(asyncify, asyncify.exports)
  return asyncify.exports
}

var hasRequiredWrapAsync

function requireWrapAsync() {
  if (hasRequiredWrapAsync) return wrapAsync
  hasRequiredWrapAsync = 1

  Object.defineProperty(wrapAsync, '__esModule', {
    value: true,
  })
  wrapAsync.isAsyncIterable = wrapAsync.isAsyncGenerator = wrapAsync.isAsync = undefined

  var _asyncify = requireAsyncify()

  var _asyncify2 = _interopRequireDefault(_asyncify)

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj }
  }

  function isAsync(fn) {
    return fn[Symbol.toStringTag] === 'AsyncFunction'
  }

  function isAsyncGenerator(fn) {
    return fn[Symbol.toStringTag] === 'AsyncGenerator'
  }

  function isAsyncIterable(obj) {
    return typeof obj[Symbol.asyncIterator] === 'function'
  }

  function wrapAsync$1(asyncFn) {
    if (typeof asyncFn !== 'function') throw new Error('expected a function')
    return isAsync(asyncFn) ? (0, _asyncify2.default)(asyncFn) : asyncFn
  }

  wrapAsync.default = wrapAsync$1
  wrapAsync.isAsync = isAsync
  wrapAsync.isAsyncGenerator = isAsyncGenerator
  wrapAsync.isAsyncIterable = isAsyncIterable
  return wrapAsync
}

var awaitify = { exports: {} }

var hasRequiredAwaitify

function requireAwaitify() {
  if (hasRequiredAwaitify) return awaitify.exports
  hasRequiredAwaitify = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.default = awaitify
    // conditionally promisify a function.
    // only return a promise if a callback is omitted
    function awaitify(asyncFn, arity) {
      if (!arity) arity = asyncFn.length
      if (!arity) throw new Error('arity is undefined')
      function awaitable(...args) {
        if (typeof args[arity - 1] === 'function') {
          return asyncFn.apply(this, args)
        }

        return new Promise((resolve, reject) => {
          args[arity - 1] = (err, ...cbArgs) => {
            if (err) return reject(err)
            resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0])
          }
          asyncFn.apply(this, args)
        })
      }

      return awaitable
    }
    module.exports = exports.default
  })(awaitify, awaitify.exports)
  return awaitify.exports
}

var hasRequiredParallel

function requireParallel() {
  if (hasRequiredParallel) return parallel.exports
  hasRequiredParallel = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })

    var _isArrayLike = requireIsArrayLike()

    var _isArrayLike2 = _interopRequireDefault(_isArrayLike)

    var _wrapAsync = requireWrapAsync()

    var _wrapAsync2 = _interopRequireDefault(_wrapAsync)

    var _awaitify = requireAwaitify()

    var _awaitify2 = _interopRequireDefault(_awaitify)

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj }
    }

    exports.default = (0, _awaitify2.default)((eachfn, tasks, callback) => {
      var results = (0, _isArrayLike2.default)(tasks) ? [] : {}

      eachfn(
        tasks,
        (task, key, taskCb) => {
          ;(0, _wrapAsync2.default)(task)((err, ...result) => {
            if (result.length < 2) {
              ;[result] = result
            }
            results[key] = result
            taskCb(err)
          })
        },
        (err) => callback(err, results),
      )
    }, 3)
    module.exports = exports.default
  })(parallel, parallel.exports)
  return parallel.exports
}

var eachOfSeries = { exports: {} }

var eachOfLimit$1 = { exports: {} }

var eachOfLimit = { exports: {} }

var once = { exports: {} }

var hasRequiredOnce

function requireOnce() {
  if (hasRequiredOnce) return once.exports
  hasRequiredOnce = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.default = once
    function once(fn) {
      function wrapper(...args) {
        if (fn === null) return
        var callFn = fn
        fn = null
        callFn.apply(this, args)
      }
      Object.assign(wrapper, fn)
      return wrapper
    }
    module.exports = exports.default
  })(once, once.exports)
  return once.exports
}

var iterator = { exports: {} }

var getIterator = { exports: {} }

var hasRequiredGetIterator

function requireGetIterator() {
  if (hasRequiredGetIterator) return getIterator.exports
  hasRequiredGetIterator = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })

    exports.default = function (coll) {
      return coll[Symbol.iterator] && coll[Symbol.iterator]()
    }

    module.exports = exports.default
  })(getIterator, getIterator.exports)
  return getIterator.exports
}

var hasRequiredIterator

function requireIterator() {
  if (hasRequiredIterator) return iterator.exports
  hasRequiredIterator = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.default = createIterator

    var _isArrayLike = requireIsArrayLike()

    var _isArrayLike2 = _interopRequireDefault(_isArrayLike)

    var _getIterator = requireGetIterator()

    var _getIterator2 = _interopRequireDefault(_getIterator)

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj }
    }

    function createArrayIterator(coll) {
      var i = -1
      var len = coll.length
      return function next() {
        return ++i < len ? { value: coll[i], key: i } : null
      }
    }

    function createES2015Iterator(iterator) {
      var i = -1
      return function next() {
        var item = iterator.next()
        if (item.done) return null
        i++
        return { value: item.value, key: i }
      }
    }

    function createObjectIterator(obj) {
      var okeys = obj ? Object.keys(obj) : []
      var i = -1
      var len = okeys.length
      return function next() {
        var key = okeys[++i]
        if (key === '__proto__') {
          return next()
        }
        return i < len ? { value: obj[key], key } : null
      }
    }

    function createIterator(coll) {
      if ((0, _isArrayLike2.default)(coll)) {
        return createArrayIterator(coll)
      }

      var iterator = (0, _getIterator2.default)(coll)
      return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll)
    }
    module.exports = exports.default
  })(iterator, iterator.exports)
  return iterator.exports
}

var onlyOnce = { exports: {} }

var hasRequiredOnlyOnce

function requireOnlyOnce() {
  if (hasRequiredOnlyOnce) return onlyOnce.exports
  hasRequiredOnlyOnce = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.default = onlyOnce
    function onlyOnce(fn) {
      return function (...args) {
        if (fn === null) throw new Error('Callback was already called.')
        var callFn = fn
        fn = null
        callFn.apply(this, args)
      }
    }
    module.exports = exports.default
  })(onlyOnce, onlyOnce.exports)
  return onlyOnce.exports
}

var asyncEachOfLimit = { exports: {} }

var breakLoop = { exports: {} }

var hasRequiredBreakLoop

function requireBreakLoop() {
  if (hasRequiredBreakLoop) return breakLoop.exports
  hasRequiredBreakLoop = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    // A temporary value used to identify if the loop should be broken.
    // See #1064, #1293
    const breakLoop = {}
    exports.default = breakLoop
    module.exports = exports.default
  })(breakLoop, breakLoop.exports)
  return breakLoop.exports
}

var hasRequiredAsyncEachOfLimit

function requireAsyncEachOfLimit() {
  if (hasRequiredAsyncEachOfLimit) return asyncEachOfLimit.exports
  hasRequiredAsyncEachOfLimit = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.default = asyncEachOfLimit

    var _breakLoop = requireBreakLoop()

    var _breakLoop2 = _interopRequireDefault(_breakLoop)

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj }
    }

    // for async generators
    function asyncEachOfLimit(generator, limit, iteratee, callback) {
      let done = false
      let canceled = false
      let awaiting = false
      let running = 0
      let idx = 0

      function replenish() {
        //console.log('replenish')
        if (running >= limit || awaiting || done) return
        //console.log('replenish awaiting')
        awaiting = true
        generator
          .next()
          .then(({ value, done: iterDone }) => {
            //console.log('got value', value)
            if (canceled || done) return
            awaiting = false
            if (iterDone) {
              done = true
              if (running <= 0) {
                //console.log('done nextCb')
                callback(null)
              }
              return
            }
            running++
            iteratee(value, idx, iterateeCallback)
            idx++
            replenish()
          })
          .catch(handleError)
      }

      function iterateeCallback(err, result) {
        //console.log('iterateeCallback')
        running -= 1
        if (canceled) return
        if (err) return handleError(err)

        if (err === false) {
          done = true
          canceled = true
          return
        }

        if (result === _breakLoop2.default || (done && running <= 0)) {
          done = true
          //console.log('done iterCb')
          return callback(null)
        }
        replenish()
      }

      function handleError(err) {
        if (canceled) return
        awaiting = false
        done = true
        callback(err)
      }

      replenish()
    }
    module.exports = exports.default
  })(asyncEachOfLimit, asyncEachOfLimit.exports)
  return asyncEachOfLimit.exports
}

var hasRequiredEachOfLimit$1

function requireEachOfLimit$1() {
  if (hasRequiredEachOfLimit$1) return eachOfLimit.exports
  hasRequiredEachOfLimit$1 = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })

    var _once = requireOnce()

    var _once2 = _interopRequireDefault(_once)

    var _iterator = requireIterator()

    var _iterator2 = _interopRequireDefault(_iterator)

    var _onlyOnce = requireOnlyOnce()

    var _onlyOnce2 = _interopRequireDefault(_onlyOnce)

    var _wrapAsync = requireWrapAsync()

    var _asyncEachOfLimit = requireAsyncEachOfLimit()

    var _asyncEachOfLimit2 = _interopRequireDefault(_asyncEachOfLimit)

    var _breakLoop = requireBreakLoop()

    var _breakLoop2 = _interopRequireDefault(_breakLoop)

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj }
    }

    exports.default = (limit) => {
      return (obj, iteratee, callback) => {
        callback = (0, _once2.default)(callback)
        if (limit <= 0) {
          throw new RangeError('concurrency limit cannot be less than 1')
        }
        if (!obj) {
          return callback(null)
        }
        if ((0, _wrapAsync.isAsyncGenerator)(obj)) {
          return (0, _asyncEachOfLimit2.default)(obj, limit, iteratee, callback)
        }
        if ((0, _wrapAsync.isAsyncIterable)(obj)) {
          return (0, _asyncEachOfLimit2.default)(
            obj[Symbol.asyncIterator](),
            limit,
            iteratee,
            callback,
          )
        }
        var nextElem = (0, _iterator2.default)(obj)
        var done = false
        var canceled = false
        var running = 0
        var looping = false

        function iterateeCallback(err, value) {
          if (canceled) return
          running -= 1
          if (err) {
            done = true
            callback(err)
          } else if (err === false) {
            done = true
            canceled = true
          } else if (value === _breakLoop2.default || (done && running <= 0)) {
            done = true
            return callback(null)
          } else if (!looping) {
            replenish()
          }
        }

        function replenish() {
          looping = true
          while (running < limit && !done) {
            var elem = nextElem()
            if (elem === null) {
              done = true
              if (running <= 0) {
                callback(null)
              }
              return
            }
            running += 1
            iteratee(elem.value, elem.key, (0, _onlyOnce2.default)(iterateeCallback))
          }
          looping = false
        }

        replenish()
      }
    }

    module.exports = exports.default
  })(eachOfLimit, eachOfLimit.exports)
  return eachOfLimit.exports
}

var hasRequiredEachOfLimit

function requireEachOfLimit() {
  if (hasRequiredEachOfLimit) return eachOfLimit$1.exports
  hasRequiredEachOfLimit = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })

    var _eachOfLimit2 = requireEachOfLimit$1()

    var _eachOfLimit3 = _interopRequireDefault(_eachOfLimit2)

    var _wrapAsync = requireWrapAsync()

    var _wrapAsync2 = _interopRequireDefault(_wrapAsync)

    var _awaitify = requireAwaitify()

    var _awaitify2 = _interopRequireDefault(_awaitify)

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj }
    }

    /**
     * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
     * time.
     *
     * @name eachOfLimit
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.eachOf]{@link module:Collections.eachOf}
     * @alias forEachOfLimit
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {number} limit - The maximum number of async operations at a time.
     * @param {AsyncFunction} iteratee - An async function to apply to each
     * item in `coll`. The `key` is the item's key, or index in the case of an
     * array.
     * Invoked with (item, key, callback).
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     * @returns {Promise} a promise, if a callback is omitted
     */
    function eachOfLimit(coll, limit, iteratee, callback) {
      return (0, _eachOfLimit3.default)(limit)(coll, (0, _wrapAsync2.default)(iteratee), callback)
    }

    exports.default = (0, _awaitify2.default)(eachOfLimit, 4)
    module.exports = exports.default
  })(eachOfLimit$1, eachOfLimit$1.exports)
  return eachOfLimit$1.exports
}

var hasRequiredEachOfSeries

function requireEachOfSeries() {
  if (hasRequiredEachOfSeries) return eachOfSeries.exports
  hasRequiredEachOfSeries = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })

    var _eachOfLimit = requireEachOfLimit()

    var _eachOfLimit2 = _interopRequireDefault(_eachOfLimit)

    var _awaitify = requireAwaitify()

    var _awaitify2 = _interopRequireDefault(_awaitify)

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj }
    }

    /**
     * The same as [`eachOf`]{@link module:Collections.eachOf} but runs only a single async operation at a time.
     *
     * @name eachOfSeries
     * @static
     * @memberOf module:Collections
     * @method
     * @see [async.eachOf]{@link module:Collections.eachOf}
     * @alias forEachOfSeries
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to each item in
     * `coll`.
     * Invoked with (item, key, callback).
     * @param {Function} [callback] - A callback which is called when all `iteratee`
     * functions have finished, or an error occurs. Invoked with (err).
     * @returns {Promise} a promise, if a callback is omitted
     */
    function eachOfSeries(coll, iteratee, callback) {
      return (0, _eachOfLimit2.default)(coll, 1, iteratee, callback)
    }
    exports.default = (0, _awaitify2.default)(eachOfSeries, 3)
    module.exports = exports.default
  })(eachOfSeries, eachOfSeries.exports)
  return eachOfSeries.exports
}

var hasRequiredSeries

function requireSeries() {
  if (hasRequiredSeries) return series.exports
  hasRequiredSeries = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.default = series

    var _parallel2 = requireParallel()

    var _parallel3 = _interopRequireDefault(_parallel2)

    var _eachOfSeries = requireEachOfSeries()

    var _eachOfSeries2 = _interopRequireDefault(_eachOfSeries)

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj }
    }

    /**
     * Run the functions in the `tasks` collection in series, each one running once
     * the previous function has completed. If any functions in the series pass an
     * error to its callback, no more functions are run, and `callback` is
     * immediately called with the value of the error. Otherwise, `callback`
     * receives an array of results when `tasks` have completed.
     *
     * It is also possible to use an object instead of an array. Each property will
     * be run as a function, and the results will be passed to the final `callback`
     * as an object instead of an array. This can be a more readable way of handling
     *  results from {@link async.series}.
     *
     * **Note** that while many implementations preserve the order of object
     * properties, the [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6)
     * explicitly states that
     *
     * > The mechanics and order of enumerating the properties is not specified.
     *
     * So if you rely on the order in which your series of functions are executed,
     * and want this to work on all platforms, consider using an array.
     *
     * @name series
     * @static
     * @memberOf module:ControlFlow
     * @method
     * @category Control Flow
     * @param {Array|Iterable|AsyncIterable|Object} tasks - A collection containing
     * [async functions]{@link AsyncFunction} to run in series.
     * Each function can complete with any number of optional `result` values.
     * @param {Function} [callback] - An optional callback to run once all the
     * functions have completed. This function gets a results array (or object)
     * containing all the result arguments passed to the `task` callbacks. Invoked
     * with (err, result).
     * @return {Promise} a promise, if no callback is passed
     * @example
     *
     * //Using Callbacks
     * async.series([
     *     function(callback) {
     *         setTimeout(function() {
     *             // do some async task
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             // then do another async task
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ], function(err, results) {
     *     console.log(results);
     *     // results is equal to ['one','two']
     * });
     *
     * // an example using objects instead of arrays
     * async.series({
     *     one: function(callback) {
     *         setTimeout(function() {
     *             // do some async task
     *             callback(null, 1);
     *         }, 200);
     *     },
     *     two: function(callback) {
     *         setTimeout(function() {
     *             // then do another async task
     *             callback(null, 2);
     *         }, 100);
     *     }
     * }, function(err, results) {
     *     console.log(results);
     *     // results is equal to: { one: 1, two: 2 }
     * });
     *
     * //Using Promises
     * async.series([
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'one');
     *         }, 200);
     *     },
     *     function(callback) {
     *         setTimeout(function() {
     *             callback(null, 'two');
     *         }, 100);
     *     }
     * ]).then(results => {
     *     console.log(results);
     *     // results is equal to ['one','two']
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * // an example using an object instead of an array
     * async.series({
     *     one: function(callback) {
     *         setTimeout(function() {
     *             // do some async task
     *             callback(null, 1);
     *         }, 200);
     *     },
     *     two: function(callback) {
     *         setTimeout(function() {
     *             // then do another async task
     *             callback(null, 2);
     *         }, 100);
     *     }
     * }).then(results => {
     *     console.log(results);
     *     // results is equal to: { one: 1, two: 2 }
     * }).catch(err => {
     *     console.log(err);
     * });
     *
     * //Using async/await
     * async () => {
     *     try {
     *         let results = await async.series([
     *             function(callback) {
     *                 setTimeout(function() {
     *                     // do some async task
     *                     callback(null, 'one');
     *                 }, 200);
     *             },
     *             function(callback) {
     *                 setTimeout(function() {
     *                     // then do another async task
     *                     callback(null, 'two');
     *                 }, 100);
     *             }
     *         ]);
     *         console.log(results);
     *         // results is equal to ['one','two']
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // an example using an object instead of an array
     * async () => {
     *     try {
     *         let results = await async.parallel({
     *             one: function(callback) {
     *                 setTimeout(function() {
     *                     // do some async task
     *                     callback(null, 1);
     *                 }, 200);
     *             },
     *            two: function(callback) {
     *                 setTimeout(function() {
     *                     // then do another async task
     *                     callback(null, 2);
     *                 }, 100);
     *            }
     *         });
     *         console.log(results);
     *         // results is equal to: { one: 1, two: 2 }
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     */
    function series(tasks, callback) {
      return (0, _parallel3.default)(_eachOfSeries2.default, tasks, callback)
    }
    module.exports = exports.default
  })(series, series.exports)
  return series.exports
}

var readable = { exports: {} }

var _stream_transform
var hasRequired_stream_transform

function require_stream_transform() {
  if (hasRequired_stream_transform) return _stream_transform
  hasRequired_stream_transform = 1

  _stream_transform = Transform
  var _require$codes = requireErrors().codes,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
    ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING,
    ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0
  var Duplex = require_stream_duplex()
  requireInherits()(Transform, Duplex)
  function afterTransform(er, data) {
    var ts = this._transformState
    ts.transforming = false
    var cb = ts.writecb
    if (cb === null) {
      return this.emit('error', new ERR_MULTIPLE_CALLBACK())
    }
    ts.writechunk = null
    ts.writecb = null
    if (data != null)
      // single equals check for both `null` and `undefined`
      this.push(data)
    cb(er)
    var rs = this._readableState
    rs.reading = false
    if (rs.needReadable || rs.length < rs.highWaterMark) {
      this._read(rs.highWaterMark)
    }
  }
  function Transform(options) {
    if (!(this instanceof Transform)) return new Transform(options)
    Duplex.call(this, options)
    this._transformState = {
      afterTransform: afterTransform.bind(this),
      needTransform: false,
      transforming: false,
      writecb: null,
      writechunk: null,
      writeencoding: null,
    }

    // start out asking for a readable event once data is transformed.
    this._readableState.needReadable = true

    // we have implemented the _read method, and done the other things
    // that Readable wants before the first _read call, so unset the
    // sync guard flag.
    this._readableState.sync = false
    if (options) {
      if (typeof options.transform === 'function') this._transform = options.transform
      if (typeof options.flush === 'function') this._flush = options.flush
    }

    // When the writable side finishes, then flush out anything remaining.
    this.on('prefinish', prefinish)
  }
  function prefinish() {
    var _this = this
    if (typeof this._flush === 'function' && !this._readableState.destroyed) {
      this._flush(function (er, data) {
        done(_this, er, data)
      })
    } else {
      done(this, null, null)
    }
  }
  Transform.prototype.push = function (chunk, encoding) {
    this._transformState.needTransform = false
    return Duplex.prototype.push.call(this, chunk, encoding)
  }

  // This is the part where you do stuff!
  // override this function in implementation classes.
  // 'chunk' is an input chunk.
  //
  // Call `push(newChunk)` to pass along transformed output
  // to the readable side.  You may call 'push' zero or more times.
  //
  // Call `cb(err)` when you are done with this chunk.  If you pass
  // an error, then that'll put the hurt on the whole operation.  If you
  // never call cb(), then you'll never get another chunk.
  Transform.prototype._transform = function (chunk, encoding, cb) {
    cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'))
  }
  Transform.prototype._write = function (chunk, encoding, cb) {
    var ts = this._transformState
    ts.writecb = cb
    ts.writechunk = chunk
    ts.writeencoding = encoding
    if (!ts.transforming) {
      var rs = this._readableState
      if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
        this._read(rs.highWaterMark)
    }
  }

  // Doesn't matter what the args are here.
  // _transform does all the work.
  // That we got here means that the readable side wants more data.
  Transform.prototype._read = function (n) {
    var ts = this._transformState
    if (ts.writechunk !== null && !ts.transforming) {
      ts.transforming = true
      this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform)
    } else {
      // mark that we need a transform, so that any data that comes in
      // will get processed, now that we've asked for it.
      ts.needTransform = true
    }
  }
  Transform.prototype._destroy = function (err, cb) {
    Duplex.prototype._destroy.call(this, err, function (err2) {
      cb(err2)
    })
  }
  function done(stream, er, data) {
    if (er) return stream.emit('error', er)
    if (data != null)
      // single equals check for both `null` and `undefined`
      stream.push(data)

    // TODO(BridgeAR): Write a test for these two error cases
    // if there's nothing in the write buffer, then that means
    // that nothing more will ever be provided
    if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0()
    if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING()
    return stream.push(null)
  }
  return _stream_transform
}

var _stream_passthrough
var hasRequired_stream_passthrough

function require_stream_passthrough() {
  if (hasRequired_stream_passthrough) return _stream_passthrough
  hasRequired_stream_passthrough = 1

  _stream_passthrough = PassThrough
  var Transform = require_stream_transform()
  requireInherits()(PassThrough, Transform)
  function PassThrough(options) {
    if (!(this instanceof PassThrough)) return new PassThrough(options)
    Transform.call(this, options)
  }
  PassThrough.prototype._transform = function (chunk, encoding, cb) {
    cb(null, chunk)
  }
  return _stream_passthrough
}

var pipeline_1
var hasRequiredPipeline

function requirePipeline() {
  if (hasRequiredPipeline) return pipeline_1
  hasRequiredPipeline = 1

  var eos
  function once(callback) {
    var called = false
    return function () {
      if (called) return
      called = true
      callback.apply(void 0, arguments)
    }
  }
  var _require$codes = requireErrors().codes,
    ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED
  function noop(err) {
    // Rethrow the error if it exists to avoid swallowing it
    if (err) throw err
  }
  function isRequest(stream) {
    return stream.setHeader && typeof stream.abort === 'function'
  }
  function destroyer(stream, reading, writing, callback) {
    callback = once(callback)
    var closed = false
    stream.on('close', function () {
      closed = true
    })
    if (eos === undefined) eos = requireEndOfStream()
    eos(
      stream,
      {
        readable: reading,
        writable: writing,
      },
      function (err) {
        if (err) return callback(err)
        closed = true
        callback()
      },
    )
    var destroyed = false
    return function (err) {
      if (closed) return
      if (destroyed) return
      destroyed = true

      // request.destroy just do .end - .abort is what we want
      if (isRequest(stream)) return stream.abort()
      if (typeof stream.destroy === 'function') return stream.destroy()
      callback(err || new ERR_STREAM_DESTROYED('pipe'))
    }
  }
  function call(fn) {
    fn()
  }
  function pipe(from, to) {
    return from.pipe(to)
  }
  function popCallback(streams) {
    if (!streams.length) return noop
    if (typeof streams[streams.length - 1] !== 'function') return noop
    return streams.pop()
  }
  function pipeline() {
    for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
      streams[_key] = arguments[_key]
    }
    var callback = popCallback(streams)
    if (Array.isArray(streams[0])) streams = streams[0]
    if (streams.length < 2) {
      throw new ERR_MISSING_ARGS('streams')
    }
    var error
    var destroys = streams.map(function (stream, i) {
      var reading = i < streams.length - 1
      var writing = i > 0
      return destroyer(stream, reading, writing, function (err) {
        if (!error) error = err
        if (err) destroys.forEach(call)
        if (reading) return
        destroys.forEach(call)
        callback(error)
      })
    })
    return streams.reduce(pipe)
  }
  pipeline_1 = pipeline
  return pipeline_1
}

var hasRequiredReadable

function requireReadable() {
  if (hasRequiredReadable) return readable.exports
  hasRequiredReadable = 1
  ;(function (module, exports) {
    var Stream = require$$0$3
    if (process.env.READABLE_STREAM === 'disable' && Stream) {
      module.exports = Stream.Readable
      Object.assign(module.exports, Stream)
      module.exports.Stream = Stream
    } else {
      exports = module.exports = require_stream_readable()
      exports.Stream = Stream || exports
      exports.Readable = exports
      exports.Writable = require_stream_writable()
      exports.Duplex = require_stream_duplex()
      exports.Transform = require_stream_transform()
      exports.PassThrough = require_stream_passthrough()
      exports.finished = requireEndOfStream()
      exports.pipeline = requirePipeline()
    }
  })(readable, readable.exports)
  return readable.exports
}

var node = { exports: {} }

/**
 * Contains all configured adapters for the given environment.
 *
 * @type {Array}
 * @public
 */

var diagnostics
var hasRequiredDiagnostics

function requireDiagnostics() {
  if (hasRequiredDiagnostics) return diagnostics
  hasRequiredDiagnostics = 1
  var adapters = []

  /**
   * Contains all modifier functions.
   *
   * @typs {Array}
   * @public
   */
  var modifiers = []

  /**
   * Our default logger.
   *
   * @public
   */
  var logger = function devnull() {}

  /**
   * Register a new adapter that will used to find environments.
   *
   * @param {Function} adapter A function that will return the possible env.
   * @returns {Boolean} Indication of a successful add.
   * @public
   */
  function use(adapter) {
    if (~adapters.indexOf(adapter)) return false

    adapters.push(adapter)
    return true
  }

  /**
   * Assign a new log method.
   *
   * @param {Function} custom The log method.
   * @public
   */
  function set(custom) {
    logger = custom
  }

  /**
   * Check if the namespace is allowed by any of our adapters.
   *
   * @param {String} namespace The namespace that needs to be enabled
   * @returns {Boolean|Promise} Indication if the namespace is enabled by our adapters.
   * @public
   */
  function enabled(namespace) {
    var async = []

    for (var i = 0; i < adapters.length; i++) {
      if (adapters[i].async) {
        async.push(adapters[i])
        continue
      }

      if (adapters[i](namespace)) return true
    }

    if (!async.length) return false

    //
    // Now that we know that we Async functions, we know we run in an ES6
    // environment and can use all the API's that they offer, in this case
    // we want to return a Promise so that we can `await` in React-Native
    // for an async adapter.
    //
    return new Promise(function pinky(resolve) {
      Promise.all(
        async.map(function prebind(fn) {
          return fn(namespace)
        }),
      ).then(function resolved(values) {
        resolve(values.some(Boolean))
      })
    })
  }

  /**
   * Add a new message modifier to the debugger.
   *
   * @param {Function} fn Modification function.
   * @returns {Boolean} Indication of a successful add.
   * @public
   */
  function modify(fn) {
    if (~modifiers.indexOf(fn)) return false

    modifiers.push(fn)
    return true
  }

  /**
   * Write data to the supplied logger.
   *
   * @param {Object} meta Meta information about the log.
   * @param {Array} args Arguments for console.log.
   * @public
   */
  function write() {
    logger.apply(logger, arguments)
  }

  /**
   * Process the message with the modifiers.
   *
   * @param {Mixed} message The message to be transformed by modifers.
   * @returns {String} Transformed message.
   * @public
   */
  function process(message) {
    for (var i = 0; i < modifiers.length; i++) {
      message = modifiers[i].apply(modifiers[i], arguments)
    }

    return message
  }

  /**
   * Introduce options to the logger function.
   *
   * @param {Function} fn Calback function.
   * @param {Object} options Properties to introduce on fn.
   * @returns {Function} The passed function
   * @public
   */
  function introduce(fn, options) {
    var has = Object.prototype.hasOwnProperty

    for (var key in options) {
      if (has.call(options, key)) {
        fn[key] = options[key]
      }
    }

    return fn
  }

  /**
   * Nope, we're not allowed to write messages.
   *
   * @returns {Boolean} false
   * @public
   */
  function nope(options) {
    options.enabled = false
    options.modify = modify
    options.set = set
    options.use = use

    return introduce(function diagnopes() {
      return false
    }, options)
  }

  /**
   * Yep, we're allowed to write debug messages.
   *
   * @param {Object} options The options for the process.
   * @returns {Function} The function that does the logging.
   * @public
   */
  function yep(options) {
    /**
     * The function that receives the actual debug information.
     *
     * @returns {Boolean} indication that we're logging.
     * @public
     */
    function diagnostics() {
      var args = Array.prototype.slice.call(arguments, 0)

      write.call(write, options, process(args, options))
      return true
    }

    options.enabled = true
    options.modify = modify
    options.set = set
    options.use = use

    return introduce(diagnostics, options)
  }

  /**
   * Simple helper function to introduce various of helper methods to our given
   * diagnostics function.
   *
   * @param {Function} diagnostics The diagnostics function.
   * @returns {Function} diagnostics
   * @public
   */
  diagnostics = function create(diagnostics) {
    diagnostics.introduce = introduce
    diagnostics.enabled = enabled
    diagnostics.process = process
    diagnostics.modify = modify
    diagnostics.write = write
    diagnostics.nope = nope
    diagnostics.yep = yep
    diagnostics.set = set
    diagnostics.use = use

    return diagnostics
  }
  return diagnostics
}

var production
var hasRequiredProduction

function requireProduction() {
  if (hasRequiredProduction) return production
  hasRequiredProduction = 1
  var create = requireDiagnostics()

  /**
   * Create a new diagnostics logger.
   *
   * @param {String} namespace The namespace it should enable.
   * @param {Object} options Additional options.
   * @returns {Function} The logger.
   * @public
   */
  var diagnostics = create(function prod(namespace, options) {
    options = options || {}
    options.namespace = namespace
    options.prod = true
    options.dev = false

    if (!(options.force || prod.force)) return prod.nope(options)
    return prod.yep(options)
  })

  //
  // Expose the diagnostics logger.
  //
  production = diagnostics
  return production
}

var hasRequiredNode

function requireNode() {
  if (hasRequiredNode) return node.exports
  hasRequiredNode = 1
  //
  // Select the correct build version depending on the environment.
  //
  {
    node.exports = requireProduction()
  }
  return node.exports
}

/**
 * tail-file.js: TODO: add file header description.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var tailFile
var hasRequiredTailFile

function requireTailFile() {
  if (hasRequiredTailFile) return tailFile
  hasRequiredTailFile = 1

  const fs = require$$0$6
  const { StringDecoder } = require$$1
  const { Stream } = requireReadable()

  /**
   * Simple no-op function.
   * @returns {undefined}
   */
  function noop() {}

  /**
   * TODO: add function description.
   * @param {Object} options - Options for tail.
   * @param {function} iter - Iterator function to execute on every line.
   * `tail -f` a file. Options must include file.
   * @returns {mixed} - TODO: add return description.
   */
  tailFile = (options, iter) => {
    const buffer = Buffer.alloc(64 * 1024)
    const decode = new StringDecoder('utf8')
    const stream = new Stream()
    let buff = ''
    let pos = 0
    let row = 0

    if (options.start === -1) {
      delete options.start
    }

    stream.readable = true
    stream.destroy = () => {
      stream.destroyed = true
      stream.emit('end')
      stream.emit('close')
    }

    fs.open(options.file, 'a+', '0644', (err, fd) => {
      if (err) {
        if (!iter) {
          stream.emit('error', err)
        } else {
          iter(err)
        }
        stream.destroy()
        return
      }

      ;(function read() {
        if (stream.destroyed) {
          fs.close(fd, noop)
          return
        }

        return fs.read(fd, buffer, 0, buffer.length, pos, (error, bytes) => {
          if (error) {
            if (!iter) {
              stream.emit('error', error)
            } else {
              iter(error)
            }
            stream.destroy()
            return
          }

          if (!bytes) {
            if (buff) {
              // eslint-disable-next-line eqeqeq
              if (options.start == null || row > options.start) {
                if (!iter) {
                  stream.emit('line', buff)
                } else {
                  iter(null, buff)
                }
              }
              row++
              buff = ''
            }
            return setTimeout(read, 1000)
          }

          let data = decode.write(buffer.slice(0, bytes))
          if (!iter) {
            stream.emit('data', data)
          }

          data = (buff + data).split(/\n+/)

          const l = data.length - 1
          let i = 0

          for (; i < l; i++) {
            // eslint-disable-next-line eqeqeq
            if (options.start == null || row > options.start) {
              if (!iter) {
                stream.emit('line', data[i])
              } else {
                iter(null, data[i])
              }
            }
            row++
          }

          buff = data[l]
          pos += bytes
          return read()
        })
      })()
    })

    if (!iter) {
      return stream
    }

    return stream.destroy
  }
  return tailFile
}

/* eslint-disable complexity,max-statements */

var file
var hasRequiredFile

function requireFile() {
  if (hasRequiredFile) return file
  hasRequiredFile = 1

  const fs = require$$0$6
  const path$1 = path
  const asyncSeries = requireSeries()
  const zlib = require$$3
  const { MESSAGE } = requireTripleBeam()
  const { Stream, PassThrough } = requireReadable()
  const TransportStream = requireWinstonTransport()
  const debug = requireNode()('winston:file')
  const os = require$$0$1
  const tailFile = requireTailFile()

  /**
   * Transport for outputting to a local log file.
   * @type {File}
   * @extends {TransportStream}
   */
  file = class File extends TransportStream {
    /**
     * Constructor function for the File transport object responsible for
     * persisting log messages and metadata to one or more files.
     * @param {Object} options - Options for this instance.
     */
    constructor(options = {}) {
      super(options)

      // Expose the name of this Transport on the prototype.
      this.name = options.name || 'file'

      // Helper function which throws an `Error` in the event that any of the
      // rest of the arguments is present in `options`.
      function throwIf(target, ...args) {
        args.slice(1).forEach((name) => {
          if (options[name]) {
            throw new Error(`Cannot set ${name} and ${target} together`)
          }
        })
      }

      // Setup the base stream that always gets piped to to handle buffering.
      this._stream = new PassThrough()
      this._stream.setMaxListeners(30)

      // Bind this context for listener methods.
      this._onError = this._onError.bind(this)

      if (options.filename || options.dirname) {
        throwIf('filename or dirname', 'stream')
        this._basename = this.filename = options.filename
          ? path$1.basename(options.filename)
          : 'winston.log'

        this.dirname = options.dirname || path$1.dirname(options.filename)
        this.options = options.options || { flags: 'a' }
      } else if (options.stream) {
        // eslint-disable-next-line no-console
        console.warn('options.stream will be removed in winston@4. Use winston.transports.Stream')
        throwIf('stream', 'filename', 'maxsize')
        this._dest = this._stream.pipe(this._setupStream(options.stream))
        this.dirname = path$1.dirname(this._dest.path)
        // We need to listen for drain events when write() returns false. This
        // can make node mad at times.
      } else {
        throw new Error('Cannot log to file without filename or stream.')
      }

      this.maxsize = options.maxsize || null
      this.rotationFormat = options.rotationFormat || false
      this.zippedArchive = options.zippedArchive || false
      this.maxFiles = options.maxFiles || null
      this.eol = typeof options.eol === 'string' ? options.eol : os.EOL
      this.tailable = options.tailable || false
      this.lazy = options.lazy || false

      // Internal state variables representing the number of files this instance
      // has created and the current size (in bytes) of the current logfile.
      this._size = 0
      this._pendingSize = 0
      this._created = 0
      this._drain = false
      this._opening = false
      this._ending = false
      this._fileExist = false

      if (this.dirname) this._createLogDirIfNotExist(this.dirname)
      if (!this.lazy) this.open()
    }

    finishIfEnding() {
      if (this._ending) {
        if (this._opening) {
          this.once('open', () => {
            this._stream.once('finish', () => this.emit('finish'))
            setImmediate(() => this._stream.end())
          })
        } else {
          this._stream.once('finish', () => this.emit('finish'))
          setImmediate(() => this._stream.end())
        }
      }
    }

    /**
     * Core logging method exposed to Winston. Metadata is optional.
     * @param {Object} info - TODO: add param description.
     * @param {Function} callback - TODO: add param description.
     * @returns {undefined}
     */
    log(info, callback = () => {}) {
      // Remark: (jcrugzz) What is necessary about this callback(null, true) now
      // when thinking about 3.x? Should silent be handled in the base
      // TransportStream _write method?
      if (this.silent) {
        callback()
        return true
      }

      // Output stream buffer is full and has asked us to wait for the drain event
      if (this._drain) {
        this._stream.once('drain', () => {
          this._drain = false
          this.log(info, callback)
        })
        return
      }
      if (this._rotate) {
        this._stream.once('rotate', () => {
          this._rotate = false
          this.log(info, callback)
        })
        return
      }
      if (this.lazy) {
        if (!this._fileExist) {
          if (!this._opening) {
            this.open()
          }
          this.once('open', () => {
            this._fileExist = true
            this.log(info, callback)
            return
          })
          return
        }
        if (this._needsNewFile(this._pendingSize)) {
          this._dest.once('close', () => {
            if (!this._opening) {
              this.open()
            }
            this.once('open', () => {
              this.log(info, callback)
              return
            })
            return
          })
          return
        }
      }

      // Grab the raw string and append the expected EOL.
      const output = `${info[MESSAGE]}${this.eol}`
      const bytes = Buffer.byteLength(output)

      // After we have written to the PassThrough check to see if we need
      // to rotate to the next file.
      //
      // Remark: This gets called too early and does not depict when data
      // has been actually flushed to disk.
      function logged() {
        this._size += bytes
        this._pendingSize -= bytes

        debug('logged %s %s', this._size, output)
        this.emit('logged', info)

        // Do not attempt to rotate files while rotating
        if (this._rotate) {
          return
        }

        // Do not attempt to rotate files while opening
        if (this._opening) {
          return
        }

        // Check to see if we need to end the stream and create a new one.
        if (!this._needsNewFile()) {
          return
        }
        if (this.lazy) {
          this._endStream(() => {
            this.emit('fileclosed')
          })
          return
        }

        // End the current stream, ensure it flushes and create a new one.
        // This could potentially be optimized to not run a stat call but its
        // the safest way since we are supporting `maxFiles`.
        this._rotate = true
        this._endStream(() => this._rotateFile())
      }

      // Keep track of the pending bytes being written while files are opening
      // in order to properly rotate the PassThrough this._stream when the file
      // eventually does open.
      this._pendingSize += bytes
      if (
        this._opening &&
        !this.rotatedWhileOpening &&
        this._needsNewFile(this._size + this._pendingSize)
      ) {
        this.rotatedWhileOpening = true
      }

      const written = this._stream.write(output, logged.bind(this))
      if (!written) {
        this._drain = true
        this._stream.once('drain', () => {
          this._drain = false
          callback()
        })
      } else {
        callback() // eslint-disable-line callback-return
      }

      debug('written', written, this._drain)

      this.finishIfEnding()

      return written
    }

    /**
     * Query the transport. Options object is optional.
     * @param {Object} options - Loggly-like query options for this instance.
     * @param {function} callback - Continuation to respond to when complete.
     * TODO: Refactor me.
     */
    query(options, callback) {
      if (typeof options === 'function') {
        callback = options
        options = {}
      }

      options = normalizeQuery(options)
      const file = path$1.join(this.dirname, this.filename)
      let buff = ''
      let results = []
      let row = 0

      const stream = fs.createReadStream(file, {
        encoding: 'utf8',
      })

      stream.on('error', (err) => {
        if (stream.readable) {
          stream.destroy()
        }
        if (!callback) {
          return
        }

        return err.code !== 'ENOENT' ? callback(err) : callback(null, results)
      })

      stream.on('data', (data) => {
        data = (buff + data).split(/\n+/)
        const l = data.length - 1
        let i = 0

        for (; i < l; i++) {
          if (!options.start || row >= options.start) {
            add(data[i])
          }
          row++
        }

        buff = data[l]
      })

      stream.on('close', () => {
        if (buff) {
          add(buff, true)
        }
        if (options.order === 'desc') {
          results = results.reverse()
        }

        // eslint-disable-next-line callback-return
        if (callback) callback(null, results)
      })

      function add(buff, attempt) {
        try {
          const log = JSON.parse(buff)
          if (check(log)) {
            push(log)
          }
        } catch (e) {
          if (!attempt) {
            stream.emit('error', e)
          }
        }
      }

      function push(log) {
        if (options.rows && results.length >= options.rows && options.order !== 'desc') {
          if (stream.readable) {
            stream.destroy()
          }
          return
        }

        if (options.fields) {
          log = options.fields.reduce((obj, key) => {
            obj[key] = log[key]
            return obj
          }, {})
        }

        if (options.order === 'desc') {
          if (results.length >= options.rows) {
            results.shift()
          }
        }
        results.push(log)
      }

      function check(log) {
        if (!log) {
          return
        }

        if (typeof log !== 'object') {
          return
        }

        const time = new Date(log.timestamp)
        if (
          (options.from && time < options.from) ||
          (options.until && time > options.until) ||
          (options.level && options.level !== log.level)
        ) {
          return
        }

        return true
      }

      function normalizeQuery(options) {
        options = options || {}

        // limit
        options.rows = options.rows || options.limit || 10

        // starting row offset
        options.start = options.start || 0

        // now
        options.until = options.until || new Date()
        if (typeof options.until !== 'object') {
          options.until = new Date(options.until)
        }

        // now - 24
        options.from = options.from || options.until - 24 * 60 * 60 * 1000
        if (typeof options.from !== 'object') {
          options.from = new Date(options.from)
        }

        // 'asc' or 'desc'
        options.order = options.order || 'desc'

        return options
      }
    }

    /**
     * Returns a log stream for this transport. Options object is optional.
     * @param {Object} options - Stream options for this instance.
     * @returns {Stream} - TODO: add return description.
     * TODO: Refactor me.
     */
    stream(options = {}) {
      const file = path$1.join(this.dirname, this.filename)
      const stream = new Stream()
      const tail = {
        file,
        start: options.start,
      }

      stream.destroy = tailFile(tail, (err, line) => {
        if (err) {
          return stream.emit('error', err)
        }

        try {
          stream.emit('data', line)
          line = JSON.parse(line)
          stream.emit('log', line)
        } catch (e) {
          stream.emit('error', e)
        }
      })

      return stream
    }

    /**
     * Checks to see the filesize of.
     * @returns {undefined}
     */
    open() {
      // If we do not have a filename then we were passed a stream and
      // don't need to keep track of size.
      if (!this.filename) return
      if (this._opening) return

      this._opening = true

      // Stat the target file to get the size and create the stream.
      this.stat((err, size) => {
        if (err) {
          return this.emit('error', err)
        }
        debug('stat done: %s { size: %s }', this.filename, size)
        this._size = size
        this._dest = this._createStream(this._stream)
        this._opening = false
        this.once('open', () => {
          if (!this._stream.emit('rotate')) {
            this._rotate = false
          }
        })
      })
    }

    /**
     * Stat the file and assess information in order to create the proper stream.
     * @param {function} callback - TODO: add param description.
     * @returns {undefined}
     */
    stat(callback) {
      const target = this._getFile()
      const fullpath = path$1.join(this.dirname, target)

      fs.stat(fullpath, (err, stat) => {
        if (err && err.code === 'ENOENT') {
          debug('ENOENT ok', fullpath)
          // Update internally tracked filename with the new target name.
          this.filename = target
          return callback(null, 0)
        }

        if (err) {
          debug(`err ${err.code} ${fullpath}`)
          return callback(err)
        }

        if (!stat || this._needsNewFile(stat.size)) {
          // If `stats.size` is greater than the `maxsize` for this
          // instance then try again.
          return this._incFile(() => this.stat(callback))
        }

        // Once we have figured out what the filename is, set it
        // and return the size.
        this.filename = target
        callback(null, stat.size)
      })
    }

    /**
     * Closes the stream associated with this instance.
     * @param {function} cb - TODO: add param description.
     * @returns {undefined}
     */
    close(cb) {
      if (!this._stream) {
        return
      }

      this._stream.end(() => {
        if (cb) {
          cb() // eslint-disable-line callback-return
        }
        this.emit('flush')
        this.emit('closed')
      })
    }

    /**
     * TODO: add method description.
     * @param {number} size - TODO: add param description.
     * @returns {undefined}
     */
    _needsNewFile(size) {
      size = size || this._size
      return this.maxsize && size >= this.maxsize
    }

    /**
     * TODO: add method description.
     * @param {Error} err - TODO: add param description.
     * @returns {undefined}
     */
    _onError(err) {
      this.emit('error', err)
    }

    /**
     * TODO: add method description.
     * @param {Stream} stream - TODO: add param description.
     * @returns {mixed} - TODO: add return description.
     */
    _setupStream(stream) {
      stream.on('error', this._onError)

      return stream
    }

    /**
     * TODO: add method description.
     * @param {Stream} stream - TODO: add param description.
     * @returns {mixed} - TODO: add return description.
     */
    _cleanupStream(stream) {
      stream.removeListener('error', this._onError)
      stream.destroy()
      return stream
    }

    /**
     * TODO: add method description.
     */
    _rotateFile() {
      this._incFile(() => this.open())
    }

    /**
     * Unpipe from the stream that has been marked as full and end it so it
     * flushes to disk.
     *
     * @param {function} callback - Callback for when the current file has closed.
     * @private
     */
    _endStream(callback = () => {}) {
      if (this._dest) {
        this._stream.unpipe(this._dest)
        this._dest.end(() => {
          this._cleanupStream(this._dest)
          callback()
        })
      } else {
        callback() // eslint-disable-line callback-return
      }
    }

    /**
     * Returns the WritableStream for the active file on this instance. If we
     * should gzip the file then a zlib stream is returned.
     *
     * @param {ReadableStream} source –PassThrough to pipe to the file when open.
     * @returns {WritableStream} Stream that writes to disk for the active file.
     */
    _createStream(source) {
      const fullpath = path$1.join(this.dirname, this.filename)

      debug('create stream start', fullpath, this.options)
      const dest = fs
        .createWriteStream(fullpath, this.options)
        // TODO: What should we do with errors here?
        .on('error', (err) => debug(err))
        .on('close', () => debug('close', dest.path, dest.bytesWritten))
        .on('open', () => {
          debug('file open ok', fullpath)
          this.emit('open', fullpath)
          source.pipe(dest)

          // If rotation occured during the open operation then we immediately
          // start writing to a new PassThrough, begin opening the next file
          // and cleanup the previous source and dest once the source has drained.
          if (this.rotatedWhileOpening) {
            this._stream = new PassThrough()
            this._stream.setMaxListeners(30)
            this._rotateFile()
            this.rotatedWhileOpening = false
            this._cleanupStream(dest)
            source.end()
          }
        })

      debug('create stream ok', fullpath)
      return dest
    }

    /**
     * TODO: add method description.
     * @param {function} callback - TODO: add param description.
     * @returns {undefined}
     */
    _incFile(callback) {
      debug('_incFile', this.filename)
      const ext = path$1.extname(this._basename)
      const basename = path$1.basename(this._basename, ext)
      const tasks = []

      if (this.zippedArchive) {
        tasks.push(
          function (cb) {
            const num = this._created > 0 && !this.tailable ? this._created : ''
            this._compressFile(
              path$1.join(this.dirname, `${basename}${num}${ext}`),
              path$1.join(this.dirname, `${basename}${num}${ext}.gz`),
              cb,
            )
          }.bind(this),
        )
      }

      tasks.push(
        function (cb) {
          if (!this.tailable) {
            this._created += 1
            this._checkMaxFilesIncrementing(ext, basename, cb)
          } else {
            this._checkMaxFilesTailable(ext, basename, cb)
          }
        }.bind(this),
      )

      asyncSeries(tasks, callback)
    }

    /**
     * Gets the next filename to use for this instance in the case that log
     * filesizes are being capped.
     * @returns {string} - TODO: add return description.
     * @private
     */
    _getFile() {
      const ext = path$1.extname(this._basename)
      const basename = path$1.basename(this._basename, ext)
      const isRotation = this.rotationFormat ? this.rotationFormat() : this._created

      // Caveat emptor (indexzero): rotationFormat() was broken by design When
      // combined with max files because the set of files to unlink is never
      // stored.
      return !this.tailable && this._created
        ? `${basename}${isRotation}${ext}`
        : `${basename}${ext}`
    }

    /**
     * Increment the number of files created or checked by this instance.
     * @param {mixed} ext - TODO: add param description.
     * @param {mixed} basename - TODO: add param description.
     * @param {mixed} callback - TODO: add param description.
     * @returns {undefined}
     * @private
     */
    _checkMaxFilesIncrementing(ext, basename, callback) {
      // Check for maxFiles option and delete file.
      if (!this.maxFiles || this._created < this.maxFiles) {
        return setImmediate(callback)
      }

      const oldest = this._created - this.maxFiles
      const isOldest = oldest !== 0 ? oldest : ''
      const isZipped = this.zippedArchive ? '.gz' : ''
      const filePath = `${basename}${isOldest}${ext}${isZipped}`
      const target = path$1.join(this.dirname, filePath)

      fs.unlink(target, callback)
    }

    /**
     * Roll files forward based on integer, up to maxFiles. e.g. if base if
     * file.log and it becomes oversized, roll to file1.log, and allow file.log
     * to be re-used. If file is oversized again, roll file1.log to file2.log,
     * roll file.log to file1.log, and so on.
     * @param {mixed} ext - TODO: add param description.
     * @param {mixed} basename - TODO: add param description.
     * @param {mixed} callback - TODO: add param description.
     * @returns {undefined}
     * @private
     */
    _checkMaxFilesTailable(ext, basename, callback) {
      const tasks = []
      if (!this.maxFiles) {
        return
      }

      // const isZipped = this.zippedArchive ? '.gz' : '';
      const isZipped = this.zippedArchive ? '.gz' : ''
      for (let x = this.maxFiles - 1; x > 1; x--) {
        tasks.push(
          function (i, cb) {
            let fileName = `${basename}${i - 1}${ext}${isZipped}`
            const tmppath = path$1.join(this.dirname, fileName)

            fs.exists(tmppath, (exists) => {
              if (!exists) {
                return cb(null)
              }

              fileName = `${basename}${i}${ext}${isZipped}`
              fs.rename(tmppath, path$1.join(this.dirname, fileName), cb)
            })
          }.bind(this, x),
        )
      }

      asyncSeries(tasks, () => {
        fs.rename(
          path$1.join(this.dirname, `${basename}${ext}${isZipped}`),
          path$1.join(this.dirname, `${basename}1${ext}${isZipped}`),
          callback,
        )
      })
    }

    /**
     * Compresses src to dest with gzip and unlinks src
     * @param {string} src - path to source file.
     * @param {string} dest - path to zipped destination file.
     * @param {Function} callback - callback called after file has been compressed.
     * @returns {undefined}
     * @private
     */
    _compressFile(src, dest, callback) {
      fs.access(src, fs.F_OK, (err) => {
        if (err) {
          return callback()
        }
        var gzip = zlib.createGzip()
        var inp = fs.createReadStream(src)
        var out = fs.createWriteStream(dest)
        out.on('finish', () => {
          fs.unlink(src, callback)
        })
        inp.pipe(gzip).pipe(out)
      })
    }

    _createLogDirIfNotExist(dirPath) {
      /* eslint-disable no-sync */
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
      /* eslint-enable no-sync */
    }
  }
  return file
}

/**
 * http.js: Transport for outputting to a json-rpcserver.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var http_1
var hasRequiredHttp

function requireHttp() {
  if (hasRequiredHttp) return http_1
  hasRequiredHttp = 1

  const http = require$$0$7
  const https = require$$1$1
  const { Stream } = requireReadable()
  const TransportStream = requireWinstonTransport()
  const { configure } = requireSafeStableStringify()

  /**
   * Transport for outputting to a json-rpc server.
   * @type {Stream}
   * @extends {TransportStream}
   */
  http_1 = class Http extends TransportStream {
    /**
     * Constructor function for the Http transport object responsible for
     * persisting log messages and metadata to a terminal or TTY.
     * @param {!Object} [options={}] - Options for this instance.
     */
    // eslint-disable-next-line max-statements
    constructor(options = {}) {
      super(options)

      this.options = options
      this.name = options.name || 'http'
      this.ssl = !!options.ssl
      this.host = options.host || 'localhost'
      this.port = options.port
      this.auth = options.auth
      this.path = options.path || ''
      this.maximumDepth = options.maximumDepth
      this.agent = options.agent
      this.headers = options.headers || {}
      this.headers['content-type'] = 'application/json'
      this.batch = options.batch || false
      this.batchInterval = options.batchInterval || 5000
      this.batchCount = options.batchCount || 10
      this.batchOptions = []
      this.batchTimeoutID = -1
      this.batchCallback = {}

      if (!this.port) {
        this.port = this.ssl ? 443 : 80
      }
    }

    /**
     * Core logging method exposed to Winston.
     * @param {Object} info - TODO: add param description.
     * @param {function} callback - TODO: add param description.
     * @returns {undefined}
     */
    log(info, callback) {
      this._request(info, null, null, (err, res) => {
        if (res && res.statusCode !== 200) {
          err = new Error(`Invalid HTTP Status Code: ${res.statusCode}`)
        }

        if (err) {
          this.emit('warn', err)
        } else {
          this.emit('logged', info)
        }
      })

      // Remark: (jcrugzz) Fire and forget here so requests dont cause buffering
      // and block more requests from happening?
      if (callback) {
        setImmediate(callback)
      }
    }

    /**
     * Query the transport. Options object is optional.
     * @param {Object} options -  Loggly-like query options for this instance.
     * @param {function} callback - Continuation to respond to when complete.
     * @returns {undefined}
     */
    query(options, callback) {
      if (typeof options === 'function') {
        callback = options
        options = {}
      }

      options = {
        method: 'query',
        params: this.normalizeQuery(options),
      }

      const auth = options.params.auth || null
      delete options.params.auth

      const path = options.params.path || null
      delete options.params.path

      this._request(options, auth, path, (err, res, body) => {
        if (res && res.statusCode !== 200) {
          err = new Error(`Invalid HTTP Status Code: ${res.statusCode}`)
        }

        if (err) {
          return callback(err)
        }

        if (typeof body === 'string') {
          try {
            body = JSON.parse(body)
          } catch (e) {
            return callback(e)
          }
        }

        callback(null, body)
      })
    }

    /**
     * Returns a log stream for this transport. Options object is optional.
     * @param {Object} options - Stream options for this instance.
     * @returns {Stream} - TODO: add return description
     */
    stream(options = {}) {
      const stream = new Stream()
      options = {
        method: 'stream',
        params: options,
      }

      const path = options.params.path || null
      delete options.params.path

      const auth = options.params.auth || null
      delete options.params.auth

      let buff = ''
      const req = this._request(options, auth, path)

      stream.destroy = () => req.destroy()
      req.on('data', (data) => {
        data = (buff + data).split(/\n+/)
        const l = data.length - 1

        let i = 0
        for (; i < l; i++) {
          try {
            stream.emit('log', JSON.parse(data[i]))
          } catch (e) {
            stream.emit('error', e)
          }
        }

        buff = data[l]
      })
      req.on('error', (err) => stream.emit('error', err))

      return stream
    }

    /**
     * Make a request to a winstond server or any http server which can
     * handle json-rpc.
     * @param {function} options - Options to sent the request.
     * @param {Object?} auth - authentication options
     * @param {string} path - request path
     * @param {function} callback - Continuation to respond to when complete.
     */
    _request(options, auth, path, callback) {
      options = options || {}

      auth = auth || this.auth
      path = path || this.path || ''

      if (this.batch) {
        this._doBatch(options, callback, auth, path)
      } else {
        this._doRequest(options, callback, auth, path)
      }
    }

    /**
     * Send or memorize the options according to batch configuration
     * @param {function} options - Options to sent the request.
     * @param {function} callback - Continuation to respond to when complete.
     * @param {Object?} auth - authentication options
     * @param {string} path - request path
     */
    _doBatch(options, callback, auth, path) {
      this.batchOptions.push(options)
      if (this.batchOptions.length === 1) {
        // First message stored, it's time to start the timeout!
        const me = this
        this.batchCallback = callback
        this.batchTimeoutID = setTimeout(function () {
          // timeout is reached, send all messages to endpoint
          me.batchTimeoutID = -1
          me._doBatchRequest(me.batchCallback, auth, path)
        }, this.batchInterval)
      }
      if (this.batchOptions.length === this.batchCount) {
        // max batch count is reached, send all messages to endpoint
        this._doBatchRequest(this.batchCallback, auth, path)
      }
    }

    /**
     * Initiate a request with the memorized batch options, stop the batch timeout
     * @param {function} callback - Continuation to respond to when complete.
     * @param {Object?} auth - authentication options
     * @param {string} path - request path
     */
    _doBatchRequest(callback, auth, path) {
      if (this.batchTimeoutID > 0) {
        clearTimeout(this.batchTimeoutID)
        this.batchTimeoutID = -1
      }
      const batchOptionsCopy = this.batchOptions.slice()
      this.batchOptions = []
      this._doRequest(batchOptionsCopy, callback, auth, path)
    }

    /**
     * Make a request to a winstond server or any http server which can
     * handle json-rpc.
     * @param {function} options - Options to sent the request.
     * @param {function} callback - Continuation to respond to when complete.
     * @param {Object?} auth - authentication options
     * @param {string} path - request path
     */
    _doRequest(options, callback, auth, path) {
      // Prepare options for outgoing HTTP request
      const headers = Object.assign({}, this.headers)
      if (auth && auth.bearer) {
        headers.Authorization = `Bearer ${auth.bearer}`
      }
      const req = (this.ssl ? https : http).request({
        ...this.options,
        method: 'POST',
        host: this.host,
        port: this.port,
        path: `/${path.replace(/^\//, '')}`,
        headers: headers,
        auth: auth && auth.username && auth.password ? `${auth.username}:${auth.password}` : '',
        agent: this.agent,
      })

      req.on('error', callback)
      req.on('response', (res) => res.on('end', () => callback(null, res)).resume())
      const jsonStringify = configure({
        ...(this.maximumDepth && { maximumDepth: this.maximumDepth }),
      })
      req.end(Buffer.from(jsonStringify(options, this.options.replacer), 'utf8'))
    }
  }
  return http_1
}

var isStream_1
var hasRequiredIsStream

function requireIsStream() {
  if (hasRequiredIsStream) return isStream_1
  hasRequiredIsStream = 1

  const isStream = (stream) =>
    stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function'

  isStream.writable = (stream) =>
    isStream(stream) &&
    stream.writable !== false &&
    typeof stream._write === 'function' &&
    typeof stream._writableState === 'object'

  isStream.readable = (stream) =>
    isStream(stream) &&
    stream.readable !== false &&
    typeof stream._read === 'function' &&
    typeof stream._readableState === 'object'

  isStream.duplex = (stream) => isStream.writable(stream) && isStream.readable(stream)

  isStream.transform = (stream) =>
    isStream.duplex(stream) && typeof stream._transform === 'function'

  isStream_1 = isStream
  return isStream_1
}

/**
 * stream.js: Transport for outputting to any arbitrary stream.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var stream
var hasRequiredStream

function requireStream() {
  if (hasRequiredStream) return stream
  hasRequiredStream = 1

  const isStream = requireIsStream()
  const { MESSAGE } = requireTripleBeam()
  const os = require$$0$1
  const TransportStream = requireWinstonTransport()

  /**
   * Transport for outputting to any arbitrary stream.
   * @type {Stream}
   * @extends {TransportStream}
   */
  stream = class Stream extends TransportStream {
    /**
     * Constructor function for the Console transport object responsible for
     * persisting log messages and metadata to a terminal or TTY.
     * @param {!Object} [options={}] - Options for this instance.
     */
    constructor(options = {}) {
      super(options)

      if (!options.stream || !isStream(options.stream)) {
        throw new Error('options.stream is required.')
      }

      // We need to listen for drain events when write() returns false. This can
      // make node mad at times.
      this._stream = options.stream
      this._stream.setMaxListeners(Infinity)
      this.isObjectMode = options.stream._writableState.objectMode
      this.eol = typeof options.eol === 'string' ? options.eol : os.EOL
    }

    /**
     * Core logging method exposed to Winston.
     * @param {Object} info - TODO: add param description.
     * @param {Function} callback - TODO: add param description.
     * @returns {undefined}
     */
    log(info, callback) {
      setImmediate(() => this.emit('logged', info))
      if (this.isObjectMode) {
        this._stream.write(info)
        if (callback) {
          callback() // eslint-disable-line callback-return
        }
        return
      }

      this._stream.write(`${info[MESSAGE]}${this.eol}`)
      if (callback) {
        callback() // eslint-disable-line callback-return
      }
      return
    }
  }
  return stream
}

/**
 * transports.js: Set of all transports Winston knows about.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var hasRequiredTransports

function requireTransports() {
  if (hasRequiredTransports) return transports
  hasRequiredTransports = 1
  ;(function (exports) {
    /**
     * TODO: add property description.
     * @type {Console}
     */
    Object.defineProperty(exports, 'Console', {
      configurable: true,
      enumerable: true,
      get() {
        return requireConsole()
      },
    })

    /**
     * TODO: add property description.
     * @type {File}
     */
    Object.defineProperty(exports, 'File', {
      configurable: true,
      enumerable: true,
      get() {
        return requireFile()
      },
    })

    /**
     * TODO: add property description.
     * @type {Http}
     */
    Object.defineProperty(exports, 'Http', {
      configurable: true,
      enumerable: true,
      get() {
        return requireHttp()
      },
    })

    /**
     * TODO: add property description.
     * @type {Stream}
     */
    Object.defineProperty(exports, 'Stream', {
      configurable: true,
      enumerable: true,
      get() {
        return requireStream()
      },
    })
  })(transports)
  return transports
}

var config = {}

/**
 * index.js: Default settings for all levels that winston knows about.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var hasRequiredConfig

function requireConfig() {
  if (hasRequiredConfig) return config
  hasRequiredConfig = 1

  const logform = requireLogform()
  const { configs } = requireTripleBeam()

  /**
   * Export config set for the CLI.
   * @type {Object}
   */
  config.cli = logform.levels(configs.cli)

  /**
   * Export config set for npm.
   * @type {Object}
   */
  config.npm = logform.levels(configs.npm)

  /**
   * Export config set for the syslog.
   * @type {Object}
   */
  config.syslog = logform.levels(configs.syslog)

  /**
   * Hoist addColors from logform where it was refactored into in winston@3.
   * @type {Object}
   */
  config.addColors = logform.levels
  return config
}

var forEach = { exports: {} }

var eachOf = { exports: {} }

var hasRequiredEachOf

function requireEachOf() {
  if (hasRequiredEachOf) return eachOf.exports
  hasRequiredEachOf = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })

    var _isArrayLike = requireIsArrayLike()

    var _isArrayLike2 = _interopRequireDefault(_isArrayLike)

    var _breakLoop = requireBreakLoop()

    var _breakLoop2 = _interopRequireDefault(_breakLoop)

    var _eachOfLimit = requireEachOfLimit()

    var _eachOfLimit2 = _interopRequireDefault(_eachOfLimit)

    var _once = requireOnce()

    var _once2 = _interopRequireDefault(_once)

    var _onlyOnce = requireOnlyOnce()

    var _onlyOnce2 = _interopRequireDefault(_onlyOnce)

    var _wrapAsync = requireWrapAsync()

    var _wrapAsync2 = _interopRequireDefault(_wrapAsync)

    var _awaitify = requireAwaitify()

    var _awaitify2 = _interopRequireDefault(_awaitify)

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj }
    }

    // eachOf implementation optimized for array-likes
    function eachOfArrayLike(coll, iteratee, callback) {
      callback = (0, _once2.default)(callback)
      var index = 0,
        completed = 0,
        { length } = coll,
        canceled = false
      if (length === 0) {
        callback(null)
      }

      function iteratorCallback(err, value) {
        if (err === false) {
          canceled = true
        }
        if (canceled === true) return
        if (err) {
          callback(err)
        } else if (++completed === length || value === _breakLoop2.default) {
          callback(null)
        }
      }

      for (; index < length; index++) {
        iteratee(coll[index], index, (0, _onlyOnce2.default)(iteratorCallback))
      }
    }

    // a generic version of eachOf which can handle array, object, and iterator cases.
    function eachOfGeneric(coll, iteratee, callback) {
      return (0, _eachOfLimit2.default)(coll, Infinity, iteratee, callback)
    }

    /**
     * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
     * to the iteratee.
     *
     * @name eachOf
     * @static
     * @memberOf module:Collections
     * @method
     * @alias forEachOf
     * @category Collection
     * @see [async.each]{@link module:Collections.each}
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - A function to apply to each
     * item in `coll`.
     * The `key` is the item's key, or index in the case of an array.
     * Invoked with (item, key, callback).
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     * @returns {Promise} a promise, if a callback is omitted
     * @example
     *
     * // dev.json is a file containing a valid json object config for dev environment
     * // dev.json is a file containing a valid json object config for test environment
     * // prod.json is a file containing a valid json object config for prod environment
     * // invalid.json is a file with a malformed json object
     *
     * let configs = {}; //global variable
     * let validConfigFileMap = {dev: 'dev.json', test: 'test.json', prod: 'prod.json'};
     * let invalidConfigFileMap = {dev: 'dev.json', test: 'test.json', invalid: 'invalid.json'};
     *
     * // asynchronous function that reads a json file and parses the contents as json object
     * function parseFile(file, key, callback) {
     *     fs.readFile(file, "utf8", function(err, data) {
     *         if (err) return calback(err);
     *         try {
     *             configs[key] = JSON.parse(data);
     *         } catch (e) {
     *             return callback(e);
     *         }
     *         callback();
     *     });
     * }
     *
     * // Using callbacks
     * async.forEachOf(validConfigFileMap, parseFile, function (err) {
     *     if (err) {
     *         console.error(err);
     *     } else {
     *         console.log(configs);
     *         // configs is now a map of JSON data, e.g.
     *         // { dev: //parsed dev.json, test: //parsed test.json, prod: //parsed prod.json}
     *     }
     * });
     *
     * //Error handing
     * async.forEachOf(invalidConfigFileMap, parseFile, function (err) {
     *     if (err) {
     *         console.error(err);
     *         // JSON parse error exception
     *     } else {
     *         console.log(configs);
     *     }
     * });
     *
     * // Using Promises
     * async.forEachOf(validConfigFileMap, parseFile)
     * .then( () => {
     *     console.log(configs);
     *     // configs is now a map of JSON data, e.g.
     *     // { dev: //parsed dev.json, test: //parsed test.json, prod: //parsed prod.json}
     * }).catch( err => {
     *     console.error(err);
     * });
     *
     * //Error handing
     * async.forEachOf(invalidConfigFileMap, parseFile)
     * .then( () => {
     *     console.log(configs);
     * }).catch( err => {
     *     console.error(err);
     *     // JSON parse error exception
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         let result = await async.forEachOf(validConfigFileMap, parseFile);
     *         console.log(configs);
     *         // configs is now a map of JSON data, e.g.
     *         // { dev: //parsed dev.json, test: //parsed test.json, prod: //parsed prod.json}
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * //Error handing
     * async () => {
     *     try {
     *         let result = await async.forEachOf(invalidConfigFileMap, parseFile);
     *         console.log(configs);
     *     }
     *     catch (err) {
     *         console.log(err);
     *         // JSON parse error exception
     *     }
     * }
     *
     */
    function eachOf(coll, iteratee, callback) {
      var eachOfImplementation = (0, _isArrayLike2.default)(coll) ? eachOfArrayLike : eachOfGeneric
      return eachOfImplementation(coll, (0, _wrapAsync2.default)(iteratee), callback)
    }

    exports.default = (0, _awaitify2.default)(eachOf, 3)
    module.exports = exports.default
  })(eachOf, eachOf.exports)
  return eachOf.exports
}

var withoutIndex = { exports: {} }

var hasRequiredWithoutIndex

function requireWithoutIndex() {
  if (hasRequiredWithoutIndex) return withoutIndex.exports
  hasRequiredWithoutIndex = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })
    exports.default = _withoutIndex
    function _withoutIndex(iteratee) {
      return (value, index, callback) => iteratee(value, callback)
    }
    module.exports = exports.default
  })(withoutIndex, withoutIndex.exports)
  return withoutIndex.exports
}

var hasRequiredForEach

function requireForEach() {
  if (hasRequiredForEach) return forEach.exports
  hasRequiredForEach = 1
  ;(function (module, exports) {
    Object.defineProperty(exports, '__esModule', {
      value: true,
    })

    var _eachOf = requireEachOf()

    var _eachOf2 = _interopRequireDefault(_eachOf)

    var _withoutIndex = requireWithoutIndex()

    var _withoutIndex2 = _interopRequireDefault(_withoutIndex)

    var _wrapAsync = requireWrapAsync()

    var _wrapAsync2 = _interopRequireDefault(_wrapAsync)

    var _awaitify = requireAwaitify()

    var _awaitify2 = _interopRequireDefault(_awaitify)

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj }
    }

    /**
     * Applies the function `iteratee` to each item in `coll`, in parallel.
     * The `iteratee` is called with an item from the list, and a callback for when
     * it has finished. If the `iteratee` passes an error to its `callback`, the
     * main `callback` (for the `each` function) is immediately called with the
     * error.
     *
     * Note, that since this function applies `iteratee` to each item in parallel,
     * there is no guarantee that the iteratee functions will complete in order.
     *
     * @name each
     * @static
     * @memberOf module:Collections
     * @method
     * @alias forEach
     * @category Collection
     * @param {Array|Iterable|AsyncIterable|Object} coll - A collection to iterate over.
     * @param {AsyncFunction} iteratee - An async function to apply to
     * each item in `coll`. Invoked with (item, callback).
     * The array index is not passed to the iteratee.
     * If you need the index, use `eachOf`.
     * @param {Function} [callback] - A callback which is called when all
     * `iteratee` functions have finished, or an error occurs. Invoked with (err).
     * @returns {Promise} a promise, if a callback is omitted
     * @example
     *
     * // dir1 is a directory that contains file1.txt, file2.txt
     * // dir2 is a directory that contains file3.txt, file4.txt
     * // dir3 is a directory that contains file5.txt
     * // dir4 does not exist
     *
     * const fileList = [ 'dir1/file2.txt', 'dir2/file3.txt', 'dir/file5.txt'];
     * const withMissingFileList = ['dir1/file1.txt', 'dir4/file2.txt'];
     *
     * // asynchronous function that deletes a file
     * const deleteFile = function(file, callback) {
     *     fs.unlink(file, callback);
     * };
     *
     * // Using callbacks
     * async.each(fileList, deleteFile, function(err) {
     *     if( err ) {
     *         console.log(err);
     *     } else {
     *         console.log('All files have been deleted successfully');
     *     }
     * });
     *
     * // Error Handling
     * async.each(withMissingFileList, deleteFile, function(err){
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     *     // since dir4/file2.txt does not exist
     *     // dir1/file1.txt could have been deleted
     * });
     *
     * // Using Promises
     * async.each(fileList, deleteFile)
     * .then( () => {
     *     console.log('All files have been deleted successfully');
     * }).catch( err => {
     *     console.log(err);
     * });
     *
     * // Error Handling
     * async.each(fileList, deleteFile)
     * .then( () => {
     *     console.log('All files have been deleted successfully');
     * }).catch( err => {
     *     console.log(err);
     *     // [ Error: ENOENT: no such file or directory ]
     *     // since dir4/file2.txt does not exist
     *     // dir1/file1.txt could have been deleted
     * });
     *
     * // Using async/await
     * async () => {
     *     try {
     *         await async.each(files, deleteFile);
     *     }
     *     catch (err) {
     *         console.log(err);
     *     }
     * }
     *
     * // Error Handling
     * async () => {
     *     try {
     *         await async.each(withMissingFileList, deleteFile);
     *     }
     *     catch (err) {
     *         console.log(err);
     *         // [ Error: ENOENT: no such file or directory ]
     *         // since dir4/file2.txt does not exist
     *         // dir1/file1.txt could have been deleted
     *     }
     * }
     *
     */
    function eachLimit(coll, iteratee, callback) {
      return (0, _eachOf2.default)(
        coll,
        (0, _withoutIndex2.default)((0, _wrapAsync2.default)(iteratee)),
        callback,
      )
    }

    exports.default = (0, _awaitify2.default)(eachLimit, 3)
    module.exports = exports.default
  })(forEach, forEach.exports)
  return forEach.exports
}

var fn_name
var hasRequiredFn_name

function requireFn_name() {
  if (hasRequiredFn_name) return fn_name
  hasRequiredFn_name = 1

  var toString = Object.prototype.toString

  /**
   * Extract names from functions.
   *
   * @param {Function} fn The function who's name we need to extract.
   * @returns {String} The name of the function.
   * @public
   */
  fn_name = function name(fn) {
    if ('string' === typeof fn.displayName && fn.constructor.name) {
      return fn.displayName
    } else if ('string' === typeof fn.name && fn.name) {
      return fn.name
    }

    //
    // Check to see if the constructor has a name.
    //
    if ('object' === typeof fn && fn.constructor && 'string' === typeof fn.constructor.name)
      return fn.constructor.name

    //
    // toString the given function and attempt to parse it out of it, or determine
    // the class.
    //
    var named = fn.toString(),
      type = toString.call(fn).slice(8, -1)

    if ('Function' === type) {
      named = named.substring(named.indexOf('(') + 1, named.indexOf(')'))
    } else {
      named = type
    }

    return named || 'anonymous'
  }
  return fn_name
}

var oneTime
var hasRequiredOneTime

function requireOneTime() {
  if (hasRequiredOneTime) return oneTime
  hasRequiredOneTime = 1

  var name = requireFn_name()

  /**
   * Wrap callbacks to prevent double execution.
   *
   * @param {Function} fn Function that should only be called once.
   * @returns {Function} A wrapped callback which prevents multiple executions.
   * @public
   */
  oneTime = function one(fn) {
    var called = 0,
      value

    /**
     * The function that prevents double execution.
     *
     * @private
     */
    function onetime() {
      if (called) return value

      called = 1
      value = fn.apply(this, arguments)
      fn = null

      return value
    }

    //
    // To make debugging more easy we want to use the name of the supplied
    // function. So when you look at the functions that are assigned to event
    // listeners you don't see a load of `onetime` functions but actually the
    // names of the functions that this module will call.
    //
    // NOTE: We cannot override the `name` property, as that is `readOnly`
    // property, so displayName will have to do.
    //
    onetime.displayName = name(fn)
    return onetime
  }
  return oneTime
}

var stackTrace = {}

var hasRequiredStackTrace

function requireStackTrace() {
  if (hasRequiredStackTrace) return stackTrace
  hasRequiredStackTrace = 1
  ;(function (exports) {
    exports.get = function (belowFn) {
      var oldLimit = Error.stackTraceLimit
      Error.stackTraceLimit = Infinity

      var dummyObject = {}

      var v8Handler = Error.prepareStackTrace
      Error.prepareStackTrace = function (dummyObject, v8StackTrace) {
        return v8StackTrace
      }
      Error.captureStackTrace(dummyObject, belowFn || exports.get)

      var v8StackTrace = dummyObject.stack
      Error.prepareStackTrace = v8Handler
      Error.stackTraceLimit = oldLimit

      return v8StackTrace
    }

    exports.parse = function (err) {
      if (!err.stack) {
        return []
      }

      var self = this
      var lines = err.stack.split('\n').slice(1)

      return lines
        .map(function (line) {
          if (line.match(/^\s*[-]{4,}$/)) {
            return self._createParsedCallSite({
              fileName: line,
              lineNumber: null,
              functionName: null,
              typeName: null,
              methodName: null,
              columnNumber: null,
              native: null,
            })
          }

          var lineMatch = line.match(/at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/)
          if (!lineMatch) {
            return
          }

          var object = null
          var method = null
          var functionName = null
          var typeName = null
          var methodName = null
          var isNative = lineMatch[5] === 'native'

          if (lineMatch[1]) {
            functionName = lineMatch[1]
            var methodStart = functionName.lastIndexOf('.')
            if (functionName[methodStart - 1] == '.') methodStart--
            if (methodStart > 0) {
              object = functionName.substr(0, methodStart)
              method = functionName.substr(methodStart + 1)
              var objectEnd = object.indexOf('.Module')
              if (objectEnd > 0) {
                functionName = functionName.substr(objectEnd + 1)
                object = object.substr(0, objectEnd)
              }
            }
            typeName = null
          }

          if (method) {
            typeName = object
            methodName = method
          }

          if (method === '<anonymous>') {
            methodName = null
            functionName = null
          }

          var properties = {
            fileName: lineMatch[2] || null,
            lineNumber: parseInt(lineMatch[3], 10) || null,
            functionName: functionName,
            typeName: typeName,
            methodName: methodName,
            columnNumber: parseInt(lineMatch[4], 10) || null,
            native: isNative,
          }

          return self._createParsedCallSite(properties)
        })
        .filter(function (callSite) {
          return !!callSite
        })
    }

    function CallSite(properties) {
      for (var property in properties) {
        this[property] = properties[property]
      }
    }

    var strProperties = [
      'this',
      'typeName',
      'functionName',
      'methodName',
      'fileName',
      'lineNumber',
      'columnNumber',
      'function',
      'evalOrigin',
    ]
    var boolProperties = ['topLevel', 'eval', 'native', 'constructor']
    strProperties.forEach(function (property) {
      CallSite.prototype[property] = null
      CallSite.prototype['get' + property[0].toUpperCase() + property.substr(1)] = function () {
        return this[property]
      }
    })
    boolProperties.forEach(function (property) {
      CallSite.prototype[property] = false
      CallSite.prototype['is' + property[0].toUpperCase() + property.substr(1)] = function () {
        return this[property]
      }
    })

    exports._createParsedCallSite = function (properties) {
      return new CallSite(properties)
    }
  })(stackTrace)
  return stackTrace
}

/**
 * exception-stream.js: TODO: add file header handler.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var exceptionStream
var hasRequiredExceptionStream

function requireExceptionStream() {
  if (hasRequiredExceptionStream) return exceptionStream
  hasRequiredExceptionStream = 1

  const { Writable } = requireReadable()

  /**
   * TODO: add class description.
   * @type {ExceptionStream}
   * @extends {Writable}
   */
  exceptionStream = class ExceptionStream extends Writable {
    /**
     * Constructor function for the ExceptionStream responsible for wrapping a
     * TransportStream; only allowing writes of `info` objects with
     * `info.exception` set to true.
     * @param {!TransportStream} transport - Stream to filter to exceptions
     */
    constructor(transport) {
      super({ objectMode: true })

      if (!transport) {
        throw new Error('ExceptionStream requires a TransportStream instance.')
      }

      // Remark (indexzero): we set `handleExceptions` here because it's the
      // predicate checked in ExceptionHandler.prototype.__getExceptionHandlers
      this.handleExceptions = true
      this.transport = transport
    }

    /**
     * Writes the info object to our transport instance if (and only if) the
     * `exception` property is set on the info.
     * @param {mixed} info - TODO: add param description.
     * @param {mixed} enc - TODO: add param description.
     * @param {mixed} callback - TODO: add param description.
     * @returns {mixed} - TODO: add return description.
     * @private
     */
    _write(info, enc, callback) {
      if (info.exception) {
        return this.transport.log(info, callback)
      }

      callback()
      return true
    }
  }
  return exceptionStream
}

/**
 * exception-handler.js: Object for handling uncaughtException events.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var exceptionHandler
var hasRequiredExceptionHandler

function requireExceptionHandler() {
  if (hasRequiredExceptionHandler) return exceptionHandler
  hasRequiredExceptionHandler = 1

  const os = require$$0$1
  const asyncForEach = requireForEach()
  const debug = requireNode()('winston:exception')
  const once = requireOneTime()
  const stackTrace = requireStackTrace()
  const ExceptionStream = requireExceptionStream()

  /**
   * Object for handling uncaughtException events.
   * @type {ExceptionHandler}
   */
  exceptionHandler = class ExceptionHandler {
    /**
     * TODO: add contructor description
     * @param {!Logger} logger - TODO: add param description
     */
    constructor(logger) {
      if (!logger) {
        throw new Error('Logger is required to handle exceptions')
      }

      this.logger = logger
      this.handlers = new Map()
    }

    /**
     * Handles `uncaughtException` events for the current process by adding any
     * handlers passed in.
     * @returns {undefined}
     */
    handle(...args) {
      args.forEach((arg) => {
        if (Array.isArray(arg)) {
          return arg.forEach((handler) => this._addHandler(handler))
        }

        this._addHandler(arg)
      })

      if (!this.catcher) {
        this.catcher = this._uncaughtException.bind(this)
        process.on('uncaughtException', this.catcher)
      }
    }

    /**
     * Removes any handlers to `uncaughtException` events for the current
     * process. This does not modify the state of the `this.handlers` set.
     * @returns {undefined}
     */
    unhandle() {
      if (this.catcher) {
        process.removeListener('uncaughtException', this.catcher)
        this.catcher = false

        Array.from(this.handlers.values()).forEach((wrapper) => this.logger.unpipe(wrapper))
      }
    }

    /**
     * TODO: add method description
     * @param {Error} err - Error to get information about.
     * @returns {mixed} - TODO: add return description.
     */
    getAllInfo(err) {
      let message = null
      if (err) {
        message = typeof err === 'string' ? err : err.message
      }

      return {
        error: err,
        // TODO (indexzero): how do we configure this?
        level: 'error',
        message: [
          `uncaughtException: ${message || '(no error message)'}`,
          (err && err.stack) || '  No stack trace',
        ].join('\n'),
        stack: err && err.stack,
        exception: true,
        date: new Date().toString(),
        process: this.getProcessInfo(),
        os: this.getOsInfo(),
        trace: this.getTrace(err),
      }
    }

    /**
     * Gets all relevant process information for the currently running process.
     * @returns {mixed} - TODO: add return description.
     */
    getProcessInfo() {
      return {
        pid: process.pid,
        uid: process.getuid ? process.getuid() : null,
        gid: process.getgid ? process.getgid() : null,
        cwd: process.cwd(),
        execPath: process.execPath,
        version: process.version,
        argv: process.argv,
        memoryUsage: process.memoryUsage(),
      }
    }

    /**
     * Gets all relevant OS information for the currently running process.
     * @returns {mixed} - TODO: add return description.
     */
    getOsInfo() {
      return {
        loadavg: os.loadavg(),
        uptime: os.uptime(),
      }
    }

    /**
     * Gets a stack trace for the specified error.
     * @param {mixed} err - TODO: add param description.
     * @returns {mixed} - TODO: add return description.
     */
    getTrace(err) {
      const trace = err ? stackTrace.parse(err) : stackTrace.get()
      return trace.map((site) => {
        return {
          column: site.getColumnNumber(),
          file: site.getFileName(),
          function: site.getFunctionName(),
          line: site.getLineNumber(),
          method: site.getMethodName(),
          native: site.isNative(),
        }
      })
    }

    /**
     * Helper method to add a transport as an exception handler.
     * @param {Transport} handler - The transport to add as an exception handler.
     * @returns {void}
     */
    _addHandler(handler) {
      if (!this.handlers.has(handler)) {
        handler.handleExceptions = true
        const wrapper = new ExceptionStream(handler)
        this.handlers.set(handler, wrapper)
        this.logger.pipe(wrapper)
      }
    }

    /**
     * Logs all relevant information around the `err` and exits the current
     * process.
     * @param {Error} err - Error to handle
     * @returns {mixed} - TODO: add return description.
     * @private
     */
    _uncaughtException(err) {
      const info = this.getAllInfo(err)
      const handlers = this._getExceptionHandlers()
      // Calculate if we should exit on this error
      let doExit =
        typeof this.logger.exitOnError === 'function'
          ? this.logger.exitOnError(err)
          : this.logger.exitOnError
      let timeout

      if (!handlers.length && doExit) {
        // eslint-disable-next-line no-console
        console.warn('winston: exitOnError cannot be true with no exception handlers.')
        // eslint-disable-next-line no-console
        console.warn('winston: not exiting process.')
        doExit = false
      }

      function gracefulExit() {
        debug('doExit', doExit)
        debug('process._exiting', process._exiting)

        if (doExit && !process._exiting) {
          // Remark: Currently ignoring any exceptions from transports when
          // catching uncaught exceptions.
          if (timeout) {
            clearTimeout(timeout)
          }
          // eslint-disable-next-line no-process-exit
          process.exit(1)
        }
      }

      if (!handlers || handlers.length === 0) {
        return process.nextTick(gracefulExit)
      }

      // Log to all transports attempting to listen for when they are completed.
      asyncForEach(
        handlers,
        (handler, next) => {
          const done = once(next)
          const transport = handler.transport || handler

          // Debug wrapping so that we can inspect what's going on under the covers.
          function onDone(event) {
            return () => {
              debug(event)
              done()
            }
          }

          transport._ending = true
          transport.once('finish', onDone('finished'))
          transport.once('error', onDone('error'))
        },
        () => doExit && gracefulExit(),
      )

      this.logger.log(info)

      // If exitOnError is true, then only allow the logging of exceptions to
      // take up to `3000ms`.
      if (doExit) {
        timeout = setTimeout(gracefulExit, 3000)
      }
    }

    /**
     * Returns the list of transports and exceptionHandlers for this instance.
     * @returns {Array} - List of transports and exceptionHandlers for this
     * instance.
     * @private
     */
    _getExceptionHandlers() {
      // Remark (indexzero): since `logger.transports` returns all of the pipes
      // from the _readableState of the stream we actually get the join of the
      // explicit handlers and the implicit transports with
      // `handleExceptions: true`
      return this.logger.transports.filter((wrap) => {
        const transport = wrap.transport || wrap
        return transport.handleExceptions
      })
    }
  }
  return exceptionHandler
}

/**
 * rejection-stream.js: TODO: add file header handler.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var rejectionStream
var hasRequiredRejectionStream

function requireRejectionStream() {
  if (hasRequiredRejectionStream) return rejectionStream
  hasRequiredRejectionStream = 1

  const { Writable } = requireReadable()

  /**
   * TODO: add class description.
   * @type {RejectionStream}
   * @extends {Writable}
   */
  rejectionStream = class RejectionStream extends Writable {
    /**
     * Constructor function for the RejectionStream responsible for wrapping a
     * TransportStream; only allowing writes of `info` objects with
     * `info.rejection` set to true.
     * @param {!TransportStream} transport - Stream to filter to rejections
     */
    constructor(transport) {
      super({ objectMode: true })

      if (!transport) {
        throw new Error('RejectionStream requires a TransportStream instance.')
      }

      this.handleRejections = true
      this.transport = transport
    }

    /**
     * Writes the info object to our transport instance if (and only if) the
     * `rejection` property is set on the info.
     * @param {mixed} info - TODO: add param description.
     * @param {mixed} enc - TODO: add param description.
     * @param {mixed} callback - TODO: add param description.
     * @returns {mixed} - TODO: add return description.
     * @private
     */
    _write(info, enc, callback) {
      if (info.rejection) {
        return this.transport.log(info, callback)
      }

      callback()
      return true
    }
  }
  return rejectionStream
}

/**
 * exception-handler.js: Object for handling uncaughtException events.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var rejectionHandler
var hasRequiredRejectionHandler

function requireRejectionHandler() {
  if (hasRequiredRejectionHandler) return rejectionHandler
  hasRequiredRejectionHandler = 1

  const os = require$$0$1
  const asyncForEach = requireForEach()
  const debug = requireNode()('winston:rejection')
  const once = requireOneTime()
  const stackTrace = requireStackTrace()
  const RejectionStream = requireRejectionStream()

  /**
   * Object for handling unhandledRejection events.
   * @type {RejectionHandler}
   */
  rejectionHandler = class RejectionHandler {
    /**
     * TODO: add contructor description
     * @param {!Logger} logger - TODO: add param description
     */
    constructor(logger) {
      if (!logger) {
        throw new Error('Logger is required to handle rejections')
      }

      this.logger = logger
      this.handlers = new Map()
    }

    /**
     * Handles `unhandledRejection` events for the current process by adding any
     * handlers passed in.
     * @returns {undefined}
     */
    handle(...args) {
      args.forEach((arg) => {
        if (Array.isArray(arg)) {
          return arg.forEach((handler) => this._addHandler(handler))
        }

        this._addHandler(arg)
      })

      if (!this.catcher) {
        this.catcher = this._unhandledRejection.bind(this)
        process.on('unhandledRejection', this.catcher)
      }
    }

    /**
     * Removes any handlers to `unhandledRejection` events for the current
     * process. This does not modify the state of the `this.handlers` set.
     * @returns {undefined}
     */
    unhandle() {
      if (this.catcher) {
        process.removeListener('unhandledRejection', this.catcher)
        this.catcher = false

        Array.from(this.handlers.values()).forEach((wrapper) => this.logger.unpipe(wrapper))
      }
    }

    /**
     * TODO: add method description
     * @param {Error} err - Error to get information about.
     * @returns {mixed} - TODO: add return description.
     */
    getAllInfo(err) {
      let message = null
      if (err) {
        message = typeof err === 'string' ? err : err.message
      }

      return {
        error: err,
        // TODO (indexzero): how do we configure this?
        level: 'error',
        message: [
          `unhandledRejection: ${message || '(no error message)'}`,
          (err && err.stack) || '  No stack trace',
        ].join('\n'),
        stack: err && err.stack,
        rejection: true,
        date: new Date().toString(),
        process: this.getProcessInfo(),
        os: this.getOsInfo(),
        trace: this.getTrace(err),
      }
    }

    /**
     * Gets all relevant process information for the currently running process.
     * @returns {mixed} - TODO: add return description.
     */
    getProcessInfo() {
      return {
        pid: process.pid,
        uid: process.getuid ? process.getuid() : null,
        gid: process.getgid ? process.getgid() : null,
        cwd: process.cwd(),
        execPath: process.execPath,
        version: process.version,
        argv: process.argv,
        memoryUsage: process.memoryUsage(),
      }
    }

    /**
     * Gets all relevant OS information for the currently running process.
     * @returns {mixed} - TODO: add return description.
     */
    getOsInfo() {
      return {
        loadavg: os.loadavg(),
        uptime: os.uptime(),
      }
    }

    /**
     * Gets a stack trace for the specified error.
     * @param {mixed} err - TODO: add param description.
     * @returns {mixed} - TODO: add return description.
     */
    getTrace(err) {
      const trace = err ? stackTrace.parse(err) : stackTrace.get()
      return trace.map((site) => {
        return {
          column: site.getColumnNumber(),
          file: site.getFileName(),
          function: site.getFunctionName(),
          line: site.getLineNumber(),
          method: site.getMethodName(),
          native: site.isNative(),
        }
      })
    }

    /**
     * Helper method to add a transport as an exception handler.
     * @param {Transport} handler - The transport to add as an exception handler.
     * @returns {void}
     */
    _addHandler(handler) {
      if (!this.handlers.has(handler)) {
        handler.handleRejections = true
        const wrapper = new RejectionStream(handler)
        this.handlers.set(handler, wrapper)
        this.logger.pipe(wrapper)
      }
    }

    /**
     * Logs all relevant information around the `err` and exits the current
     * process.
     * @param {Error} err - Error to handle
     * @returns {mixed} - TODO: add return description.
     * @private
     */
    _unhandledRejection(err) {
      const info = this.getAllInfo(err)
      const handlers = this._getRejectionHandlers()
      // Calculate if we should exit on this error
      let doExit =
        typeof this.logger.exitOnError === 'function'
          ? this.logger.exitOnError(err)
          : this.logger.exitOnError
      let timeout

      if (!handlers.length && doExit) {
        // eslint-disable-next-line no-console
        console.warn('winston: exitOnError cannot be true with no rejection handlers.')
        // eslint-disable-next-line no-console
        console.warn('winston: not exiting process.')
        doExit = false
      }

      function gracefulExit() {
        debug('doExit', doExit)
        debug('process._exiting', process._exiting)

        if (doExit && !process._exiting) {
          // Remark: Currently ignoring any rejections from transports when
          // catching unhandled rejections.
          if (timeout) {
            clearTimeout(timeout)
          }
          // eslint-disable-next-line no-process-exit
          process.exit(1)
        }
      }

      if (!handlers || handlers.length === 0) {
        return process.nextTick(gracefulExit)
      }

      // Log to all transports attempting to listen for when they are completed.
      asyncForEach(
        handlers,
        (handler, next) => {
          const done = once(next)
          const transport = handler.transport || handler

          // Debug wrapping so that we can inspect what's going on under the covers.
          function onDone(event) {
            return () => {
              debug(event)
              done()
            }
          }

          transport._ending = true
          transport.once('finish', onDone('finished'))
          transport.once('error', onDone('error'))
        },
        () => doExit && gracefulExit(),
      )

      this.logger.log(info)

      // If exitOnError is true, then only allow the logging of exceptions to
      // take up to `3000ms`.
      if (doExit) {
        timeout = setTimeout(gracefulExit, 3000)
      }
    }

    /**
     * Returns the list of transports and exceptionHandlers for this instance.
     * @returns {Array} - List of transports and exceptionHandlers for this
     * instance.
     * @private
     */
    _getRejectionHandlers() {
      // Remark (indexzero): since `logger.transports` returns all of the pipes
      // from the _readableState of the stream we actually get the join of the
      // explicit handlers and the implicit transports with
      // `handleRejections: true`
      return this.logger.transports.filter((wrap) => {
        const transport = wrap.transport || wrap
        return transport.handleRejections
      })
    }
  }
  return rejectionHandler
}

/**
 * profiler.js: TODO: add file header description.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var profiler
var hasRequiredProfiler

function requireProfiler() {
  if (hasRequiredProfiler) return profiler
  hasRequiredProfiler = 1
  /**
   * TODO: add class description.
   * @type {Profiler}
   * @private
   */
  class Profiler {
    /**
     * Constructor function for the Profiler instance used by
     * `Logger.prototype.startTimer`. When done is called the timer will finish
     * and log the duration.
     * @param {!Logger} logger - TODO: add param description.
     * @private
     */
    constructor(logger) {
      const Logger = requireLogger()
      if (typeof logger !== 'object' || Array.isArray(logger) || !(logger instanceof Logger)) {
        throw new Error('Logger is required for profiling')
      } else {
        this.logger = logger
        this.start = Date.now()
      }
    }

    /**
     * Ends the current timer (i.e. Profiler) instance and logs the `msg` along
     * with the duration since creation.
     * @returns {mixed} - TODO: add return description.
     * @private
     */
    done(...args) {
      if (typeof args[args.length - 1] === 'function') {
        // eslint-disable-next-line no-console
        console.warn('Callback function no longer supported as of winston@3.0.0')
        args.pop()
      }

      const info = typeof args[args.length - 1] === 'object' ? args.pop() : {}
      info.level = info.level || 'info'
      info.durationMs = Date.now() - this.start

      return this.logger.write(info)
    }
  }
  profiler = Profiler
  return profiler
}

/**
 * logger.js: TODO: add file header description.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var logger$1
var hasRequiredLogger

function requireLogger() {
  if (hasRequiredLogger) return logger$1
  hasRequiredLogger = 1

  const { Stream, Transform } = requireReadable()
  const asyncForEach = requireForEach()
  const { LEVEL, SPLAT } = requireTripleBeam()
  const isStream = requireIsStream()
  const ExceptionHandler = requireExceptionHandler()
  const RejectionHandler = requireRejectionHandler()
  const LegacyTransportStream = requireLegacy()
  const Profiler = requireProfiler()
  const { warn } = requireCommon()
  const config = requireConfig()

  /**
   * Captures the number of format (i.e. %s strings) in a given string.
   * Based on `util.format`, see Node.js source:
   * https://github.com/nodejs/node/blob/b1c8f15c5f169e021f7c46eb7b219de95fe97603/lib/util.js#L201-L230
   * @type {RegExp}
   */
  const formatRegExp = /%[scdjifoO%]/g

  /**
   * TODO: add class description.
   * @type {Logger}
   * @extends {Transform}
   */
  class Logger extends Transform {
    /**
     * Constructor function for the Logger object responsible for persisting log
     * messages and metadata to one or more transports.
     * @param {!Object} options - foo
     */
    constructor(options) {
      super({ objectMode: true })
      this.configure(options)
    }

    child(defaultRequestMetadata) {
      const logger = this
      return Object.create(logger, {
        write: {
          value: function (info) {
            const infoClone = Object.assign({}, defaultRequestMetadata, info)

            // Object.assign doesn't copy inherited Error
            // properties so we have to do that explicitly
            //
            // Remark (indexzero): we should remove this
            // since the errors format will handle this case.
            //
            if (info instanceof Error) {
              infoClone.stack = info.stack
              infoClone.message = info.message
            }

            logger.write(infoClone)
          },
        },
      })
    }

    /**
     * This will wholesale reconfigure this instance by:
     * 1. Resetting all transports. Older transports will be removed implicitly.
     * 2. Set all other options including levels, colors, rewriters, filters,
     *    exceptionHandlers, etc.
     * @param {!Object} options - TODO: add param description.
     * @returns {undefined}
     */
    configure({
      silent,
      format,
      defaultMeta,
      levels,
      level = 'info',
      exitOnError = true,
      transports,
      colors,
      emitErrs,
      formatters,
      padLevels,
      rewriters,
      stripColors,
      exceptionHandlers,
      rejectionHandlers,
    } = {}) {
      // Reset transports if we already have them
      if (this.transports.length) {
        this.clear()
      }

      this.silent = silent
      this.format = format || this.format || requireJson()()

      this.defaultMeta = defaultMeta || null
      // Hoist other options onto this instance.
      this.levels = levels || this.levels || config.npm.levels
      this.level = level
      if (this.exceptions) {
        this.exceptions.unhandle()
      }
      if (this.rejections) {
        this.rejections.unhandle()
      }
      this.exceptions = new ExceptionHandler(this)
      this.rejections = new RejectionHandler(this)
      this.profilers = {}
      this.exitOnError = exitOnError

      // Add all transports we have been provided.
      if (transports) {
        transports = Array.isArray(transports) ? transports : [transports]
        transports.forEach((transport) => this.add(transport))
      }

      if (colors || emitErrs || formatters || padLevels || rewriters || stripColors) {
        throw new Error(
          [
            '{ colors, emitErrs, formatters, padLevels, rewriters, stripColors } were removed in winston@3.0.0.',
            'Use a custom winston.format(function) instead.',
            'See: https://github.com/winstonjs/winston/tree/master/UPGRADE-3.0.md',
          ].join('\n'),
        )
      }

      if (exceptionHandlers) {
        this.exceptions.handle(exceptionHandlers)
      }
      if (rejectionHandlers) {
        this.rejections.handle(rejectionHandlers)
      }
    }

    isLevelEnabled(level) {
      const givenLevelValue = getLevelValue(this.levels, level)
      if (givenLevelValue === null) {
        return false
      }

      const configuredLevelValue = getLevelValue(this.levels, this.level)
      if (configuredLevelValue === null) {
        return false
      }

      if (!this.transports || this.transports.length === 0) {
        return configuredLevelValue >= givenLevelValue
      }

      const index = this.transports.findIndex((transport) => {
        let transportLevelValue = getLevelValue(this.levels, transport.level)
        if (transportLevelValue === null) {
          transportLevelValue = configuredLevelValue
        }
        return transportLevelValue >= givenLevelValue
      })
      return index !== -1
    }

    /* eslint-disable valid-jsdoc */
    /**
     * Ensure backwards compatibility with a `log` method
     * @param {mixed} level - Level the log message is written at.
     * @param {mixed} msg - TODO: add param description.
     * @param {mixed} meta - TODO: add param description.
     * @returns {Logger} - TODO: add return description.
     *
     * @example
     *    // Supports the existing API:
     *    logger.log('info', 'Hello world', { custom: true });
     *    logger.log('info', new Error('Yo, it\'s on fire'));
     *
     *    // Requires winston.format.splat()
     *    logger.log('info', '%s %d%%', 'A string', 50, { thisIsMeta: true });
     *
     *    // And the new API with a single JSON literal:
     *    logger.log({ level: 'info', message: 'Hello world', custom: true });
     *    logger.log({ level: 'info', message: new Error('Yo, it\'s on fire') });
     *
     *    // Also requires winston.format.splat()
     *    logger.log({
     *      level: 'info',
     *      message: '%s %d%%',
     *      [SPLAT]: ['A string', 50],
     *      meta: { thisIsMeta: true }
     *    });
     *
     */
    /* eslint-enable valid-jsdoc */
    log(level, msg, ...splat) {
      // eslint-disable-line max-params
      // Optimize for the hotpath of logging JSON literals
      if (arguments.length === 1) {
        // Yo dawg, I heard you like levels ... seriously ...
        // In this context the LHS `level` here is actually the `info` so read
        // this as: info[LEVEL] = info.level;
        level[LEVEL] = level.level
        this._addDefaultMeta(level)
        this.write(level)
        return this
      }

      // Slightly less hotpath, but worth optimizing for.
      if (arguments.length === 2) {
        if (msg && typeof msg === 'object') {
          msg[LEVEL] = msg.level = level
          this._addDefaultMeta(msg)
          this.write(msg)
          return this
        }

        msg = { [LEVEL]: level, level, message: msg }
        this._addDefaultMeta(msg)
        this.write(msg)
        return this
      }

      const [meta] = splat
      if (typeof meta === 'object' && meta !== null) {
        // Extract tokens, if none available default to empty array to
        // ensure consistancy in expected results
        const tokens = msg && msg.match && msg.match(formatRegExp)

        if (!tokens) {
          const info = Object.assign({}, this.defaultMeta, meta, {
            [LEVEL]: level,
            [SPLAT]: splat,
            level,
            message: msg,
          })

          if (meta.message) info.message = `${info.message} ${meta.message}`
          if (meta.stack) info.stack = meta.stack
          if (meta.cause) info.cause = meta.cause

          this.write(info)
          return this
        }
      }

      this.write(
        Object.assign({}, this.defaultMeta, {
          [LEVEL]: level,
          [SPLAT]: splat,
          level,
          message: msg,
        }),
      )

      return this
    }

    /**
     * Pushes data so that it can be picked up by all of our pipe targets.
     * @param {mixed} info - TODO: add param description.
     * @param {mixed} enc - TODO: add param description.
     * @param {mixed} callback - Continues stream processing.
     * @returns {undefined}
     * @private
     */
    _transform(info, enc, callback) {
      if (this.silent) {
        return callback()
      }

      // [LEVEL] is only soft guaranteed to be set here since we are a proper
      // stream. It is likely that `info` came in through `.log(info)` or
      // `.info(info)`. If it is not defined, however, define it.
      // This LEVEL symbol is provided by `triple-beam` and also used in:
      // - logform
      // - winston-transport
      // - abstract-winston-transport
      if (!info[LEVEL]) {
        info[LEVEL] = info.level
      }

      // Remark: really not sure what to do here, but this has been reported as
      // very confusing by pre winston@2.0.0 users as quite confusing when using
      // custom levels.
      if (!this.levels[info[LEVEL]] && this.levels[info[LEVEL]] !== 0) {
        // eslint-disable-next-line no-console
        console.error('[winston] Unknown logger level: %s', info[LEVEL])
      }

      // Remark: not sure if we should simply error here.
      if (!this._readableState.pipes) {
        // eslint-disable-next-line no-console
        console.error(
          '[winston] Attempt to write logs with no transports, which can increase memory usage: %j',
          info,
        )
      }

      // Here we write to the `format` pipe-chain, which on `readable` above will
      // push the formatted `info` Object onto the buffer for this instance. We trap
      // (and re-throw) any errors generated by the user-provided format, but also
      // guarantee that the streams callback is invoked so that we can continue flowing.
      try {
        this.push(this.format.transform(info, this.format.options))
      } finally {
        this._writableState.sync = false
        // eslint-disable-next-line callback-return
        callback()
      }
    }

    /**
     * Delays the 'finish' event until all transport pipe targets have
     * also emitted 'finish' or are already finished.
     * @param {mixed} callback - Continues stream processing.
     */
    _final(callback) {
      const transports = this.transports.slice()
      asyncForEach(
        transports,
        (transport, next) => {
          if (!transport || transport.finished) return setImmediate(next)
          transport.once('finish', next)
          transport.end()
        },
        callback,
      )
    }

    /**
     * Adds the transport to this logger instance by piping to it.
     * @param {mixed} transport - TODO: add param description.
     * @returns {Logger} - TODO: add return description.
     */
    add(transport) {
      // Support backwards compatibility with all existing `winston < 3.x.x`
      // transports which meet one of two criteria:
      // 1. They inherit from winston.Transport in  < 3.x.x which is NOT a stream.
      // 2. They expose a log method which has a length greater than 2 (i.e. more then
      //    just `log(info, callback)`.
      const target =
        !isStream(transport) || transport.log.length > 2
          ? new LegacyTransportStream({ transport })
          : transport

      if (!target._writableState || !target._writableState.objectMode) {
        throw new Error('Transports must WritableStreams in objectMode. Set { objectMode: true }.')
      }

      // Listen for the `error` event and the `warn` event on the new Transport.
      this._onEvent('error', target)
      this._onEvent('warn', target)
      this.pipe(target)

      if (transport.handleExceptions) {
        this.exceptions.handle()
      }

      if (transport.handleRejections) {
        this.rejections.handle()
      }

      return this
    }

    /**
     * Removes the transport from this logger instance by unpiping from it.
     * @param {mixed} transport - TODO: add param description.
     * @returns {Logger} - TODO: add return description.
     */
    remove(transport) {
      if (!transport) return this
      let target = transport
      if (!isStream(transport) || transport.log.length > 2) {
        target = this.transports.filter((match) => match.transport === transport)[0]
      }

      if (target) {
        this.unpipe(target)
      }
      return this
    }

    /**
     * Removes all transports from this logger instance.
     * @returns {Logger} - TODO: add return description.
     */
    clear() {
      this.unpipe()
      return this
    }

    /**
     * Cleans up resources (streams, event listeners) for all transports
     * associated with this instance (if necessary).
     * @returns {Logger} - TODO: add return description.
     */
    close() {
      this.exceptions.unhandle()
      this.rejections.unhandle()
      this.clear()
      this.emit('close')
      return this
    }

    /**
     * Sets the `target` levels specified on this instance.
     * @param {Object} Target levels to use on this instance.
     */
    setLevels() {
      warn.deprecated('setLevels')
    }

    /**
     * Queries the all transports for this instance with the specified `options`.
     * This will aggregate each transport's results into one object containing
     * a property per transport.
     * @param {Object} options - Query options for this instance.
     * @param {function} callback - Continuation to respond to when complete.
     */
    query(options, callback) {
      if (typeof options === 'function') {
        callback = options
        options = {}
      }

      options = options || {}
      const results = {}
      const queryObject = Object.assign({}, options.query || {})

      // Helper function to query a single transport
      function queryTransport(transport, next) {
        if (options.query && typeof transport.formatQuery === 'function') {
          options.query = transport.formatQuery(queryObject)
        }

        transport.query(options, (err, res) => {
          if (err) {
            return next(err)
          }

          if (typeof transport.formatResults === 'function') {
            res = transport.formatResults(res, options.format)
          }

          next(null, res)
        })
      }

      // Helper function to accumulate the results from `queryTransport` into
      // the `results`.
      function addResults(transport, next) {
        queryTransport(transport, (err, result) => {
          // queryTransport could potentially invoke the callback multiple times
          // since Transport code can be unpredictable.
          if (next) {
            result = err || result
            if (result) {
              results[transport.name] = result
            }

            // eslint-disable-next-line callback-return
            next()
          }

          next = null
        })
      }

      // Iterate over the transports in parallel setting the appropriate key in
      // the `results`.
      asyncForEach(
        this.transports.filter((transport) => !!transport.query),
        addResults,
        () => callback(null, results),
      )
    }

    /**
     * Returns a log stream for all transports. Options object is optional.
     * @param{Object} options={} - Stream options for this instance.
     * @returns {Stream} - TODO: add return description.
     */
    stream(options = {}) {
      const out = new Stream()
      const streams = []

      out._streams = streams
      out.destroy = () => {
        let i = streams.length
        while (i--) {
          streams[i].destroy()
        }
      }

      // Create a list of all transports for this instance.
      this.transports
        .filter((transport) => !!transport.stream)
        .forEach((transport) => {
          const str = transport.stream(options)
          if (!str) {
            return
          }

          streams.push(str)

          str.on('log', (log) => {
            log.transport = log.transport || []
            log.transport.push(transport.name)
            out.emit('log', log)
          })

          str.on('error', (err) => {
            err.transport = err.transport || []
            err.transport.push(transport.name)
            out.emit('error', err)
          })
        })

      return out
    }

    /**
     * Returns an object corresponding to a specific timing. When done is called
     * the timer will finish and log the duration. e.g.:
     * @returns {Profile} - TODO: add return description.
     * @example
     *    const timer = winston.startTimer()
     *    setTimeout(() => {
     *      timer.done({
     *        message: 'Logging message'
     *      });
     *    }, 1000);
     */
    startTimer() {
      return new Profiler(this)
    }

    /**
     * Tracks the time inbetween subsequent calls to this method with the same
     * `id` parameter. The second call to this method will log the difference in
     * milliseconds along with the message.
     * @param {string} id Unique id of the profiler
     * @returns {Logger} - TODO: add return description.
     */
    profile(id, ...args) {
      const time = Date.now()
      if (this.profilers[id]) {
        const timeEnd = this.profilers[id]
        delete this.profilers[id]

        // Attempt to be kind to users if they are still using older APIs.
        if (typeof args[args.length - 2] === 'function') {
          // eslint-disable-next-line no-console
          console.warn('Callback function no longer supported as of winston@3.0.0')
          args.pop()
        }

        // Set the duration property of the metadata
        const info = typeof args[args.length - 1] === 'object' ? args.pop() : {}
        info.level = info.level || 'info'
        info.durationMs = time - timeEnd
        info.message = info.message || id
        return this.write(info)
      }

      this.profilers[id] = time
      return this
    }

    /**
     * Backwards compatibility to `exceptions.handle` in winston < 3.0.0.
     * @returns {undefined}
     * @deprecated
     */
    handleExceptions(...args) {
      // eslint-disable-next-line no-console
      console.warn(
        'Deprecated: .handleExceptions() will be removed in winston@4. Use .exceptions.handle()',
      )
      this.exceptions.handle(...args)
    }

    /**
     * Backwards compatibility to `exceptions.handle` in winston < 3.0.0.
     * @returns {undefined}
     * @deprecated
     */
    unhandleExceptions(...args) {
      // eslint-disable-next-line no-console
      console.warn(
        'Deprecated: .unhandleExceptions() will be removed in winston@4. Use .exceptions.unhandle()',
      )
      this.exceptions.unhandle(...args)
    }

    /**
     * Throw a more meaningful deprecation notice
     * @throws {Error} - TODO: add throws description.
     */
    cli() {
      throw new Error(
        [
          'Logger.cli() was removed in winston@3.0.0',
          'Use a custom winston.formats.cli() instead.',
          'See: https://github.com/winstonjs/winston/tree/master/UPGRADE-3.0.md',
        ].join('\n'),
      )
    }

    /**
     * Bubbles the `event` that occured on the specified `transport` up
     * from this instance.
     * @param {string} event - The event that occured
     * @param {Object} transport - Transport on which the event occured
     * @private
     */
    _onEvent(event, transport) {
      function transportEvent(err) {
        // https://github.com/winstonjs/winston/issues/1364
        if (event === 'error' && !this.transports.includes(transport)) {
          this.add(transport)
        }
        this.emit(event, err, transport)
      }

      if (!transport['__winston' + event]) {
        transport['__winston' + event] = transportEvent.bind(this)
        transport.on(event, transport['__winston' + event])
      }
    }

    _addDefaultMeta(msg) {
      if (this.defaultMeta) {
        Object.assign(msg, this.defaultMeta)
      }
    }
  }

  function getLevelValue(levels, level) {
    const value = levels[level]
    if (!value && value !== 0) {
      return null
    }
    return value
  }

  /**
   * Represents the current readableState pipe targets for this Logger instance.
   * @type {Array|Object}
   */
  Object.defineProperty(Logger.prototype, 'transports', {
    configurable: false,
    enumerable: true,
    get() {
      const { pipes } = this._readableState
      return !Array.isArray(pipes) ? [pipes].filter(Boolean) : pipes
    },
  })

  logger$1 = Logger
  return logger$1
}

/**
 * create-logger.js: Logger factory for winston logger instances.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var createLogger
var hasRequiredCreateLogger

function requireCreateLogger() {
  if (hasRequiredCreateLogger) return createLogger
  hasRequiredCreateLogger = 1

  const { LEVEL } = requireTripleBeam()
  const config = requireConfig()
  const Logger = requireLogger()
  const debug = requireNode()('winston:create-logger')

  function isLevelEnabledFunctionName(level) {
    return 'is' + level.charAt(0).toUpperCase() + level.slice(1) + 'Enabled'
  }

  /**
   * Create a new instance of a winston Logger. Creates a new
   * prototype for each instance.
   * @param {!Object} opts - Options for the created logger.
   * @returns {Logger} - A newly created logger instance.
   */
  createLogger = function (opts = {}) {
    //
    // Default levels: npm
    //
    opts.levels = opts.levels || config.npm.levels

    /**
     * DerivedLogger to attach the logs level methods.
     * @type {DerivedLogger}
     * @extends {Logger}
     */
    class DerivedLogger extends Logger {
      /**
       * Create a new class derived logger for which the levels can be attached to
       * the prototype of. This is a V8 optimization that is well know to increase
       * performance of prototype functions.
       * @param {!Object} options - Options for the created logger.
       */
      constructor(options) {
        super(options)
      }
    }

    const logger = new DerivedLogger(opts)

    //
    // Create the log level methods for the derived logger.
    //
    Object.keys(opts.levels).forEach(function (level) {
      debug('Define prototype method for "%s"', level)
      if (level === 'log') {
        // eslint-disable-next-line no-console
        console.warn(
          'Level "log" not defined: conflicts with the method "log". Use a different level name.',
        )
        return
      }

      //
      // Define prototype methods for each log level e.g.:
      // logger.log('info', msg) implies these methods are defined:
      // - logger.info(msg)
      // - logger.isInfoEnabled()
      //
      // Remark: to support logger.child this **MUST** be a function
      // so it'll always be called on the instance instead of a fixed
      // place in the prototype chain.
      //
      DerivedLogger.prototype[level] = function (...args) {
        // Prefer any instance scope, but default to "root" logger
        const self = this || logger

        // Optimize the hot-path which is the single object.
        if (args.length === 1) {
          const [msg] = args
          const info = (msg && msg.message && msg) || { message: msg }
          info.level = info[LEVEL] = level
          self._addDefaultMeta(info)
          self.write(info)
          return this || logger
        }

        // When provided nothing assume the empty string
        if (args.length === 0) {
          self.log(level, '')
          return self
        }

        // Otherwise build argument list which could potentially conform to
        // either:
        // . v3 API: log(obj)
        // 2. v1/v2 API: log(level, msg, ... [string interpolate], [{metadata}], [callback])
        return self.log(level, ...args)
      }

      DerivedLogger.prototype[isLevelEnabledFunctionName(level)] = function () {
        return (this || logger).isLevelEnabled(level)
      }
    })

    return logger
  }
  return createLogger
}

/**
 * container.js: Inversion of control container for winston logger instances.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var container
var hasRequiredContainer

function requireContainer() {
  if (hasRequiredContainer) return container
  hasRequiredContainer = 1

  const createLogger = requireCreateLogger()

  /**
   * Inversion of control container for winston logger instances.
   * @type {Container}
   */
  container = class Container {
    /**
     * Constructor function for the Container object responsible for managing a
     * set of `winston.Logger` instances based on string ids.
     * @param {!Object} [options={}] - Default pass-thru options for Loggers.
     */
    constructor(options = {}) {
      this.loggers = new Map()
      this.options = options
    }

    /**
     * Retrieves a `winston.Logger` instance for the specified `id`. If an
     * instance does not exist, one is created.
     * @param {!string} id - The id of the Logger to get.
     * @param {?Object} [options] - Options for the Logger instance.
     * @returns {Logger} - A configured Logger instance with a specified id.
     */
    add(id, options) {
      if (!this.loggers.has(id)) {
        // Remark: Simple shallow clone for configuration options in case we pass
        // in instantiated protoypal objects
        options = Object.assign({}, options || this.options)
        const existing = options.transports || this.options.transports

        // Remark: Make sure if we have an array of transports we slice it to
        // make copies of those references.
        if (existing) {
          options.transports = Array.isArray(existing) ? existing.slice() : [existing]
        } else {
          options.transports = []
        }

        const logger = createLogger(options)
        logger.on('close', () => this._delete(id))
        this.loggers.set(id, logger)
      }

      return this.loggers.get(id)
    }

    /**
     * Retreives a `winston.Logger` instance for the specified `id`. If
     * an instance does not exist, one is created.
     * @param {!string} id - The id of the Logger to get.
     * @param {?Object} [options] - Options for the Logger instance.
     * @returns {Logger} - A configured Logger instance with a specified id.
     */
    get(id, options) {
      return this.add(id, options)
    }

    /**
     * Check if the container has a logger with the id.
     * @param {?string} id - The id of the Logger instance to find.
     * @returns {boolean} - Boolean value indicating if this instance has a
     * logger with the specified `id`.
     */
    has(id) {
      return !!this.loggers.has(id)
    }

    /**
     * Closes a `Logger` instance with the specified `id` if it exists.
     * If no `id` is supplied then all Loggers are closed.
     * @param {?string} id - The id of the Logger instance to close.
     * @returns {undefined}
     */
    close(id) {
      if (id) {
        return this._removeLogger(id)
      }

      this.loggers.forEach((val, key) => this._removeLogger(key))
    }

    /**
     * Remove a logger based on the id.
     * @param {!string} id - The id of the logger to remove.
     * @returns {undefined}
     * @private
     */
    _removeLogger(id) {
      if (!this.loggers.has(id)) {
        return
      }

      const logger = this.loggers.get(id)
      logger.close()
      this._delete(id)
    }

    /**
     * Deletes a `Logger` instance with the specified `id`.
     * @param {!string} id - The id of the Logger instance to delete from
     * container.
     * @returns {undefined}
     * @private
     */
    _delete(id) {
      this.loggers.delete(id)
    }
  }
  return container
}

/**
 * winston.js: Top-level include defining Winston.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 */

var hasRequiredWinston

function requireWinston() {
  if (hasRequiredWinston) return winston$1
  hasRequiredWinston = 1
  ;(function (exports) {
    const logform = requireLogform()
    const { warn } = requireCommon()

    /**
     * Expose version. Use `require` method for `webpack` support.
     * @type {string}
     */
    exports.version = require$$2.version
    /**
     * Include transports defined by default by winston
     * @type {Array}
     */
    exports.transports = requireTransports()
    /**
     * Expose utility methods
     * @type {Object}
     */
    exports.config = requireConfig()
    /**
     * Hoist format-related functionality from logform.
     * @type {Object}
     */
    exports.addColors = logform.levels
    /**
     * Hoist format-related functionality from logform.
     * @type {Object}
     */
    exports.format = logform.format
    /**
     * Expose core Logging-related prototypes.
     * @type {function}
     */
    exports.createLogger = requireCreateLogger()
    /**
     * Expose core Logging-related prototypes.
     * @type {function}
     */
    exports.Logger = requireLogger()
    /**
     * Expose core Logging-related prototypes.
     * @type {Object}
     */
    exports.ExceptionHandler = requireExceptionHandler()
    /**
     * Expose core Logging-related prototypes.
     * @type {Object}
     */
    exports.RejectionHandler = requireRejectionHandler()
    /**
     * Expose core Logging-related prototypes.
     * @type {Container}
     */
    exports.Container = requireContainer()
    /**
     * Expose core Logging-related prototypes.
     * @type {Object}
     */
    exports.Transport = requireWinstonTransport()
    /**
     * We create and expose a default `Container` to `winston.loggers` so that the
     * programmer may manage multiple `winston.Logger` instances without any
     * additional overhead.
     * @example
     *   // some-file1.js
     *   const logger = require('winston').loggers.get('something');
     *
     *   // some-file2.js
     *   const logger = require('winston').loggers.get('something');
     */
    exports.loggers = new exports.Container()

    /**
     * We create and expose a 'defaultLogger' so that the programmer may do the
     * following without the need to create an instance of winston.Logger directly:
     * @example
     *   const winston = require('winston');
     *   winston.log('info', 'some message');
     *   winston.error('some error');
     */
    const defaultLogger = exports.createLogger()

    // Pass through the target methods onto `winston.
    Object.keys(exports.config.npm.levels)
      .concat([
        'log',
        'query',
        'stream',
        'add',
        'remove',
        'clear',
        'profile',
        'startTimer',
        'handleExceptions',
        'unhandleExceptions',
        'handleRejections',
        'unhandleRejections',
        'configure',
        'child',
      ])
      .forEach((method) => (exports[method] = (...args) => defaultLogger[method](...args)))

    /**
     * Define getter / setter for the default logger level which need to be exposed
     * by winston.
     * @type {string}
     */
    Object.defineProperty(exports, 'level', {
      get() {
        return defaultLogger.level
      },
      set(val) {
        defaultLogger.level = val
      },
    })

    /**
     * Define getter for `exceptions` which replaces `handleExceptions` and
     * `unhandleExceptions`.
     * @type {Object}
     */
    Object.defineProperty(exports, 'exceptions', {
      get() {
        return defaultLogger.exceptions
      },
    })

    /**
     * Define getter for `rejections` which replaces `handleRejections` and
     * `unhandleRejections`.
     * @type {Object}
     */
    Object.defineProperty(exports, 'rejections', {
      get() {
        return defaultLogger.rejections
      },
    })

    /**
     * Define getters / setters for appropriate properties of the default logger
     * which need to be exposed by winston.
     * @type {Logger}
     */
    ;['exitOnError'].forEach((prop) => {
      Object.defineProperty(exports, prop, {
        get() {
          return defaultLogger[prop]
        },
        set(val) {
          defaultLogger[prop] = val
        },
      })
    })

    /**
     * The default transports and exceptionHandlers for the default winston logger.
     * @type {Object}
     */
    Object.defineProperty(exports, 'default', {
      get() {
        return {
          exceptionHandlers: defaultLogger.exceptionHandlers,
          rejectionHandlers: defaultLogger.rejectionHandlers,
          transports: defaultLogger.transports,
        }
      },
    })

    // Have friendlier breakage notices for properties that were exposed by default
    // on winston < 3.0.
    warn.deprecated(exports, 'setLevels')
    warn.forFunctions(exports, 'useFormat', ['cli'])
    warn.forProperties(exports, 'useFormat', ['padLevels', 'stripColors'])
    warn.forFunctions(exports, 'deprecated', ['addRewriter', 'addFilter', 'clone', 'extend'])
    warn.forProperties(exports, 'deprecated', ['emitErrs', 'levelLength'])
  })(winston$1)
  return winston$1
}

var winstonExports = requireWinston()
var winston = /*@__PURE__*/ getDefaultExportFromCjs(winstonExports)

class Logger {
  logger
  constructor() {
    const colors = {
      error: 'red',
      warn: 'yellow',
      success: 'green',
      info: 'cyan',
      debug: 'magenta',
      clock: 'gray',
    }
    winston.addColors(colors)
    const consoleFormat = winston.format.combine(
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.colorize({ all: true }),
      winston.format.printf(({ level, message }) => {
        const emojiMap = {
          error: '❌',
          warn: '🔔',
          success: '✅',
          debug: '🐛',
          clock: '⏱️ ',
        }
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
      level: 'info',
      transports: [
        new winston.transports.Console({
          format: consoleFormat, // Usa o mesmo formato para todos os níveis
        }),
      ],
    })
  }
  success(message, meta = {}) {
    this.logger.log({ level: 'success', message, meta })
  }
  info(message, meta = {}) {
    this.logger.info(message, meta)
  }
  error(message, error, meta = {}) {
    this.logger.error(message, {
      ...meta,
      errorMessage: error?.message,
      stack: error?.stack,
    })
  }
  debug(message, meta = {}) {
    this.logger.debug(message, meta)
  }
  warn(message, meta = {}) {
    this.logger.warn(message, meta)
  }
  clock(message, meta = {}) {
    this.logger.log({ level: 'clock', message, meta })
  }
  message(message) {
    this.logger.log({ level: 'info', message })
  }
}
const logger = new Logger()

var main = { exports: {} }

var version = '16.4.7'
var require$$4 = {
  version: version,
}

var hasRequiredMain

function requireMain() {
  if (hasRequiredMain) return main.exports
  hasRequiredMain = 1
  const fs = require$$0$6
  const path$1 = path
  const os = require$$0$1
  const crypto = require$$3$1
  const packageJson = require$$4

  const version = packageJson.version

  const LINE =
    /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm

  // Parse src into an Object
  function parse(src) {
    const obj = {}

    // Convert buffer to string
    let lines = src.toString()

    // Convert line breaks to same format
    lines = lines.replace(/\r\n?/gm, '\n')

    let match
    while ((match = LINE.exec(lines)) != null) {
      const key = match[1]

      // Default undefined or null to empty string
      let value = match[2] || ''

      // Remove whitespace
      value = value.trim()

      // Check if double quoted
      const maybeQuote = value[0]

      // Remove surrounding quotes
      value = value.replace(/^(['"`])([\s\S]*)\1$/gm, '$2')

      // Expand newlines if double quoted
      if (maybeQuote === '"') {
        value = value.replace(/\\n/g, '\n')
        value = value.replace(/\\r/g, '\r')
      }

      // Add to object
      obj[key] = value
    }

    return obj
  }

  function _parseVault(options) {
    const vaultPath = _vaultPath(options)

    // Parse .env.vault
    const result = DotenvModule.configDotenv({ path: vaultPath })
    if (!result.parsed) {
      const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`)
      err.code = 'MISSING_DATA'
      throw err
    }

    // handle scenario for comma separated keys - for use with key rotation
    // example: DOTENV_KEY="dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=prod,dotenv://:key_7890@dotenvx.com/vault/.env.vault?environment=prod"
    const keys = _dotenvKey(options).split(',')
    const length = keys.length

    let decrypted
    for (let i = 0; i < length; i++) {
      try {
        // Get full key
        const key = keys[i].trim()

        // Get instructions for decrypt
        const attrs = _instructions(result, key)

        // Decrypt
        decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key)

        break
      } catch (error) {
        // last key
        if (i + 1 >= length) {
          throw error
        }
        // try next key
      }
    }

    // Parse decrypted .env string
    return DotenvModule.parse(decrypted)
  }

  function _log(message) {
    console.log(`[dotenv@${version}][INFO] ${message}`)
  }

  function _warn(message) {
    console.log(`[dotenv@${version}][WARN] ${message}`)
  }

  function _debug(message) {
    console.log(`[dotenv@${version}][DEBUG] ${message}`)
  }

  function _dotenvKey(options) {
    // prioritize developer directly setting options.DOTENV_KEY
    if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
      return options.DOTENV_KEY
    }

    // secondary infra already contains a DOTENV_KEY environment variable
    if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
      return process.env.DOTENV_KEY
    }

    // fallback to empty string
    return ''
  }

  function _instructions(result, dotenvKey) {
    // Parse DOTENV_KEY. Format is a URI
    let uri
    try {
      uri = new URL(dotenvKey)
    } catch (error) {
      if (error.code === 'ERR_INVALID_URL') {
        const err = new Error(
          'INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development',
        )
        err.code = 'INVALID_DOTENV_KEY'
        throw err
      }

      throw error
    }

    // Get decrypt key
    const key = uri.password
    if (!key) {
      const err = new Error('INVALID_DOTENV_KEY: Missing key part')
      err.code = 'INVALID_DOTENV_KEY'
      throw err
    }

    // Get environment
    const environment = uri.searchParams.get('environment')
    if (!environment) {
      const err = new Error('INVALID_DOTENV_KEY: Missing environment part')
      err.code = 'INVALID_DOTENV_KEY'
      throw err
    }

    // Get ciphertext payload
    const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`
    const ciphertext = result.parsed[environmentKey] // DOTENV_VAULT_PRODUCTION
    if (!ciphertext) {
      const err = new Error(
        `NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`,
      )
      err.code = 'NOT_FOUND_DOTENV_ENVIRONMENT'
      throw err
    }

    return { ciphertext, key }
  }

  function _vaultPath(options) {
    let possibleVaultPath = null

    if (options && options.path && options.path.length > 0) {
      if (Array.isArray(options.path)) {
        for (const filepath of options.path) {
          if (fs.existsSync(filepath)) {
            possibleVaultPath = filepath.endsWith('.vault') ? filepath : `${filepath}.vault`
          }
        }
      } else {
        possibleVaultPath = options.path.endsWith('.vault') ? options.path : `${options.path}.vault`
      }
    } else {
      possibleVaultPath = path$1.resolve(process.cwd(), '.env.vault')
    }

    if (fs.existsSync(possibleVaultPath)) {
      return possibleVaultPath
    }

    return null
  }

  function _resolveHome(envPath) {
    return envPath[0] === '~' ? path$1.join(os.homedir(), envPath.slice(1)) : envPath
  }

  function _configVault(options) {
    _log('Loading env from encrypted .env.vault')

    const parsed = DotenvModule._parseVault(options)

    let processEnv = process.env
    if (options && options.processEnv != null) {
      processEnv = options.processEnv
    }

    DotenvModule.populate(processEnv, parsed, options)

    return { parsed }
  }

  function configDotenv(options) {
    const dotenvPath = path$1.resolve(process.cwd(), '.env')
    let encoding = 'utf8'
    const debug = Boolean(options && options.debug)

    if (options && options.encoding) {
      encoding = options.encoding
    } else {
      if (debug) {
        _debug('No encoding is specified. UTF-8 is used by default')
      }
    }

    let optionPaths = [dotenvPath] // default, look for .env
    if (options && options.path) {
      if (!Array.isArray(options.path)) {
        optionPaths = [_resolveHome(options.path)]
      } else {
        optionPaths = [] // reset default
        for (const filepath of options.path) {
          optionPaths.push(_resolveHome(filepath))
        }
      }
    }

    // Build the parsed data in a temporary object (because we need to return it).  Once we have the final
    // parsed data, we will combine it with process.env (or options.processEnv if provided).
    let lastError
    const parsedAll = {}
    for (const path of optionPaths) {
      try {
        // Specifying an encoding returns a string instead of a buffer
        const parsed = DotenvModule.parse(fs.readFileSync(path, { encoding }))

        DotenvModule.populate(parsedAll, parsed, options)
      } catch (e) {
        if (debug) {
          _debug(`Failed to load ${path} ${e.message}`)
        }
        lastError = e
      }
    }

    let processEnv = process.env
    if (options && options.processEnv != null) {
      processEnv = options.processEnv
    }

    DotenvModule.populate(processEnv, parsedAll, options)

    if (lastError) {
      return { parsed: parsedAll, error: lastError }
    } else {
      return { parsed: parsedAll }
    }
  }

  // Populates process.env from .env file
  function config(options) {
    // fallback to original dotenv if DOTENV_KEY is not set
    if (_dotenvKey(options).length === 0) {
      return DotenvModule.configDotenv(options)
    }

    const vaultPath = _vaultPath(options)

    // dotenvKey exists but .env.vault file does not exist
    if (!vaultPath) {
      _warn(
        `You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`,
      )

      return DotenvModule.configDotenv(options)
    }

    return DotenvModule._configVault(options)
  }

  function decrypt(encrypted, keyStr) {
    const key = Buffer.from(keyStr.slice(-64), 'hex')
    let ciphertext = Buffer.from(encrypted, 'base64')

    const nonce = ciphertext.subarray(0, 12)
    const authTag = ciphertext.subarray(-16)
    ciphertext = ciphertext.subarray(12, -16)

    try {
      const aesgcm = crypto.createDecipheriv('aes-256-gcm', key, nonce)
      aesgcm.setAuthTag(authTag)
      return `${aesgcm.update(ciphertext)}${aesgcm.final()}`
    } catch (error) {
      const isRange = error instanceof RangeError
      const invalidKeyLength = error.message === 'Invalid key length'
      const decryptionFailed = error.message === 'Unsupported state or unable to authenticate data'

      if (isRange || invalidKeyLength) {
        const err = new Error('INVALID_DOTENV_KEY: It must be 64 characters long (or more)')
        err.code = 'INVALID_DOTENV_KEY'
        throw err
      } else if (decryptionFailed) {
        const err = new Error('DECRYPTION_FAILED: Please check your DOTENV_KEY')
        err.code = 'DECRYPTION_FAILED'
        throw err
      } else {
        throw error
      }
    }
  }

  // Populate process.env with parsed values
  function populate(processEnv, parsed, options = {}) {
    const debug = Boolean(options && options.debug)
    const override = Boolean(options && options.override)

    if (typeof parsed !== 'object') {
      const err = new Error(
        'OBJECT_REQUIRED: Please check the processEnv argument being passed to populate',
      )
      err.code = 'OBJECT_REQUIRED'
      throw err
    }

    // Set process.env
    for (const key of Object.keys(parsed)) {
      if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
        if (override === true) {
          processEnv[key] = parsed[key]
        }

        if (debug) {
          if (override === true) {
            _debug(`"${key}" is already defined and WAS overwritten`)
          } else {
            _debug(`"${key}" is already defined and was NOT overwritten`)
          }
        }
      } else {
        processEnv[key] = parsed[key]
      }
    }
  }

  const DotenvModule = {
    configDotenv,
    _configVault,
    _parseVault,
    config,
    decrypt,
    parse,
    populate,
  }

  main.exports.configDotenv = DotenvModule.configDotenv
  main.exports._configVault = DotenvModule._configVault
  main.exports._parseVault = DotenvModule._parseVault
  main.exports.config = DotenvModule.config
  main.exports.decrypt = DotenvModule.decrypt
  main.exports.parse = DotenvModule.parse
  main.exports.populate = DotenvModule.populate

  main.exports = DotenvModule
  return main.exports
}

var mainExports = requireMain()

class HuskyUtil {
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
    await this.appendFiles(this.mapping, tool, 'commit-msg')
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

class CopyFiles {
  src
  dest
  fileMapping
  constructor(src, dest, fileMapping) {
    this.src = src
    this.dest = dest
    this.fileMapping = fileMapping
  }
  async copyFilesFromTemplate(tool) {
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

class PackageJsonReader {
  packageJson
  toolMappings
  src
  dest
  constructor(packageJson, toolMappings, src, dest) {
    this.packageJson = packageJson
    this.toolMappings = toolMappings
    this.src = src
    this.dest = dest
  }
  async setupTool(tool) {
    const mapping = this.toolMappings[tool]
    if (!mapping) {
      return undefined
    }
    const srcPackageJsonPath = path.join(this.src, 'package.json')
    const destPackageJsonPath = path.join(this.dest, 'package.json')
    if (!fs.existsSync(destPackageJsonPath)) {
      await fs.copyFile(srcPackageJsonPath, destPackageJsonPath)
    }
    const destPackageJson = await fs.readJson(destPackageJsonPath)
    const dependencies = this.getDependencies(mapping.dependencies)
    destPackageJson.devDependencies = {
      ...destPackageJson.devDependencies,
      ...dependencies,
    }
    const scripts = this.getScripts(mapping.scripts)
    destPackageJson.scripts = {
      ...destPackageJson.scripts,
      ...scripts,
    }
    if (tool === 'lint-staged') {
      destPackageJson['lint-staged'] = mapping['lint-staged']
    }
    await fs.writeJson(destPackageJsonPath, destPackageJson, { spaces: 2 })
    logger.success(`"${tool}" atualizada no package.json`)
  }
  getDependencies(deps) {
    return deps.reduce((acc, dep) => {
      if (this.packageJson.devDependencies[dep]) {
        acc[dep] = this.packageJson.devDependencies[dep]
      }
      return acc
    }, {})
  }
  /**
   * Retorna os scripts da ferramenta com base nos nomes fornecidos.
   */
  getScripts(scripts) {
    return scripts.reduce((acc, script) => {
      if (this.packageJson.scripts[script]) {
        acc[script] = this.packageJson.scripts[script]
      }
      return acc
    }, {})
  }
}

const tick = performance.now()
mainExports.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const isDev = 'production' != 'production'
logger.debug(String('production'))
logger.debug(String(isDev))
const templatesPath = path.join(__dirname, '..', 'templates')
const distDev = path.join(process.cwd(), '')
// Caminho para os templates
// Lê os arquivos JSON
const packageJson = await fs.readJson(path.resolve(__dirname, 'data/packageAttributes.json'))
const toolMappings = await fs.readJson(path.resolve(__dirname, 'data/toolMappings.json'))
const fileMapping = await fs.readJson(path.resolve(__dirname, 'data/fileMapping.json'))
const toolList = await fs.readJson(path.resolve(__dirname, 'data/toolList.json'))
const huskyMapping = await fs.readJson(path.resolve(__dirname, 'data/huskyMapping.json'))
// Instancia as utilitárias
const copyFilesUtil = new CopyFiles(templatesPath, distDev, fileMapping)
const copyHuskyFiles = new HuskyUtil(templatesPath, distDev, huskyMapping)
const packageJsonReaderUtil = new PackageJsonReader(
  packageJson,
  toolMappings,
  templatesPath,
  distDev,
)
const argTools = process.argv.slice(2)
const tools = validateTools(argTools, toolList)
for (const tool of tools) {
  try {
    logger.message(`\n🛠️  Configurando a ferramenta "${tool}"...`)
    await copyFilesUtil.copyFilesFromTemplate(tool)
    await copyHuskyFiles.copyHuskyFiles(tool)
    await packageJsonReaderUtil.setupTool(tool)
    logger.success(`"${tool}" configurada com sucesso!`)
  } catch (err) {
    logger.error(`Erro ao processar a ferramenta "${tool}":`, err.message)
    throw err
  }
}
const tack = performance.now()
logger.clock(`${(tack - tick).toFixed(2)} ms`)
function validateTools(argTools, toolList) {
  if (argTools.length === 0) {
    return toolList
  } else {
    argTools.forEach((tool) => {
      if (!toolList.some((t) => tool === t)) {
        const err = new Error(`ferramenta ${tool} não existe na lista`)
        logger.error(`Error: ${err.message}`, err)
        throw err
      }
    })
    return argTools
  }
}

export { validateTools }
