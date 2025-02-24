export default {
  branches: [
    { name: 'main', channel: 'latest' },
    { name: 'beta', prerelease: 'beta', channel: 'beta' },
    {
      name: 'develop',
      prerelease: 'next',
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
      },
    ],
  ],
}
