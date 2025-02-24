import { validateTools } from '../src/cli.js'

describe('validateTools', () => {
  const toolList = ['eslint', 'typescript', 'prettier']

  it('deve retornar a lista completa de ferramentas se nenhum argumento for passado', () => {
    const tools = validateTools([], toolList)
    expect(tools).toEqual(toolList)
  })

  it('deve retornar as ferramentas válidas passadas como argumento', () => {
    const tools = validateTools(['eslint', 'typescript'], toolList)
    expect(tools).toEqual(toolList)
  })

  it('deve lançar um erro se uma ferramenta inválida for passada', () => {
    expect(() => validateTools(['eslint', 'invalid-tool'], toolList)).toThrow(
      'ferramenta invalid-tool não existe na lista',
    )
  })
})
