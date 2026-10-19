import type { SourceImage } from './types'

export const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/avif']
export const ACCEPT_ATTR = '.png,.jpg,.jpeg,.svg,.webp,.gif,.ico,.avif,image/*'

function readAs(file: File, kind: 'dataUrl' | 'text'): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(r.error ?? new Error('Could not read file'))
    if (kind === 'dataUrl') r.readAsDataURL(file)
    else r.readAsText(file)
  })
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('This file could not be decoded as an image'))
    img.src = url
  })
}

function isSvg(file: File): boolean {
  return file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')
}

/** Load a user file into something we can draw on a canvas. Never leaves the browser. */
export async function loadSourceImage(file: File): Promise<SourceImage> {
  const svg = isSvg(file)
  if (!svg && file.type && !file.type.startsWith('image/')) {
    throw new Error(`Unsupported file type: ${file.type}`)
  }
  let svgText: string | undefined
  let url: string
  if (svg) {
    svgText = normalizeSvg(await readAs(file, 'text'))
    url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText)
  } else {
    url = await readAs(file, 'dataUrl')
  }
  const img = await loadImage(url)
  let width = img.naturalWidth
  let height = img.naturalHeight
  if (svg && (!width || !height)) {
    // SVG without intrinsic size: derive aspect ratio from viewBox if possible.
    const vb = /viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(svgText ?? '')
    const vw = vb ? parseFloat(vb[1]) : 1
    const vh = vb ? parseFloat(vb[2]) : 1
    width = 512
    height = Math.round((512 * vh) / vw) || 512
  }
  return { img, name: file.name, type: svg ? 'image/svg+xml' : file.type, url, width, height, svgText }
}

/**
 * Browsers give SVGs without width/height a default 300x150 intrinsic size,
 * which distorts the aspect ratio. Give the root explicit dimensions from its
 * viewBox (or a 512px square) so it renders and crops correctly.
 */
export function normalizeSvg(text: string): string {
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml')
  const root = doc.documentElement
  if (!root || root.nodeName.toLowerCase() !== 'svg' || doc.getElementsByTagName('parsererror').length) {
    throw new Error('This SVG could not be parsed')
  }
  const num = (v: string | null) => {
    if (!v || v.trim().endsWith('%')) return NaN
    return parseFloat(v)
  }
  const w = num(root.getAttribute('width'))
  const h = num(root.getAttribute('height'))
  const vb = (root.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number)
  const hasVb = vb.length === 4 && vb[2] > 0 && vb[3] > 0
  if (w > 0 && h > 0) {
    if (!hasVb) root.setAttribute('viewBox', `0 0 ${w} ${h}`)
    return new XMLSerializer().serializeToString(root)
  }
  const aspect = hasVb ? vb[3] / vb[2] : 1
  if (!hasVb) root.setAttribute('viewBox', '0 0 512 512')
  root.setAttribute('width', '512')
  root.setAttribute('height', String(Math.round(512 * aspect)))
  return new XMLSerializer().serializeToString(root)
}
