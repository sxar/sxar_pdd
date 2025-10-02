/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@atlaskit/pragmatic-drag-and-drop',
    '@atlaskit/pragmatic-drag-and-drop-hitbox',
    '@atlaskit/pragmatic-drag-and-drop-flourish',
    '@atlaskit/pragmatic-drag-and-drop-live-region',
    '@atlaskit/pragmatic-drag-and-drop-react-accessibility',
    '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator',
    '@atlaskit/pragmatic-drag-and-drop-auto-scroll'
  ]
}

module.exports = nextConfig
