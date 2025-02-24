const branch = process.env.GITHUB_REF_NAME || 'unknown'
const tagFormat = branch === 'develop' ? 'v${version}-next.${process.env.TIMESTAMP}' : 'v${version}'
export default {
  branches: [
    { name: 'main', channel: 'latest' }, // Versões estáveis para o branch main
    { name: 'beta', channel: 'beta' }, // Versões beta para o branch beta
    {
      name: 'develop',
      channel: 'next',
    },
  ],
  tagFormat,
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
        tag: 'next.${process.env.TIMESTAMP}',
      },
    ],
  ],
}
