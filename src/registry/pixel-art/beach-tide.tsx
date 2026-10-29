'use client'

import { useRef } from 'react'
import * as THREE from 'three'
import { IsoPixelScene, Part, useIso, useLoop, type IsoPixelSceneProps } from '@/registry/pixel-art/iso-scene'

/* -------------------------------------------------------------------------------------------------
 * Beach Tide: an isometric pixel-art beach. Waves roll toward shore, break into a foamy swash
 * that rushes up the sand and slides back, leaving wet sand that darkens and slowly dries.
 * Underneath, a slower tide cycle moves the whole waterline in and out. Umbrella, towel,
 * a sandcastle, a dune with beach grass, a gull by day and a lantern at night.
 * -----------------------------------------------------------------------------------------------*/

const BASE = {
  sand: '#f0d9a4',
  sandSide: '#d9bd84',
  wet: '#c9a96e',
  damp: '#ddc28a',
  sea: '#4fb7cf',
  deep: '#2f8fb3',
  swash: '#8fd8e4',
  foam: '#f8fbff',
  dune: '#e6cc92',
  grass: '#8fb85a',
  rock: '#9a958c',
  umbrella: '#e5483d',
  umbrellaAlt: '#f8f3e8',
  pole: '#c9c2b5',
  towel: '#3f8fd8',
  towelStripe: '#ffd23a',
  castle: '#e2c38a',
  flag: '#e5483d',
  gull: '#f4f4f0',
  lantern: '#ffd27a',
  shell: '#f6c3b8',
  outline: '#2a3440',
}

const PALETTES = {
  day: BASE,
  sunset: { ...BASE, sand: '#f0c495', sandSide: '#d6a479', wet: '#c08d6a', damp: '#d9a97f', sea: '#d88a8a', deep: '#9a5f88', swash: '#f2b8a8', foam: '#fff0e6', grass: '#a9a85a', dune: '#e6b989' },
  night: { ...BASE, sea: '#2f6f9a', deep: '#1f4f7a', swash: '#5a9ac0', foam: '#dbe8f4' },
} as const

export type BeachTideTimeOfDay = keyof typeof PALETTES
type Palette = (typeof PALETTES)[BeachTideTimeOfDay]

export interface BeachTideProps extends Omit<IsoPixelSceneProps, 'scene' | 'outlineColor' | 'groundColor' | 'night'> {
  /** Tide cycle speed multiplier (1 ≈ a 30 second high-to-high tide). */
  tideSpeed?: number
  /** Wave size: crest height and how far the swash runs up the sand. */
  waveHeight?: number
  timeOfDay?: BeachTideTimeOfDay
}

const STRIPS = 14
const DEPTH = 7 // z extent of the diorama
const STRIP_W = DEPTH / STRIPS
const SHORE = 0.9 // mean waterline x
const TIDE = 0.8 // tide amplitude in x
const RUN = 1.5 // swash run-up at waveHeight 1
const WAVE = 4.6 // seconds per wave
const SPACING = 2.1 // distance between incoming crests
const SEA_END = 5

const ease = (k: number) => k * k * (3 - 2 * k)

/** Swash shape over one wave: a quick rush up the sand, then a slower slide back. */
function runup(k: number) {
  return k < 0.32 ? ease(k / 0.32) : 1 - ease((k - 0.32) / 0.68)
}

function Shore({ colors, tideSpeed, waveHeight }: { colors: Palette; tideSpeed: number; waveHeight: number }) {
  const sea = useRef<THREE.Group>(null)
  const deep = useRef<THREE.Group>(null)
  const swash = useRef<(THREE.Group | null)[]>([])
  const foam = useRef<(THREE.Group | null)[]>([])
  const wet = useRef<(THREE.Group | null)[]>([])
  const damp = useRef<(THREE.Group | null)[]>([])
  const crests = useRef<(THREE.Group | null)[]>([])
  const tidePhase = useRef(0)
  // Leftmost x each strip's water reached; it creeps back toward the sea as the sand dries.
  const edges = useRef({ wet: new Float32Array(STRIPS).fill(SHORE), damp: new Float32Array(STRIPS).fill(SHORE) })

  const place = (g: THREE.Group | null | undefined, from: number, to: number) => {
    if (!g) return
    const width = to - from
    g.visible = width > 0.02
    g.position.x = (from + to) / 2
    g.scale.x = Math.max(0.001, width)
  }

  useLoop((t, dt) => {
    tidePhase.current += dt * Math.max(0, tideSpeed)
    const shore = SHORE + Math.sin((tidePhase.current / 30) * Math.PI * 2) * TIDE
    const height = Math.max(0.1, waveHeight)
    const k = (t % WAVE) / WAVE
    const u = runup(k)

    place(sea.current, shore, SEA_END + 0.01)
    place(deep.current, Math.min(SEA_END, shore + 1.6), SEA_END + 0.01)

    const { wet: wetEdge, damp: dampEdge } = edges.current
    for (let i = 0; i < STRIPS; i++) {
      const z = -DEPTH / 2 + STRIP_W * (i + 0.5)
      // Each strip runs a little further or shorter, so the swash edge is ragged.
      const vary = 1 + Math.sin(z * 1.3 + Math.floor(t / WAVE) * 2.1) * 0.22
      const front = shore - RUN * height * vary * u
      place(swash.current[i], front, shore + 0.02)
      const f = foam.current[i]
      if (f) {
        f.visible = u > 0.04
        f.position.x = front + 0.06
        f.scale.x = 0.6 + u * 0.6
      }
      wetEdge[i] = Math.min(wetEdge[i], front) + dt * 0.12
      dampEdge[i] = Math.min(dampEdge[i], wetEdge[i]) + dt * 0.035
      wetEdge[i] = Math.min(wetEdge[i], shore)
      dampEdge[i] = Math.min(dampEdge[i], shore)
      place(wet.current[i], wetEdge[i], shore)
      place(damp.current[i], dampEdge[i], shore)
    }

    // Incoming crests: they rise as they near the shore and break when the swash starts.
    crests.current.forEach((g, i) => {
      if (!g) return
      const x = shore + (i + 1 - k) * SPACING
      g.visible = x < SEA_END - 0.15 && x > shore
      g.position.x = x
      const near = 1 - Math.min(1, (x - shore) / (SPACING * 2))
      g.scale.y = height * (0.4 + near * 1.2)
      g.position.y = 0.05 + Math.sin(t * 2 + i) * 0.01
    })
  })

  const strips = Array.from({ length: STRIPS }, (_, i) => -DEPTH / 2 + STRIP_W * (i + 0.5))
  return (
    <>
      {/* sea body covers the plate's side faces on the water half */}
      <group ref={sea} position={[SHORE, 0, 0]}>
        <Part args={[1, 0.32, DEPTH + 0.02]} position={[0, -0.11, 0]} color={colors.sea} outline={false} />
      </group>
      <group ref={deep} position={[3, 0, 0]}>
        <Part args={[1, 0.32, DEPTH + 0.03]} position={[0, -0.105, 0]} color={colors.deep} outline={false} />
      </group>
      {strips.map((z, i) => (
        <group key={z}>
          <group ref={(g) => void (damp.current[i] = g)} position={[SHORE, 0, z]}>
            <Part args={[1, 0.006, STRIP_W + 0.001]} position={[0, 0.003, 0]} color={colors.damp} outline={false} />
          </group>
          <group ref={(g) => void (wet.current[i] = g)} position={[SHORE, 0, z]}>
            <Part args={[1, 0.01, STRIP_W + 0.001]} position={[0, 0.005, 0]} color={colors.wet} outline={false} />
          </group>
          <group ref={(g) => void (swash.current[i] = g)} position={[SHORE, 0, z]}>
            <Part args={[1, 0.025, STRIP_W + 0.001]} position={[0, 0.013, 0]} color={colors.swash} outline={false} />
          </group>
          <group ref={(g) => void (foam.current[i] = g)} position={[SHORE, 0, z]}>
            <Part args={[0.16, 0.05, STRIP_W + 0.002]} position={[0, 0.025, 0]} color={colors.foam} outline={false} />
          </group>
        </group>
      ))}
      {[0, 1].map((i) => (
        <group key={i} ref={(g) => void (crests.current[i] = g)} position={[SHORE + 2, 0.05, 0]}>
          <Part args={[0.22, 0.1, DEPTH - 0.4]} position={[0, 0.05, 0]} color={colors.swash} outline={false} />
          <Part args={[0.1, 0.04, DEPTH - 0.6]} position={[-0.07, 0.11, 0]} color={colors.foam} outline={false} />
        </group>
      ))}
    </>
  )
}

function Gull() {
  const ref = useRef<THREE.Group>(null)
  const wingL = useRef<THREE.Group>(null)
  const wingR = useRef<THREE.Group>(null)
  useLoop((t) => {
    if (!ref.current) return
    const a = t * 0.45
    ref.current.position.set(1.5 + Math.cos(a) * 2.2, 3 + Math.sin(t * 1.3) * 0.15, Math.sin(a) * 2)
    ref.current.rotation.y = -a
    const flap = Math.sin(t * 7) * 0.5
    if (wingL.current) wingL.current.rotation.x = flap
    if (wingR.current) wingR.current.rotation.x = -flap
  })
  return (
    <group ref={ref}>
      <Part args={[0.12, 0.1, 0.3]} color={BASE.gull} />
      <Part args={[0.05, 0.04, 0.08]} position={[0, 0, 0.18]} color="#f2b33d" outline={false} />
      <group ref={wingL} position={[0.06, 0.03, 0]}>
        <Part args={[0.36, 0.02, 0.12]} position={[0.18, 0, 0]} color={BASE.gull} />
      </group>
      <group ref={wingR} position={[-0.06, 0.03, 0]}>
        <Part args={[0.36, 0.02, 0.12]} position={[-0.18, 0, 0]} color={BASE.gull} />
      </group>
    </group>
  )
}

function Diorama({ colors, tideSpeed, waveHeight, night }: { colors: Palette; tideSpeed: number; waveHeight: number; night: boolean }) {
  const { dark } = useIso()
  return (
    <>
      <Part args={[10, 0.5, DEPTH]} position={[0, -0.25, 0]} color={colors.sand} />
      {/* dune with beach grass at the back */}
      <Part args={[2.2, 0.35, DEPTH]} position={[-3.9, 0.17, 0]} color={colors.dune} />
      <Part args={[1.2, 0.2, DEPTH - 0.6]} position={[-4.3, 0.44, 0]} color={colors.dune} outline={false} />
      {Array.from({ length: 16 }, (_, i) => {
        const x = -4.6 + (i % 4) * 0.42 + ((i * 37) % 10) / 40
        const z = -3 + Math.floor(i / 4) * 1.6 + ((i * 13) % 7) / 10
        return (
          <group key={i} position={[x, 0.42, z]} rotation={[0, i, 0]}>
            <Part shape="cone" args={[0.08, 0.5, 4]} position={[0, 0.25, 0]} color={colors.grass} outline={false} />
            <Part shape="cone" args={[0.06, 0.38, 4]} position={[0.08, 0.19, 0.05]} rotation={[0, 0, -0.3]} color={colors.grass} outline={false} />
          </group>
        )
      })}
      {/* umbrella and towel */}
      <group position={[-1.6, 0, -1.3]}>
        <Part shape="cylinder" args={[0.03, 0.03, 1.7, 6]} position={[0, 0.85, 0]} rotation={[0, 0, 0.12]} color={colors.pole} />
        <group position={[-0.1, 1.68, 0]} rotation={[0, 0, 0.12]}>
          <Part shape="cone" args={[0.95, 0.4, 8]} color={colors.umbrella} />
          <Part shape="cone" args={[0.5, 0.22, 8]} position={[0, 0.1, 0]} color={colors.umbrellaAlt} outline={false} />
        </group>
        <Part args={[1.3, 0.02, 0.7]} position={[0.55, 0.01, 0.6]} color={colors.towel} />
        <Part args={[1.3, 0.025, 0.12]} position={[0.55, 0.012, 0.6]} color={colors.towelStripe} outline={false} />
      </group>
      {/* sandcastle */}
      <group position={[-0.6, 0, 1.6]}>
        <Part args={[0.7, 0.24, 0.7]} position={[0, 0.12, 0]} color={colors.castle} />
        {[
          [-0.3, -0.3],
          [0.3, -0.3],
          [-0.3, 0.3],
          [0.3, 0.3],
        ].map(([x, z]) => (
          <group key={`${x}${z}`} position={[x, 0, z]}>
            <Part shape="cylinder" args={[0.12, 0.14, 0.42, 6]} position={[0, 0.21, 0]} color={colors.castle} />
            <Part shape="cone" args={[0.14, 0.2, 6]} position={[0, 0.52, 0]} color={colors.castle} />
          </group>
        ))}
        <Part args={[0.3, 0.42, 0.3]} position={[0, 0.45, 0]} color={colors.castle} />
        <Part shape="cylinder" args={[0.01, 0.01, 0.3, 4]} position={[0, 0.8, 0]} color={colors.pole} outline={false} />
        <Part args={[0.14, 0.08, 0.01]} position={[0.07, 0.9, 0]} color={colors.flag} outline={false} />
        <Part args={[0.15, 0.06, 0.15]} position={[0.55, 0.03, -0.35]} color="#3f8fd8" />
      </group>
      {/* rocks and shells */}
      {[
        [3.6, -2.7, 0.35],
        [4.1, -2.2, 0.22],
        [-2.6, 2.7, 0.2],
      ].map(([x, z, s], i) => (
        <Part key={i} shape="sphere" args={[s, 0]} position={[x, s * 0.35, z]} scale={[1.3, 0.8, 1]} color={colors.rock} />
      ))}
      {[
        [-0.2, -2.4],
        [-2.2, 0.4],
        [0.3, 0.2],
      ].map(([x, z], i) => (
        <Part key={i} shape="cone" args={[0.07, 0.04, 5]} position={[x, 0.02, z]} color={colors.shell} outline={false} />
      ))}
      <Shore colors={colors} tideSpeed={tideSpeed} waveHeight={waveHeight} />
      {night || dark ? (
        <group position={[-1.1, 0, 0.1]}>
          <Part args={[0.16, 0.22, 0.16]} position={[0, 0.11, 0]} color="#5a4a3a" />
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.12, 0.12, 0.17]} />
            <meshBasicMaterial color={colors.lantern} toneMapped={false} />
          </mesh>
          <pointLight position={[0, 0.5, 0]} intensity={3} distance={3.5} color={colors.lantern} />
        </group>
      ) : (
        <Gull />
      )}
    </>
  )
}

/** Isometric pixel-art beach with waves, wet sand and a tide cycle. Put any content inside it as children. */
export function BeachTide({ tideSpeed = 1, waveHeight = 1, timeOfDay = 'day', style, children, ...props }: BeachTideProps) {
  const colors = PALETTES[timeOfDay] ?? PALETTES.day
  const night = timeOfDay === 'night'
  return (
    <IsoPixelScene
      {...props}
      night={night}
      style={night ? { background: '#0f1626', ...style } : timeOfDay === 'sunset' ? { background: '#f6d5c0', ...style } : style}
      outlineColor={colors.outline}
      groundColor={colors.sand}
      extent={[10.8, 8.4]}
      target={[0, 0.4, 0]}
      scene={<Diorama colors={colors} tideSpeed={tideSpeed} waveHeight={waveHeight} night={night} />}
    >
      {children}
    </IsoPixelScene>
  )
}
