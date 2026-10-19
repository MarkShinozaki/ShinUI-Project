/**
 * Minimal ICO encoder/decoder.
 *
 * Modern ICO files may embed PNG data directly for each image entry
 * (supported by every browser and by Windows Vista+), so we write a
 * standard ICONDIR header followed by one ICONDIRENTRY per image and
 * then the raw PNG bytes.
 *
 * Layout (little-endian):
 *   ICONDIR      6 bytes   reserved(0) | type(1 = icon) | count
 *   ICONDIRENTRY 16 bytes  width | height | colors | reserved |
 *                          planes | bitCount | bytesInRes | imageOffset
 *   ...image data
 */

export interface IcoImage {
  /** Pixel width (1-256). */
  width: number
  /** Pixel height (1-256). */
  height: number
  /** Encoded PNG bytes. */
  data: Uint8Array
}

export interface IcoEntryInfo {
  width: number
  height: number
  planes: number
  bitCount: number
  size: number
  offset: number
}

export interface IcoHeaderInfo {
  reserved: number
  type: number
  count: number
  entries: IcoEntryInfo[]
}

const HEADER_SIZE = 6
const ENTRY_SIZE = 16

export function encodeIco(images: IcoImage[]): Uint8Array {
  if (images.length === 0) throw new Error('ICO needs at least one image')
  if (images.length > 0xffff) throw new Error('Too many images for ICO')

  const dataSize = images.reduce((sum, img) => sum + img.data.byteLength, 0)
  const total = HEADER_SIZE + ENTRY_SIZE * images.length + dataSize
  const out = new Uint8Array(total)
  const view = new DataView(out.buffer)

  view.setUint16(0, 0, true) // reserved
  view.setUint16(2, 1, true) // type: 1 = icon
  view.setUint16(4, images.length, true)

  let offset = HEADER_SIZE + ENTRY_SIZE * images.length
  images.forEach((img, i) => {
    if (img.width < 1 || img.width > 256 || img.height < 1 || img.height > 256) {
      throw new Error(`ICO entries must be 1-256px, got ${img.width}x${img.height}`)
    }
    const e = HEADER_SIZE + i * ENTRY_SIZE
    view.setUint8(e, img.width === 256 ? 0 : img.width)
    view.setUint8(e + 1, img.height === 256 ? 0 : img.height)
    view.setUint8(e + 2, 0) // palette colors (0 = no palette)
    view.setUint8(e + 3, 0) // reserved
    view.setUint16(e + 4, 1, true) // color planes
    view.setUint16(e + 6, 32, true) // bits per pixel
    view.setUint32(e + 8, img.data.byteLength, true)
    view.setUint32(e + 12, offset, true)
    out.set(img.data, offset)
    offset += img.data.byteLength
  })

  return out
}

/** Parse an ICO header + directory. Used for tests and sanity checks. */
export function readIcoHeader(bytes: Uint8Array): IcoHeaderInfo {
  if (bytes.byteLength < HEADER_SIZE) throw new Error('Not an ICO file: too short')
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const reserved = view.getUint16(0, true)
  const type = view.getUint16(2, true)
  const count = view.getUint16(4, true)
  if (bytes.byteLength < HEADER_SIZE + count * ENTRY_SIZE) {
    throw new Error('Not an ICO file: truncated directory')
  }
  const entries: IcoEntryInfo[] = []
  for (let i = 0; i < count; i++) {
    const e = HEADER_SIZE + i * ENTRY_SIZE
    entries.push({
      width: view.getUint8(e) || 256,
      height: view.getUint8(e + 1) || 256,
      planes: view.getUint16(e + 4, true),
      bitCount: view.getUint16(e + 6, true),
      size: view.getUint32(e + 8, true),
      offset: view.getUint32(e + 12, true),
    })
  }
  return { reserved, type, count, entries }
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

export function isPng(bytes: Uint8Array): boolean {
  return PNG_SIGNATURE.every((b, i) => bytes[i] === b)
}

/** Read width/height from a PNG's IHDR chunk. */
export function readPngSize(bytes: Uint8Array): { width: number; height: number } {
  if (!isPng(bytes) || bytes.byteLength < 24) throw new Error('Not a PNG')
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return { width: view.getUint32(16), height: view.getUint32(20) }
}
