export default {
  branches: [
    { name: 'main', channel: 'latest' }, // Versões estáveis para o branch main
    { name: 'beta', channel: 'beta' }, // Versões beta para o branch beta
    { name: 'develop', prerelease: 'next' }, // Versões next para o branch develop
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: '.', // Diretório raiz do pacote
        tarballDir: 'dist', // Diretório onde o pacote será empacotado
        tag: `next-${process.env.TIMESTAMP_VERSION || 'unknown'}`, // Inclui o timestamp na tag
      },
    ],
  ],
}
