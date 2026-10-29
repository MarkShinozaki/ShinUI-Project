'use client'

import { Canvas, useFrame, useThree, type ThreeElements } from '@react-three/fiber'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from 'react'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------------------------------
 * Iso Scene kit: the shared bits behind the isometric pixel-art backgrounds.
 *
 *  - <IsoPixelScene>  a WebGL canvas with a true isometric orthographic camera that always fits
 *                     the diorama, rendered at 1/pixelSize resolution and upscaled with
 *                     nearest-neighbour filtering (the "pixel" look), plus toon lights that
 *                     follow the site's light/dark theme.
 *                     `zoom` scales the fitted view; `interactiveZoom` adds wheel, pinch and
 *                     +/- buttons while the pointer is over the scene. Outlines are opt-in.
 *  - <Part>           a low-poly box/cylinder/sphere/cone with a 3-band toon material and an
 *                     inverted-hull outline about 1.5 rendered pixels wide.
 *  - useLoop()        a speed-scaled animation clock, so changing speed never makes things jump.
 *  - useIso()         scene settings (dark mode, toon ramp, outline settings, speed).
 * -----------------------------------------------------------------------------------------------*/

export interface IsoSettings {
  ramp: THREE.Texture
  outlines: boolean
  outlineColor: string
  /** Outline width in world units. */
  thickness: number
  /** Animation speed multiplier (0 when the user prefers reduced motion). */
  speed: number
  /** True when the site is in dark mode (or the scene forces night). */
  dark: boolean
}

const IsoContext = createContext<IsoSettings | null>(null)

export function useIso() {
  const ctx = useContext(IsoContext)
  if (!ctx) throw new Error('Iso scene parts must render inside <IsoPixelScene>.')
  return ctx
}

/** Advance a local clock by delta * speed and hand it to `callback` every frame. */
export function useLoop(callback: (t: number, dt: number) => void) {
  const { speed } = useIso()
  const time = useRef(0)
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1) * speed
    time.current += dt
    callback(time.current, dt)
  })
}

/** A small texture drawn with the 2D canvas API (signs, letters, checkers). */
export function useCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
  key: string,
) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (ctx) draw(ctx)
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    t.minFilter = THREE.NearestFilter
    t.magFilter = THREE.NearestFilter
    return t
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, key])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

/* -------------------------------------------------------------------------------------- Part -- */

type MeshProps = Omit<ThreeElements['mesh'], 'args' | 'children'>
type Shape =
  | { shape?: 'box'; args: [number, number, number] }
  | { shape: 'cylinder'; args: [number, number, number, number?] }
  | { shape: 'sphere'; args: [number, number?] }
  | { shape: 'cone'; args: [number, number, number?] }

export type PartProps = MeshProps &
  Shape & {
    color: string
    /** Skip the outline on tiny or flat details. */
    outline?: boolean
    children?: ReactNode
  }

/** Geometry for a shape, grown by `grow` world units on every side (used for the outline hull). */
function geometry(shape: Shape['shape'], args: number[], grow = 0) {
  const g2 = grow * 2
  switch (shape) {
    case 'cylinder':
      return <cylinderGeometry args={[args[0] + grow, args[1] + grow, args[2] + g2, args[3] ?? 10]} />
    case 'sphere':
      return <icosahedronGeometry args={[args[0] + grow, args[1] ?? 1]} />
    case 'cone':
      return <coneGeometry args={[args[0] + grow, args[1] + g2 * 1.5, args[2] ?? 8]} />
    default:
      return <boxGeometry args={[args[0] + g2, args[1] + g2, args[2] + g2]} />
  }
}

const noRaycast = () => null

/**
 * One low-poly shape with a toon material. The outline is an "inverted hull": a slightly
 * bigger copy drawn back-faces-only in the outline color, so only its rim shows.
 */
export function Part({ color, outline = true, children, ...rest }: PartProps) {
  const { ramp, outlines, thickness, outlineColor } = useIso()
  const { shape = 'box', args, ...mesh } = rest as MeshProps & { shape?: Shape['shape']; args: number[] }
  return (
    <mesh castShadow receiveShadow {...mesh}>
      {geometry(shape, args)}
      <meshToonMaterial color={color} gradientMap={ramp} />
      {outlines && outline && (
        <mesh raycast={noRaycast}>
          {geometry(shape, args, thickness)}
          <meshBasicMaterial color={outlineColor} side={THREE.BackSide} toneMapped={false} />
        </mesh>
      )}
      {children}
    </mesh>
  )
}

/** A toon material for custom geometry (tracks, water beds) that matches <Part>. */
export function ToonMaterial({ color }: { color: string }) {
  const { ramp } = useIso()
  return <meshToonMaterial color={color} gradientMap={ramp} />
}

/* ------------------------------------------------------------------------------------- hooks -- */

/** Follow the site theme (the `dark` class on <html>). */
function useIsDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => setDark(root.classList.contains('dark')))
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return dark
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** Three hard light bands: the classic toon look. */
function useToonRamp() {
  const texture = useMemo(() => {
    const t = new THREE.DataTexture(new Uint8Array([110, 185, 255]), 3, 1, THREE.RedFormat)
    t.minFilter = THREE.NearestFilter
    t.magFilter = THREE.NearestFilter
    t.needsUpdate = true
    return t
  }, [])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

/** Render at most `fps` frames a second (used with frameloop="demand" in thumbnails). */
function FrameThrottle({ fps }: { fps: number }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    invalidate()
    const timer = window.setInterval(() => invalidate(), 1000 / fps)
    return () => window.clearInterval(timer)
  }, [invalidate, fps])
  return null
}

/* -------------------------------------------------------------------------------------- zoom -- */

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2.5
const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z))

/**
 * Wheel and pinch zoom on the host element. Wheel events only arrive while the pointer is over
 * the scene, and once the zoom hits a limit the wheel scrolls the page again instead of being eaten.
 * One-finger touch still scrolls the page; only two-finger pinches zoom.
 */
function useInteractiveZoom(
  host: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  current: number,
  zoomBy: (factor: number) => void,
) {
  const latest = useRef(current)
  useEffect(() => {
    latest.current = current
  }, [current])

  useEffect(() => {
    const el = host.current
    // Gallery thumbnails are `inert` previews: no wheel/pinch there.
    if (!el || !enabled || el.closest('[inert]')) return
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return
      const zoomingIn = e.deltaY < 0
      if ((zoomingIn && latest.current >= ZOOM_MAX) || (!zoomingIn && latest.current <= ZOOM_MIN)) return
      e.preventDefault()
      const step = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
      zoomBy(Math.exp(-Math.max(-120, Math.min(120, step)) * (e.ctrlKey ? 0.01 : 0.0015)))
    }
    const touches = new Map<number, { x: number; y: number }>()
    let pinch = 0
    const spread = () => {
      const [a, b] = [...touches.values()]
      return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0
    }
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (touches.size === 2) pinch = spread()
    }
    const onMove = (e: PointerEvent) => {
      if (!touches.has(e.pointerId)) return
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (touches.size !== 2 || pinch === 0) return
      const next = spread()
      if (next > 0) zoomBy(next / pinch)
      pinch = next
    }
    const onUp = (e: PointerEvent) => {
      touches.delete(e.pointerId)
      pinch = touches.size === 2 ? spread() : 0
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [host, enabled, zoomBy])
}

/* ------------------------------------------------------------------------------------- stage -- */

type Vec3 = [number, number, number]

/** Keep a true isometric view aimed at `target`. */
function IsoCamera({ zoom, target }: { zoom: number; target: Vec3 }) {
  const get = useThree((s) => s.get)
  const [tx, ty, tz] = target
  useLayoutEffect(() => {
    const { camera } = get()
    const center = new THREE.Vector3(tx, ty, tz)
    camera.position.copy(center).add(new THREE.Vector3(1, 0.82, 1).normalize().multiplyScalar(30))
    camera.lookAt(center)
    camera.zoom = zoom
    camera.updateProjectionMatrix()
  }, [get, zoom, tx, ty, tz])
  return null
}

interface StageProps {
  settings: IsoSettings
  pixelSize: number
  /** Multiplier on the fitted zoom (already clamped). */
  zoom: number
  autoRotate: boolean
  extent: [number, number]
  target: Vec3
  groundColor: string
  children: ReactNode
}

function Stage({ settings, pixelSize, zoom: zoomScale, autoRotate, extent, target, groundColor, children }: StageProps) {
  const { dark, speed } = settings
  const turntable = useRef<THREE.Group>(null)
  const size = useThree((s) => s.size)
  // CSS px per world unit that fits `extent` (world units across/up) in the frame.
  const fit = Math.max(4, Math.min(size.width / extent[0], size.height / extent[1]))
  // Snap to whole rendered pixels per world unit so the pixel grid stays steady while zooming.
  const zoom = Math.max(pixelSize, Math.round((fit * zoomScale) / pixelSize) * pixelSize)
  // About 1.5 rendered pixels wide at any frame size and pixel size.
  const thickness = (1.5 * pixelSize) / zoom
  const scoped = useMemo(() => ({ ...settings, thickness }), [settings, thickness])

  useFrame((_, delta) => {
    if (autoRotate && turntable.current) turntable.current.rotation.y += Math.min(delta, 0.1) * 0.25 * Math.max(speed, 0.2)
  })

  return (
    <IsoContext.Provider value={scoped}>
      <IsoCamera zoom={zoom} target={target} />
      <hemisphereLight args={[dark ? '#8a90c0' : '#ffffff', groundColor, dark ? 0.6 : 1.3]} />
      <directionalLight
        castShadow
        position={[5, 10, 3]}
        intensity={dark ? 0.7 : 1.8}
        color={dark ? '#b8c0ff' : '#fff6e8'}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
      />
      <group ref={turntable}>{children}</group>
    </IsoContext.Provider>
  )
}

export interface IsoPixelSceneProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** The 3D diorama (built from <Part>s). */
  scene: ReactNode
  /** Regular DOM content drawn on top of the canvas. */
  children?: ReactNode
  /** Size of one "pixel" in CSS px. 1 renders crisp, 3–5 looks hand-pixeled. */
  pixelSize?: number
  /** Animation speed multiplier. 0 freezes the scene. */
  speed?: number
  /** Slowly turn the whole diorama. */
  autoRotate?: boolean
  /** Dark toon outlines around every shape. Off by default. */
  showOutlines?: boolean
  /** Zoom multiplier on the fitted view: below 1 zooms out (more scene), above 1 zooms in. Clamped to 0.5–2.5. */
  zoom?: number
  /** Let people zoom with the mouse wheel, a pinch, or the +/- buttons while the pointer is over the scene. */
  interactiveZoom?: boolean
  outlineColor?: string
  /** World units that must fit across and up the frame. */
  extent?: [number, number]
  /** Point the camera looks at. */
  target?: Vec3
  /** Bounce-light color from below (usually the ground color). */
  groundColor?: string
  /** Force night lighting even when the site is in light mode. */
  night?: boolean
}

/** Isometric, pixelated, toon-lit WebGL stage for a small diorama. */
export function IsoPixelScene({
  scene,
  children,
  className,
  pixelSize = 3,
  speed = 1,
  autoRotate = false,
  showOutlines = false,
  zoom = 1,
  interactiveZoom = true,
  outlineColor = '#2a2230',
  extent = [10.5, 8.5],
  target = [0, 1, 0],
  groundColor = '#e9e4da',
  night = false,
  ...props
}: IsoPixelSceneProps) {
  const dark = useIsDark() || night
  const reducedMotion = usePrefersReducedMotion()
  const ramp = useToonRamp()
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  // Inside an `inert` gallery thumbnail: no zoom UI and a throttled frame rate.
  const [thumbnail, setThumbnail] = useState(false)

  // Stop rendering while scrolled out of view.
  useEffect(() => {
    const el = host.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
      setThumbnail(entry.target.closest('[inert]') !== null)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const px = Math.max(1, Math.round(pixelSize))
  const [userZoom, setUserZoom] = useState(1)
  const baseZoom = clampZoom(Number.isFinite(zoom) ? zoom : 1)
  // The user's wheel/pinch zoom rides on top of the `zoom` prop; reset it when that prop changes.
  const [zoomFor, setZoomFor] = useState(baseZoom)
  if (zoomFor !== baseZoom) {
    setZoomFor(baseZoom)
    setUserZoom(1)
  }
  const effectiveZoom = interactiveZoom ? clampZoom(baseZoom * userZoom) : baseZoom
  const zoomBy = useCallback(
    (factor: number) => setUserZoom((z) => clampZoom(baseZoom * z * factor) / baseZoom),
    [baseZoom],
  )
  useInteractiveZoom(host, interactiveZoom, effectiveZoom, zoomBy)
  const settings = useMemo<IsoSettings>(
    () => ({ ramp, outlines: showOutlines, outlineColor, thickness: 0.04, speed: reducedMotion ? 0 : speed, dark }),
    [ramp, showOutlines, outlineColor, speed, reducedMotion, dark],
  )

  return (
    <div
      ref={host}
      // With interactive zoom, one-finger panning still scrolls the page; two-finger pinches are ours.
      className={cn('relative isolate overflow-hidden bg-background', interactiveZoom && 'touch-pan-x touch-pan-y', className)}
      {...props}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* R3F disposes the renderer and force-loses the WebGL context when this unmounts. */}
        <Canvas
          orthographic
          shadows="percentage"
          flat
          // Render at 1/pixelSize resolution; CSS scales it back up with nearest-neighbour.
          dpr={px === 1 ? Math.min(window.devicePixelRatio, 2) : 1 / px}
          frameloop={!visible ? 'never' : thumbnail ? 'demand' : 'always'}
          // Measure layout size, not the on-screen box: thumbnails scale their preview with a CSS
          // transform, and the bounding rect would shrink the canvas a second time.
          resize={{ offsetSize: true }}
          gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
          camera={{ near: 0.1, far: 100, position: [20, 16, 20] }}
          style={{ imageRendering: 'pixelated' }}
        >
          <Stage
            settings={settings}
            pixelSize={px}
            zoom={effectiveZoom}
            autoRotate={autoRotate && !reducedMotion}
            extent={extent}
            target={target}
            groundColor={groundColor}
          >
            {scene}
          </Stage>
          {thumbnail && visible && <FrameThrottle fps={12} />}
        </Canvas>
      </div>
      {children}
      {interactiveZoom && !thumbnail && (
        <div className="absolute right-3 bottom-3 z-10 flex [[inert]_&]:hidden flex-col overflow-hidden rounded-md border border-border bg-background/80 text-sm shadow-sm backdrop-blur">
          <button
            type="button"
            aria-label="Zoom in"
            disabled={effectiveZoom >= ZOOM_MAX}
            onClick={() => zoomBy(1.25)}
            className="size-7 cursor-pointer leading-none hover:bg-ds-muted/30 disabled:cursor-default disabled:opacity-40"
          >
            +
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            disabled={effectiveZoom <= ZOOM_MIN}
            onClick={() => zoomBy(0.8)}
            className="size-7 cursor-pointer border-t border-border leading-none hover:bg-ds-muted/30 disabled:cursor-default disabled:opacity-40"
          >
            −
          </button>
        </div>
      )}
    </div>
  )
}
