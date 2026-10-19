import JSZip from 'jszip'
import { encodeIco } from './ico'
import { getLayout, imageRect, measureText, pickSource, renderPng, type RenderSources } from './render'
import { ICO_SIZES, PNG_OUTPUTS, type Settings } from './types'

export interface OutputFile {
  name: string
  blob: Blob
  description: string
}

const SVG_SIZE = 512

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function joinPath(prefix: string, file: string): string {
  const p = prefix.trim() || '/'
  return p.endsWith('/') ? p + file : `${p}/${file}`
}

/** SVG output is only possible when we can stay vector: text mode or an SVG source. */
export function canExportSvg(s: Settings, src: RenderSources): boolean {
  if (s.mode === 'text') return Boolean(s.text)
  const source = pickSource(SVG_SIZE, s, src)
  return Boolean(source?.svgText)
}

function shapeElement(s: Settings, attrs: string): string {
  const { size, radiusPx } = getLayout(SVG_SIZE, s)
  if (s.shape === 'circle') return `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" ${attrs}/>`
  const rx = radiusPx > 0 ? ` rx="${round(radiusPx)}"` : ''
  return `<rect width="${size}" height="${size}"${rx} ${attrs}/>`
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

/** Turn the user's SVG into a nested <svg> placed at the crop rectangle. */
function nestedSvg(svgText: string, rect: { x: number; y: number; w: number; h: number }, fallbackSize: { width: number; height: number }): string | null {
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml')
  const root = doc.documentElement
  if (!root || root.nodeName.toLowerCase() !== 'svg' || doc.getElementsByTagName('parsererror').length) return null
  if (!root.getAttribute('viewBox')) {
    const w = parseFloat(root.getAttribute('width') || '') || fallbackSize.width
    const h = parseFloat(root.getAttribute('height') || '') || fallbackSize.height
    if (!w || !h) return null
    root.setAttribute('viewBox', `0 0 ${w} ${h}`)
  }
  root.setAttribute('x', String(round(rect.x)))
  root.setAttribute('y', String(round(rect.y)))
  root.setAttribute('width', String(round(rect.w)))
  root.setAttribute('height', String(round(rect.h)))
  root.setAttribute('preserveAspectRatio', 'none')
  return new XMLSerializer().serializeToString(root)
}

export function buildSvg(s: Settings, src: RenderSources): string | null {
  if (!canExportSvg(s, src)) return null
  const { size, pad, inner } = getLayout(SVG_SIZE, s)
  const parts: string[] = []
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
  )
  parts.push(`<defs><clipPath id="fs-shape">${shapeElement(s, '')}</clipPath>`)
  parts.push(`<clipPath id="fs-inner"><rect x="${round(pad)}" y="${round(pad)}" width="${round(inner)}" height="${round(inner)}"/></clipPath></defs>`)
  parts.push(`<g clip-path="url(#fs-shape)">`)
  if (s.background === 'color' || s.background === 'image') {
    parts.push(shapeElement(s, `fill="${escapeXml(s.bgColor)}"`))
  }
  if (s.background === 'image' && src.background) {
    parts.push(
      `<image href="${escapeXml(src.background.url)}" x="0" y="0" width="${size}" height="${size}" preserveAspectRatio="xMidYMid slice"/>`,
    )
  }

  if (s.mode === 'text') {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const m = measureText(ctx, size, s)
    parts.push(
      `<text x="${size / 2}" y="${round(m.baselineY)}" text-anchor="middle" font-family="${escapeXml(s.font)}" font-weight="${s.fontWeight}" font-size="${round(m.fontSize)}" fill="${escapeXml(s.textColor)}">${escapeXml(s.text)}</text>`,
    )
  } else {
    const source = pickSource(SVG_SIZE, s, src)
    if (!source?.svgText) return null
    const rect = imageRect(size, s, source)
    const nested = nestedSvg(source.svgText, rect, source)
    const content =
      nested ??
      `<image href="${source.url}" x="${round(rect.x)}" y="${round(rect.y)}" width="${round(rect.w)}" height="${round(rect.h)}" preserveAspectRatio="none"/>`
    parts.push(`<g clip-path="url(#fs-inner)">${content}</g>`)
  }
  parts.push('</g></svg>')
  return parts.join('')
}

export function buildManifest(s: Settings): string {
  const manifest = {
    name: s.appName,
    short_name: s.shortName || s.appName,
    icons: [
      { src: joinPath(s.pathPrefix, 'android-chrome-192x192.png'), sizes: '192x192', type: 'image/png' },
      { src: joinPath(s.pathPrefix, 'android-chrome-512x512.png'), sizes: '512x512', type: 'image/png' },
    ],
    theme_color: s.themeColor,
    background_color: s.background === 'transparent' ? '#ffffff' : s.bgColor,
    display: 'standalone',
  }
  return JSON.stringify(manifest, null, 2) + '\n'
}

export function buildHtmlSnippet(s: Settings, hasSvg: boolean): string {
  const p = (f: string) => joinPath(s.pathPrefix, f)
  const lines = [
    `<link rel="icon" href="${p('favicon.ico')}" sizes="16x16 32x32 48x48">`,
    ...(hasSvg ? [`<link rel="icon" href="${p('favicon.svg')}" type="image/svg+xml">`] : []),
    `<link rel="icon" type="image/png" sizes="32x32" href="${p('favicon-32x32.png')}">`,
    `<link rel="icon" type="image/png" sizes="16x16" href="${p('favicon-16x16.png')}">`,
    `<link rel="icon" type="image/png" sizes="96x96" href="${p('favicon-96x96.png')}">`,
    `<link rel="apple-touch-icon" sizes="180x180" href="${p('apple-touch-icon.png')}">`,
    `<link rel="manifest" href="${p('site.webmanifest')}">`,
    `<meta name="theme-color" content="${escapeXml(s.themeColor)}">`,
  ]
  return lines.join('\n')
}

export async function buildIco(s: Settings, src: RenderSources): Promise<Blob> {
  const images = await Promise.all(
    ICO_SIZES.map(async (size) => {
      const blob = await renderPng(size, s, src)
      return { width: size, height: size, data: new Uint8Array(await blob.arrayBuffer()) }
    }),
  )
  const bytes = encodeIco(images)
  return new Blob([bytes as BlobPart], { type: 'image/x-icon' })
}

/** Render every output file. */
export async function buildAllFiles(s: Settings, src: RenderSources): Promise<OutputFile[]> {
  const files: OutputFile[] = []
  files.push({ name: 'favicon.ico', blob: await buildIco(s, src), description: 'Multi-size ICO (16, 32, 48)' })

  const svg = buildSvg(s, src)
  if (svg) files.push({ name: 'favicon.svg', blob: new Blob([svg], { type: 'image/svg+xml' }), description: 'Scalable vector favicon' })

  for (const out of PNG_OUTPUTS) {
    const isApple = out.file === 'apple-touch-icon.png'
    const opts =
      isApple && s.appleSolidBg && s.background !== 'color' ? { forceBackground: s.appleBgColor } : undefined
    files.push({ name: out.file, blob: await renderPng(out.size, s, src, opts), description: `${out.size}x${out.size} · ${out.label}` })
  }

  files.push({ name: 'site.webmanifest', blob: new Blob([buildManifest(s)], { type: 'application/manifest+json' }), description: 'PWA manifest' })
  files.push({
    name: 'favicon-snippet.html',
    blob: new Blob([buildHtmlSnippet(s, Boolean(svg)) + '\n'], { type: 'text/html' }),
    description: 'Paste into your <head>',
  })
  return files
}

export async function buildZip(files: OutputFile[]): Promise<Blob> {
  const zip = new JSZip()
  for (const f of files) zip.file(f.name, f.blob)
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
}

export function downloadBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
