import type { Settings, SourceImage } from './types'
import { SMALL_SIZE_MAX } from './types'

export interface RenderSources {
  main: SourceImage | null
  small: SourceImage | null
  /** Optional background image (cover-fit behind the source). */
  background: SourceImage | null
}

export interface RenderOptions {
  /** Force an opaque background (used for apple-touch-icon). */
  forceBackground?: string
}

/** Geometry shared by the canvas renderer and the SVG exporter. */
export interface Layout {
  size: number
  pad: number
  inner: number
  radiusPx: number
}

export function getLayout(size: number, s: Settings): Layout {
  const pad = (s.padding / 100) * size
  const inner = Math.max(1, size - pad * 2)
  const radiusPx =
    s.shape === 'circle' ? size / 2 : s.shape === 'rounded' ? (s.radius / 100) * size : 0
  return { size, pad, inner, radiusPx }
}

/** Pick which source image to use for a given output size. */
export function pickSource(size: number, s: Settings, src: RenderSources): SourceImage | null {
  if (s.useSmallImage && src.small && size <= SMALL_SIZE_MAX) return src.small
  return src.main
}

/** Rectangle (in output pixels) where the image is drawn. */
export function imageRect(
  size: number,
  s: Settings,
  source: { width: number; height: number },
): { x: number; y: number; w: number; h: number } {
  const { pad, inner } = getLayout(size, s)
  const w0 = source.width || 512
  const h0 = source.height || 512
  const base = s.fit === 'cover' ? inner / Math.min(w0, h0) : inner / Math.max(w0, h0)
  const scale = base * s.zoom
  const w = w0 * scale
  const h = h0 * scale
  // Excess beyond the inner square; offsets pan within it (-1 .. 1).
  const ex = w - inner
  const ey = h - inner
  const x = pad - (ex / 2) * (1 + s.offsetX)
  const y = pad - (ey / 2) * (1 + s.offsetY)
  return { x, y, w, h }
}

function shapePath(ctx: CanvasRenderingContext2D, size: number, radius: number) {
  ctx.beginPath()
  if (radius >= size / 2 - 0.01) {
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  } else if (radius > 0) {
    ctx.roundRect(0, 0, size, size, radius)
  } else {
    ctx.rect(0, 0, size, size)
  }
  ctx.closePath()
}

export interface TextMetricsResult {
  fontSize: number
  baselineY: number
  font: string
}

/** Compute font size and baseline so text is visually centered inside the padded area. */
export function measureText(
  ctx: CanvasRenderingContext2D,
  size: number,
  s: Settings,
): TextMetricsResult {
  const { pad, inner } = getLayout(size, s)
  const text = s.text || ' '
  let fontSize = inner * s.textScale
  const fontFor = (px: number) => `${s.fontWeight} ${px}px ${s.font}`
  ctx.font = fontFor(fontSize)
  let m = ctx.measureText(text)
  const maxW = inner * 0.94
  if (m.width > maxW) {
    fontSize = (fontSize * maxW) / m.width
    ctx.font = fontFor(fontSize)
    m = ctx.measureText(text)
  }
  const ascent = m.actualBoundingBoxAscent || fontSize * 0.72
  const descent = m.actualBoundingBoxDescent || 0
  const baselineY = pad + inner / 2 + (ascent - descent) / 2
  return { fontSize, baselineY, font: fontFor(fontSize) }
}

/** Draw the icon into a square canvas of `size` px. */
export function renderIcon(
  canvas: HTMLCanvasElement,
  size: number,
  s: Settings,
  src: RenderSources,
  opts: RenderOptions = {},
): void {
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D not supported')
  ctx.clearRect(0, 0, size, size)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const { pad, inner, radiusPx } = getLayout(size, s)

  ctx.save()
  shapePath(ctx, size, radiusPx)
  ctx.clip()

  const underlay =
    opts.forceBackground ?? (s.background === 'color' || s.background === 'image' ? s.bgColor : null)
  if (underlay) {
    ctx.fillStyle = underlay
    ctx.fillRect(0, 0, size, size)
  }

  if (s.background === 'image' && src.background) {
    drawCover(ctx, src.background, size)
  }

  if (s.mode === 'image') {
    const source = pickSource(size, s, src)
    if (source) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(pad, pad, inner, inner)
      ctx.clip()
      const r = imageRect(size, s, source)
      // Downscale in steps for large -> tiny reductions to avoid aliasing.
      const drawable = stepDown(source.img, source.width, source.height, r.w, r.h)
      ctx.drawImage(drawable, r.x, r.y, r.w, r.h)
      ctx.restore()
    }
  } else {
    const { baselineY, font } = measureText(ctx, size, s)
    ctx.font = font
    ctx.fillStyle = s.textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(s.text || '', size / 2, baselineY)
  }

  ctx.restore()
}

/** Draw an image covering the full size (object-fit: cover), centered. */
function drawCover(ctx: CanvasRenderingContext2D, source: SourceImage, size: number) {
  const w0 = source.width || 512
  const h0 = source.height || 512
  const scale = size / Math.min(w0, h0)
  const w = w0 * scale
  const h = h0 * scale
  const x = (size - w) / 2
  const y = (size - h) / 2
  const drawable = stepDown(source.img, w0, h0, w, h)
  ctx.drawImage(drawable, x, y, w, h)
}

/**
 * Halve the image repeatedly until it's within 2x of the target size.
 * Gives noticeably sharper 16/32 px results than a single drawImage.
 */
function stepDown(
  img: HTMLImageElement,
  w: number,
  h: number,
  targetW: number,
  targetH: number,
): CanvasImageSource {
  if (!w || !h || w <= targetW * 2 || h <= targetH * 2) return img
  let cw = w
  let ch = h
  let current: CanvasImageSource = img
  while (cw / 2 >= targetW && ch / 2 >= targetH) {
    const nw = Math.max(1, Math.round(cw / 2))
    const nh = Math.max(1, Math.round(ch / 2))
    const c = document.createElement('canvas')
    c.width = nw
    c.height = nh
    const cx = c.getContext('2d')
    if (!cx) return img
    cx.imageSmoothingQuality = 'high'
    cx.drawImage(current, 0, 0, nw, nh)
    current = c
    cw = nw
    ch = nh
  }
  return current
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas export failed'))), type)
  })
}

export async function renderPng(
  size: number,
  s: Settings,
  src: RenderSources,
  opts?: RenderOptions,
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  renderIcon(canvas, size, s, src, opts)
  return canvasToBlob(canvas)
}

export function renderDataUrl(
  size: number,
  s: Settings,
  src: RenderSources,
  opts?: RenderOptions,
): string {
  const canvas = document.createElement('canvas')
  renderIcon(canvas, size, s, src, opts)
  return canvas.toDataURL('image/png')
}
