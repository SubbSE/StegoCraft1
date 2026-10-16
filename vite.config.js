import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'

const SITE_URL = 'https://stegocraft.netlify.app'

/** Writes sitemap.xml at build time, listing every lesson and challenge from the content indexes. */
function sitemap() {
  const read = (file) => readFileSync(fileURLToPath(new URL(file, import.meta.url)), 'utf8')
  const lessons = [...read('./src/content/lessons/index.js').matchAll(/slug: '([\w-]+)'/g)].map((m) => `/learn/${m[1]}`)
  const challenges = [...read('./src/content/challenges/index.js').matchAll(/import\('\.\/([\w-]+)\.jsx'\)/g)].map((m) => `/challenges/${m[1]}`)
  const paths = [
    '/',
    '/learn',
    ...lessons,
    '/lab/image',
    '/lab/audio',
    '/lab/text',
    '/detect/image',
    '/detect/audio',
    '/detect/text',
    '/challenges',
    ...challenges,
    '/history',
    '/about',
  ]
  return {
    name: 'stegocraft-sitemap',
    apply: 'build',
    generateBundle() {
      const urls = paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
      const source = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>', '']
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: source.join('\n') })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sitemap()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    sourcemap: false,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
})
