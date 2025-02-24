interface ToolMapping {
  dependencies: string[]
  scripts: string[]
  lintStaged?: Record<string, string[]>
}

interface PackageJson {
  devDependencies: Record<string, string>
  scripts: Record<string, string>
  lintStaged?: Record<string, string[]>
}

type ToolMappings = Record<string, ToolMapping>

export { ToolMapping, PackageJson, ToolMappings }
