export interface HuskyMapping {
  [key: string]: {
    files: string[]
    gitignore?: { filePath: string; content: string[] }
    commitmsg?: { filePath: string; content: string[] }
    precommit?: { filePath: string; content: string[] }
  }
}
