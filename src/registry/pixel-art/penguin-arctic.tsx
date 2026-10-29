'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { IsoPixelScene, Part, ToonMaterial, useIso, useLoop, type IsoPixelSceneProps } from '@/registry/pixel-art/iso-scene'

/* -------------------------------------------------------------------------------------------------
 * Penguin Arctic: a tiny isometric pixel-art ice floe.
 * Penguins waddle between spots on the floe (rocking side to side), sometimes flop down and
 * belly-slide, and sometimes dive off the edge and pop back out somewhere else. Ice chunks bob
 * in the water, snow falls, and in dark mode the northern lights ripple overhead.
 * -----------------------------------------------------------------------------------------------*/

const C = {
  sea: '#4f9fc4',
  seaDeep: '#3a7fa6',
  ice: '#eef7fb',
  iceSide: '#bfe0ee',
  iceDark: '#9ccbe0',
  snow: '#ffffff',
  black: '#262a33',
  white: '#f7f7f4',
  beak: '#ff9a3d',
  ripple: '#e9fbff',
  auroraA: '#5dffb0',
  auroraB: '#b38cff',
  outline: '#1f2733',
}

const SEA_W = 9.4
const SEA_D = 8.4
const FLOE_R = 2.6
const FLOE_TOP = 0.25
const WALK_R = 1.5
const EDGE_R = 2.3
const WATER_R = 3.1
const IGLOO: [number, number] = [-1.5, -1.5]
const IGLOO_ANGLE = Math.atan2(IGLOO[1], IGLOO[0])
const FLAKE = new THREE.Matrix4()

export interface PenguinArcticProps extends Omit<IsoPixelSceneProps, 'scene' | 'outlineColor' | 'groundColor'> {
  /** How many penguins live on the floe (4–7). */
  penguinCount?: number
  /** Gentle snowfall. */
  snow?: boolean
}

/** Small deterministic RNG so every penguin has its own (repeatable) mind. */
function rng(seed: number) {
  let a = seed * 7919 + 13
  const next = () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  next()
  next()
  return next
}

/* ------------------------------------------------------------------------------------ water -- */

function Sea() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(SEA_W, SEA_D, 18, 16).toNonIndexed()
    g.rotateX(-Math.PI / 2)
    return g
  }, [])
  useEffect(() => () => geometry.dispose(), [geometry])
  const base = useMemo(() => Float32Array.from(geometry.attributes.position.array), [geometry])
  const surface = useRef<THREE.Mesh>(null)
  useLoop((t) => {
    const g = surface.current?.geometry
    if (!g) return
    const arr = g.attributes.position.array as Float32Array
    for (let i = 0; i < arr.length; i += 3) {
      const x = base[i]
      const z = base[i + 2]
      const edge = Math.min(1, (SEA_W / 2 - Math.abs(x)) * 2, (SEA_D / 2 - Math.abs(z)) * 2)
      arr[i + 1] = (Math.sin(x * 1.2 + t * 1.1) * 0.035 + Math.sin(z * 1.5 - t * 0.9) * 0.03) * Math.max(0, edge)
    }
    g.attributes.position.needsUpdate = true
    g.computeVertexNormals()
  })
  return (
    <group>
      <Part args={[SEA_W, 0.8, SEA_D]} position={[0, -0.45, 0]} color={C.seaDeep} />
      <mesh ref={surface} geometry={geometry} position={[0, -0.04, 0]} receiveShadow>
        <ToonMaterial color={C.sea} />
      </mesh>
    </group>
  )
}

function Chunk({ position, size, seed }: { position: [number, number]; size: [number, number, number]; seed: number }) {
  const ref = useRef<THREE.Group>(null)
  useLoop((t) => {
    if (!ref.current) return
    ref.current.position.y = size[1] * 0.25 - 0.04 + Math.sin(t * 1.1 + seed) * 0.03
    ref.current.rotation.z = Math.sin(t * 0.8 + seed) * 0.05
    ref.current.rotation.x = Math.cos(t * 0.7 + seed) * 0.04
  })
  return (
    <group ref={ref} position={[position[0], 0, position[1]]} rotation={[0, seed, 0]}>
      <Part args={size} color={C.ice} />
      <Part args={[size[0] * 1.02, size[1] * 0.4, size[2] * 1.02]} position={[0, -size[1] * 0.3, 0]} color={C.iceSide} outline={false} />
    </group>
  )
}

/* -------------------------------------------------------------------------------- penguins -- */

type Mode = 'idle' | 'walk' | 'slide' | 'dive' | 'swim' | 'hop'

interface Brain {
  mode: Mode
  x: number
  z: number
  fromX: number
  fromZ: number
  toX: number
  toZ: number
  heading: number
  timer: number
  duration: number
  gait: number
  ripple: number
  rippleX: number
  rippleZ: number
  rand: () => number
  /** Edge angle to dive from once the walk to the edge ends. */
  diveNext?: number
}

const insideWalk = (r: () => number): [number, number] => {
  const a = r() * Math.PI * 2
  const d = Math.sqrt(r()) * WALK_R
  return [Math.cos(a) * d, Math.sin(a) * d]
}

/** An edge angle that keeps away from the igloo. */
function edgeAngle(r: () => number) {
  for (;;) {
    const a = r() * Math.PI * 2
    const diff = Math.abs(Math.atan2(Math.sin(a - IGLOO_ANGLE), Math.cos(a - IGLOO_ANGLE)))
    if (diff > 0.9) return a
  }
}

function Penguin({ seed }: { seed: number }) {
  const root = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const flipL = useRef<THREE.Group>(null)
  const flipR = useRef<THREE.Group>(null)
  const footL = useRef<THREE.Mesh>(null)
  const footR = useRef<THREE.Mesh>(null)
  const ring = useRef<THREE.Mesh>(null)
  const size = 1.25 + (seed % 3) * 0.12

  const brain = useRef<Brain | null>(null)

  useLoop((t, dt) => {
    if (!brain.current) {
      const r = rng(seed + 11)
      const [x, z] = insideWalk(r)
      brain.current = { mode: 'idle', x, z, fromX: x, fromZ: z, toX: x, toZ: z, heading: r() * 6.28, timer: 0, duration: 0.5 + r() * 2, gait: 0, ripple: 9, rippleX: 0, rippleZ: 0, rand: r }
    }
    const b = brain.current
    if (!root.current || !body.current) return
    const r = b.rand
    b.timer += dt
    b.ripple += dt

    const goTo = (mode: Mode, toX: number, toZ: number, speed: number) => {
      b.mode = mode
      b.fromX = b.x
      b.fromZ = b.z
      b.toX = toX
      b.toZ = toZ
      b.timer = 0
      b.duration = Math.max(0.3, Math.hypot(toX - b.x, toZ - b.z) / speed)
    }

    // decide what's next when the current action ends
    if (b.timer >= b.duration) {
      if (b.mode === 'walk' || b.mode === 'slide') {
        b.mode = 'idle'
        b.timer = 0
        b.duration = 0.5 + r() * 1.8
      } else if (b.mode === 'idle') {
        const roll = r()
        if (roll < 0.22) {
          // walk to the edge first, then dive
          const a = edgeAngle(r)
          goTo('walk', Math.cos(a) * EDGE_R, Math.sin(a) * EDGE_R, 0.4)
          b.diveNext = a
        } else if (roll < 0.3) {
          const [x, z] = insideWalk(r)
          goTo('slide', x, z, 1.3)
        } else {
          const [x, z] = insideWalk(r)
          goTo('walk', x, z, 0.5)
        }
      } else if (b.mode === 'dive') {
        b.mode = 'swim'
        b.timer = 0
        b.duration = 1.5 + r() * 2
        b.ripple = 0
        b.rippleX = b.x
        b.rippleZ = b.z
      } else if (b.mode === 'swim') {
        const a = edgeAngle(r)
        b.x = Math.cos(a) * WATER_R
        b.z = Math.sin(a) * WATER_R
        b.ripple = 0
        b.rippleX = b.x
        b.rippleZ = b.z
        goTo('hop', Math.cos(a) * EDGE_R, Math.sin(a) * EDGE_R, 1)
        b.duration = 0.7
      } else if (b.mode === 'hop') {
        const [x, z] = insideWalk(r)
        goTo('walk', x, z, 0.38)
      }
      // finished walking to the edge: dive
      if (b.mode === 'idle' && b.diveNext !== undefined) {
        const a = b.diveNext
        b.diveNext = undefined
        goTo('dive', Math.cos(a) * WATER_R, Math.sin(a) * WATER_R, 1)
        b.duration = 0.8
      }
    }

    const k = Math.min(1, b.timer / b.duration)
    let y = FLOE_TOP
    let pitch = 0
    let rock = 0
    let flap = 0.15
    root.current.visible = b.mode !== 'swim'

    if (b.mode === 'walk' || b.mode === 'slide') {
      b.x = b.fromX + (b.toX - b.fromX) * k
      b.z = b.fromZ + (b.toZ - b.fromZ) * k
      b.heading = Math.atan2(b.toX - b.fromX, b.toZ - b.fromZ)
      if (b.mode === 'walk') {
        b.gait += dt * 9
        rock = Math.sin(b.gait) * 0.18
        flap = 0.35 + Math.abs(Math.sin(b.gait)) * 0.25
      } else {
        pitch = Math.min(1, k * 8, (1 - k) * 8) * 1.35
        y = FLOE_TOP + 0.02
        flap = 1.2
      }
    } else if (b.mode === 'dive' || b.mode === 'hop') {
      b.x = b.fromX + (b.toX - b.fromX) * k
      b.z = b.fromZ + (b.toZ - b.fromZ) * k
      b.heading = Math.atan2(b.toX - b.fromX, b.toZ - b.fromZ)
      const startY = b.mode === 'dive' ? FLOE_TOP : -0.3
      const endY = b.mode === 'dive' ? -0.3 : FLOE_TOP
      y = startY + (endY - startY) * k + Math.sin(k * Math.PI) * 0.55
      pitch = b.mode === 'dive' ? 0.3 + k * 1.2 : 1.2 - k * 1.2
      flap = 1.3
    } else if (b.mode === 'idle') {
      rock = Math.sin(t * 1.3 + seed) * 0.04
      flap = 0.15 + (Math.sin(t * 0.9 + seed * 2) > 0.95 ? 0.8 : 0)
    }

    root.current.position.set(b.x, y, b.z)
    root.current.rotation.y = b.heading
    body.current.rotation.set(pitch, 0, rock)
    if (flipL.current) flipL.current.rotation.z = flap
    if (flipR.current) flipR.current.rotation.z = -flap
    const step = b.mode === 'walk' ? Math.sin(b.gait) : 0
    if (footL.current) footL.current.position.y = 0.015 + Math.max(0, step) * 0.05
    if (footR.current) footR.current.position.y = 0.015 + Math.max(0, -step) * 0.05

    if (ring.current) {
      const p = Math.min(1, b.ripple / 1.2)
      ring.current.visible = p < 1
      ring.current.position.set(b.rippleX, 0.0, b.rippleZ)
      ring.current.scale.setScalar(0.15 + p * 0.6)
      ;(ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.9
    }
  })

  return (
    <>
      <group ref={root} scale={size} visible={false}>
        <group ref={body}>
          <Part args={[0.28, 0.4, 0.24]} position={[0, 0.3, 0]} color={C.black} />
          <Part args={[0.2, 0.3, 0.02]} position={[0, 0.27, 0.125]} color={C.white} outline={false} />
          <Part args={[0.22, 0.18, 0.2]} position={[0, 0.58, 0.01]} color={C.black} />
          <Part args={[0.06, 0.05, 0.02]} position={[-0.06, 0.6, 0.115]} color={C.white} outline={false} />
          <Part args={[0.06, 0.05, 0.02]} position={[0.06, 0.6, 0.115]} color={C.white} outline={false} />
          <Part shape="cone" args={[0.04, 0.11, 4]} position={[0, 0.55, 0.15]} rotation={[Math.PI / 2, 0, 0]} color={C.beak} />
          {(
            [
              [1, flipL],
              [-1, flipR],
            ] as const
          ).map(([side, ref]) => (
            <group key={side} ref={ref} position={[side * 0.15, 0.45, 0]}>
              <Part args={[0.04, 0.24, 0.12]} position={[0, -0.12, 0]} color={C.black} />
            </group>
          ))}
        </group>
        <mesh ref={footL} position={[0.07, 0.015, 0.06]}>
          <boxGeometry args={[0.08, 0.03, 0.12]} />
          <ToonMaterial color={C.beak} />
        </mesh>
        <mesh ref={footR} position={[-0.07, 0.015, 0.06]}>
          <boxGeometry args={[0.08, 0.03, 0.12]} />
          <ToonMaterial color={C.beak} />
        </mesh>
      </group>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.8, 1, 20]} />
        <meshBasicMaterial color={C.ripple} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </>
  )
}

/* ------------------------------------------------------------------------------- sky + snow -- */

function Snowfall({ count = 140 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const flakes = useRef<Float32Array | null>(null)
  useLoop((t, dt) => {
    if (!flakes.current) {
      const r = rng(7)
      const init = new Float32Array(count * 4)
      for (let i = 0; i < count; i++) {
        init[i * 4] = (r() - 0.5) * 8
        init[i * 4 + 1] = r() * 6
        init[i * 4 + 2] = (r() - 0.5) * 7.5
        init[i * 4 + 3] = 0.6 + r() * 0.6
      }
      flakes.current = init
    }
    const f = flakes.current
    const m = mesh.current
    if (!f || !m) return
    for (let i = 0; i < count; i++) {
      f[i * 4 + 1] -= dt * 0.45 * f[i * 4 + 3]
      if (f[i * 4 + 1] < 0) f[i * 4 + 1] += 6
      const drift = Math.sin(t * 0.8 + i) * 0.15
      m.setMatrixAt(i, FLAKE.makeTranslation(f[i * 4] + drift, f[i * 4 + 1], f[i * 4 + 2]))
    }
    m.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.045, 0.045, 0.045]} />
      <meshBasicMaterial color={C.snow} toneMapped={false} />
    </instancedMesh>
  )
}

function Aurora() {
  const ribbons = useRef<(THREE.Mesh | null)[]>([])
  const fade = useMemo(() => {
    // soft curtain: bright near the lower edge, fading up and out to both ends
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const img = ctx.createImageData(32, 32)
      for (let y = 0; y < 32; y++) {
        const v = 1 - y / 31 // canvas top = top of the ribbon
        const vertical = v < 0.25 ? v / 0.25 : Math.pow(1 - (v - 0.25) / 0.75, 1.6)
        for (let x = 0; x < 32; x++) {
          const u = x / 31
          const horizontal = Math.min(1, u * 4, (1 - u) * 4)
          const a = Math.round(255 * vertical * horizontal)
          img.data.set([a, a, a, 255], (y * 32 + x) * 4)
        }
      }
      ctx.putImageData(img, 0, 0)
    }
    return new THREE.CanvasTexture(canvas)
  }, [])
  useEffect(() => () => fade.dispose(), [fade])
  const geometries = useMemo(() => [0, 1].map(() => new THREE.PlaneGeometry(8, 1.8, 36, 1)), [])
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries])
  const bases = useMemo(() => geometries.map((g) => Float32Array.from(g.attributes.position.array)), [geometries])

  useLoop((t) => {
    ribbons.current.forEach((mesh, j) => {
      const g = mesh?.geometry
      if (!g) return
      const arr = g.attributes.position.array as Float32Array
      const base = bases[j]
      for (let i = 0; i < arr.length; i += 3) {
        const x = base[i]
        arr[i + 2] = Math.sin(x * 0.7 + t * 0.6 + j * 2) * 0.6 + Math.sin(x * 1.9 - t * 0.9) * 0.15
        arr[i + 1] = base[i + 1] + Math.sin(x * 0.5 + t * 0.4 + j) * 0.2
      }
      g.attributes.position.needsUpdate = true
    })
  })

  return (
    <group position={[-2.4, 1.7, -2.4]} rotation={[0, Math.PI / 4, 0]}>
      {[C.auroraA, C.auroraB].map((color, j) => (
        <mesh
          key={color}
          geometry={geometries[j]}
          position={[j * 0.4, j * 0.35, -j * 0.5]}
          ref={(m) => {
            ribbons.current[j] = m
          }}
        >
          <meshBasicMaterial
            color={color}
            alphaMap={fade}
            transparent
            opacity={j === 0 ? 0.5 : 0.35}
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/* -------------------------------------------------------------------------------------- floe -- */

function Floe() {
  const mounds = useMemo(
    () =>
      [
        [1.6, 1.2, 0.35],
        [1.9, -0.6, 0.28],
        [-0.4, 2.0, 0.3],
        [0.6, -1.9, 0.25],
      ] as const,
    [],
  )
  return (
    <group>
      <Part shape="cylinder" args={[FLOE_R, FLOE_R + 0.15, 0.4, 9]} position={[0, FLOE_TOP - 0.2, 0]} color={C.iceSide} />
      <Part shape="cylinder" args={[FLOE_R - 0.05, FLOE_R - 0.05, 0.04, 9]} position={[0, FLOE_TOP + 0.005, 0]} color={C.ice} outline={false} />
      {mounds.map(([x, z, s], i) => (
        <Part key={i} shape="sphere" args={[s, 0]} position={[x, FLOE_TOP, z]} scale={[1.4, 0.55, 1.1]} color={C.snow} />
      ))}
      {/* igloo */}
      <group position={[IGLOO[0], FLOE_TOP, IGLOO[1]]} rotation={[0, Math.PI / 4, 0]}>
        <Part shape="sphere" args={[0.55, 1]} scale={[1, 0.8, 1]} color={C.snow} />
        <Part args={[0.36, 0.36, 0.4]} position={[0, 0.16, 0.5]} color={C.ice} />
        <Part args={[0.22, 0.24, 0.05]} position={[0, 0.13, 0.71]} color="#1d2b3a" outline={false} />
      </group>
    </group>
  )
}

function Diorama({ penguinCount, snow }: { penguinCount: number; snow: boolean }) {
  const { dark } = useIso()
  const count = Math.min(7, Math.max(4, Math.round(penguinCount)))
  return (
    <>
      <Sea />
      <Floe />
      <Chunk position={[3.2, -1.9]} size={[0.9, 0.3, 0.7]} seed={1} />
      <Chunk position={[-3.3, 1.7]} size={[0.6, 0.25, 0.5]} seed={2} />
      <Chunk position={[2.3, 2.9]} size={[0.45, 0.2, 0.4]} seed={3} />
      <Chunk position={[-1.0, -3.4]} size={[0.5, 0.22, 0.6]} seed={4} />
      {Array.from({ length: count }, (_, i) => (
        <Penguin key={i} seed={i + 1} />
      ))}
      {snow && <Snowfall />}
      {dark && <Aurora />}
    </>
  )
}

/** Isometric pixel-art penguin ice floe. Put any content inside it as children. */
export function PenguinArctic({ penguinCount = 5, snow = true, children, ...props }: PenguinArcticProps) {
  return (
    <IsoPixelScene
      {...props}
      outlineColor={C.outline}
      groundColor={C.ice}
      extent={[11, 8.8]}
      target={[0, 0.5, 0]}
      scene={<Diorama penguinCount={penguinCount} snow={snow} />}
    >
      {children}
    </IsoPixelScene>
  )
}
