import path from 'path'
import { logger } from '../../logger.js'
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

  async setupTool(tool: string) {
    const mapping = this.toolMappings[tool]
    if (!mapping) {
      return undefined
    }

    const srcPackageJsonPath = path.join(this.src, 'package.json')
    const destPackageJsonPath = path.join(this.dest, 'package.json')

    if (!fs.existsSync(destPackageJsonPath)) {
      fs.copyFile(srcPackageJsonPath, destPackageJsonPath)
    }

    const destPackageJson: PackageJson = await fs.readJson(destPackageJsonPath)

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

    if (mapping.config) {
      destPackageJson.lintStaged = mapping.config
    }

    await fs.writeJson(destPackageJsonPath, destPackageJson, { spaces: 2 })

    logger.success(`"${tool}" atualizada no package.json`)
  }

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
