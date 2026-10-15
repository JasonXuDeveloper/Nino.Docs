import type { HeadConfig } from 'vitepress'

export const head: HeadConfig[] = [
  ['meta', { name: 'theme-color', content: 'var(--vp-c-brand-1)' }],
  ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
  ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: 'any' }],
  ['link', { rel: 'icon', type: 'image/png', href: '/favicon-32.png', sizes: '32x32' }],
  ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png', sizes: '512x512' }],
  ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
  ['meta', { name: 'msapplication-TileImage', content: '/favicon.png' }],
  ['meta', { name: 'msapplication-TileColor', content: '#1c1a4f' }],
]
