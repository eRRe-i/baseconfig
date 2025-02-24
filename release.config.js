export default {
  branches: [
    { name: 'main', channel: 'latest' }, // Versões estáveis para o branch main
    { name: 'beta', channel: 'beta' }, // Versões beta para o branch beta
    {
      name: 'develop',
      prerelease: '',
      channel: 'next',
    },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          { type: 'chore', release: 'patch' },
          { type: 'build', release: 'patch' },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        tag: 'next-${process.env.TIMESTAMP}', // Inclui o timestamp na tag do npm
      },
    ],
  ],
  tagFormat: 'v${version}-${process.env.TIMESTAMP}',
}
