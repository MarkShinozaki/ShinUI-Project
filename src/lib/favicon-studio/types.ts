export type Mode = 'image' | 'text'
export type Shape = 'square' | 'rounded' | 'circle'
export type Fit = 'cover' | 'contain'

export interface SourceImage {
  /** Loaded image element ready to draw. */
  img: HTMLImageElement
  /** Original file name. */
  name: string
  /** MIME type (image/png, image/svg+xml, ...). */
  type: string
  /** Data URL for thumbnails. */
  url: string
  /** Natural size (SVGs without intrinsic size fall back to 512). */
  width: number
  height: number
  /** Raw SVG markup when the source is an SVG. */
  svgText?: string
}

export interface Settings {
  mode: Mode
  // Image crop
  fit: Fit
  zoom: number // 1 - 4
  offsetX: number // -1 .. 1
  offsetY: number // -1 .. 1
  // Text
  text: string
  font: string
  fontWeight: number
  textColor: string
  textScale: number // 0.3 - 1.2
  // Common
  padding: number // 0 - 40 (% of icon size, per side)
  background: 'transparent' | 'color'
  bgColor: string
  shape: Shape
  radius: number // 0 - 50 (% of icon size)
  useSmallImage: boolean
  // Output
  appName: string
  shortName: string
  themeColor: string
  appleSolidBg: boolean
  appleBgColor: string
  pathPrefix: string
}

export interface FontOption {
  label: string
  stack: string
}

export const FONTS: FontOption[] = [
  { label: 'Sans', stack: 'Inter, "Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif' },
  { label: 'Rounded', stack: 'ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Nunito", system-ui, sans-serif' },
  { label: 'Serif', stack: 'Georgia, "Times New Roman", Cambria, serif' },
  { label: 'Mono', stack: 'ui-monospace, "Cascadia Code", Consolas, "SF Mono", Menlo, monospace' },
  { label: 'Display', stack: 'Impact, "Arial Black", "Helvetica Neue", sans-serif' },
  { label: 'Hand', stack: '"Segoe Print", "Comic Sans MS", "Bradley Hand", cursive' },
]

export const DEFAULT_SETTINGS: Settings = {
  mode: 'text',
  fit: 'cover',
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  text: 'F',
  font: FONTS[0].stack,
  fontWeight: 800,
  textColor: '#ffffff',
  textScale: 0.75,
  padding: 0,
  background: 'color',
  bgColor: '#7c3aed',
  shape: 'rounded',
  radius: 22,
  useSmallImage: true,
  appName: 'My Website',
  shortName: 'Website',
  themeColor: '#7c3aed',
  appleSolidBg: true,
  appleBgColor: '#ffffff',
  pathPrefix: '/',
}

/** Every PNG size we export, with its output file name. */
export const PNG_OUTPUTS: { size: number; file: string; label: string }[] = [
  { size: 16, file: 'favicon-16x16.png', label: 'Browser tab' },
  { size: 32, file: 'favicon-32x32.png', label: 'Tab (retina) / taskbar' },
  { size: 48, file: 'favicon-48x48.png', label: 'Windows site icon' },
  { size: 64, file: 'favicon-64x64.png', label: 'Windows high-DPI' },
  { size: 96, file: 'favicon-96x96.png', label: 'Google TV / desktop' },
  { size: 128, file: 'favicon-128x128.png', label: 'Chrome Web Store' },
  { size: 180, file: 'apple-touch-icon.png', label: 'iOS home screen' },
  { size: 192, file: 'android-chrome-192x192.png', label: 'Android home screen' },
  { size: 512, file: 'android-chrome-512x512.png', label: 'PWA splash / install' },
]

export const ICO_SIZES = [16, 32, 48]
/** Sizes at or below this use the optional "small sizes" image. */
export const SMALL_SIZE_MAX = 48
