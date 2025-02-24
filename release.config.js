export default {
  branches: [
    { name: 'main', channel: 'latest' }, // Versões estáveis para o branch main
    { name: 'beta', channel: 'beta' }, // Versões beta para o branch beta
    { name: 'develop', prerelease: 'next' }, // Versões next para o branch develop
  ],
}
