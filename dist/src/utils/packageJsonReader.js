import path from 'path'
import { logger } from '../../logger.js'
import fs from 'fs-extra'
export class PackageJsonReader {
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
    await fs.copy(srcPackageJsonPath, destPackageJsonPath)
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
    if (mapping.config) {
      destPackageJson.lintStaged = mapping.config
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
