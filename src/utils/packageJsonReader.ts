import path from 'path'

import fs from 'fs-extra'

import { PackageJson, ToolMappings } from '../interfaces/package.interface.js'

export class PackageJsonReader {
  private packageJson: PackageJson
  private toolMappings: ToolMappings
  private src: string
  private dest: string

  constructor(packageJson: PackageJson, toolMappings: ToolMappings, src: string, dest: string) {
    this.packageJson = packageJson
    this.toolMappings = toolMappings
    this.src = src
    this.dest = dest
  }

  /**
   * Copia o package.json do diretório de origem para o destino
   * e insere as dependências e scripts da ferramenta especificada.
   */
  async setupTool(tool: string) {
    // Verifica se a ferramenta existe no mapeamento
    const mapping = this.toolMappings[tool]
    if (!mapping) {
      throw new Error(`Ferramenta "${tool}" não encontrada no mapeamento.`)
    }

    // Caminho completo para o arquivo package.json de origem e destino
    const srcPackageJsonPath = path.join(this.src, 'package.json')
    const destPackageJsonPath = path.join(this.dest, 'package.json')

    // Copia o package.json para o diretório de destino
    await fs.copy(srcPackageJsonPath, destPackageJsonPath)

    // Lê o package.json copiado
    const destPackageJson: PackageJson = await fs.readJson(destPackageJsonPath)

    // Adiciona as dependências da ferramenta ao package.json de destino
    const dependencies = this.getDependencies(mapping.dependencies)
    destPackageJson.devDependencies = {
      ...destPackageJson.devDependencies,
      ...dependencies,
    }

    // Adiciona os scripts da ferramenta ao package.json de destino
    const scripts = this.getScripts(mapping.scripts)
    destPackageJson.scripts = {
      ...destPackageJson.scripts,
      ...scripts,
    }

    // Adiciona a configuração da ferramenta, se existir
    if (mapping.config) {
      destPackageJson.lintStaged = mapping.config
    }

    // Salva o package.json atualizado
    await fs.writeJson(destPackageJsonPath, destPackageJson, { spaces: 2 })

    console.log(`✅ Ferramenta "${tool}" configurada com sucesso em ${destPackageJsonPath}.`)
  }

  /**
   * Retorna as dependências da ferramenta com base nos nomes fornecidos.
   */
  private getDependencies(deps: string[]): Record<string, string> {
    return deps.reduce(
      (acc, dep) => {
        if (this.packageJson.devDependencies[dep]) {
          acc[dep] = this.packageJson.devDependencies[dep]
        }
        return acc
      },
      {} as Record<string, string>,
    )
  }

  /**
   * Retorna os scripts da ferramenta com base nos nomes fornecidos.
   */
  private getScripts(scripts: string[]): Record<string, string> {
    return scripts.reduce(
      (acc, script) => {
        if (this.packageJson.scripts[script]) {
          acc[script] = this.packageJson.scripts[script]
        }
        return acc
      },
      {} as Record<string, string>,
    )
  }
}
