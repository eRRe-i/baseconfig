export default {
  branches: [
    { name: 'main', channel: 'latest' },
    { name: 'beta', channel: 'beta' },
    {
      name: 'develop',
      prerelease: 'next',
      channel: 'next',
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        tarballDir: 'dist',
        tag: 'next-${process.env.TIMESTAMP}', // Inclui o timestamp na tag do npm
      },
    ],
    '@semantic-release/github',
  ],
  tagFormat: 'v${version}-next.${process.env.TIMESTAMP}', // Formato da tag no Git
}
