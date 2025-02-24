export default {
  branches: [
    { name: 'main', channel: 'latest' }, // Versões estáveis para o branch main
    { name: 'beta', channel: 'beta' }, // Versões beta para o branch beta
    { name: 'develop', prerelease: 'next' }, // Versões next para o branch develop
  ],
  plugins: [
    '@semantic-release/commit-analyzer', // Analisa os commits para determinar o tipo de release
    '@semantic-release/release-notes-generator', // Gera notas de release
    '@semantic-release/npm', // Publica no npm
    '@semantic-release/github', // Cria releases no GitHub
    [
      '@semantic-release/git', // Faz commit automático das mudanças no repositório
      {
        assets: ['package.json'], // Arquivos que serão incluídos no commit
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}', // Mensagem do commit
      },
    ],
  ],
}
