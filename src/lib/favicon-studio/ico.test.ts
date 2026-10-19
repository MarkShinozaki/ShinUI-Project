import { describe, expect, it } from 'vitest'
import { encodeIco, isPng, readIcoHeader, readPngSize } from './ico'

/** Build a minimal fake PNG (signature + IHDR) of the given size. */
function fakePng(size: number, extra = 20): Uint8Array {
  const bytes = new Uint8Array(33 + extra)
  bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0)
  const view = new DataView(bytes.buffer)
  view.setUint32(8, 13) // IHDR length
  bytes.set([0x49, 0x48, 0x44, 0x52], 12) // "IHDR"
  view.setUint32(16, size)
  view.setUint32(20, size)
  bytes[24] = 8 // bit depth
  bytes[25] = 6 // RGBA
  for (let i = 33; i < bytes.length; i++) bytes[i] = i & 0xff
  return bytes
}

describe('encodeIco', () => {
  const sizes = [16, 32, 48]
  const pngs = sizes.map((s, i) => fakePng(s, 10 + i * 7))
  const ico = encodeIco(sizes.map((s, i) => ({ width: s, height: s, data: pngs[i] })))

  it('writes a valid ICONDIR header with 3 entries', () => {
    const header = readIcoHeader(ico)
    expect(header.reserved).toBe(0)
    expect(header.type).toBe(1)
    expect(header.count).toBe(3)
    expect(Array.from(ico.slice(0, 6))).toEqual([0, 0, 1, 0, 3, 0])
  })

  it('writes correct directory entries and offsets', () => {
    const { entries } = readIcoHeader(ico)
    let expectedOffset = 6 + 16 * 3
    entries.forEach((e, i) => {
      expect(e.width).toBe(sizes[i])
      expect(e.height).toBe(sizes[i])
      expect(e.planes).toBe(1)
      expect(e.bitCount).toBe(32)
      expect(e.size).toBe(pngs[i].byteLength)
      expect(e.offset).toBe(expectedOffset)
      const embedded = ico.slice(e.offset, e.offset + e.size)
      expect(isPng(embedded)).toBe(true)
      expect(readPngSize(embedded)).toEqual({ width: sizes[i], height: sizes[i] })
      expectedOffset += e.size
    })
    expect(ico.byteLength).toBe(expectedOffset)
  })

  it('encodes 256px as 0 in the directory', () => {
    const big = encodeIco([{ width: 256, height: 256, data: fakePng(256) }])
    expect(big[6]).toBe(0)
    expect(big[7]).toBe(0)
    expect(readIcoHeader(big).entries[0].width).toBe(256)
  })

  it('rejects invalid input', () => {
    expect(() => encodeIco([])).toThrow()
    expect(() => encodeIco([{ width: 512, height: 512, data: fakePng(512) }])).toThrow()
  })
})
