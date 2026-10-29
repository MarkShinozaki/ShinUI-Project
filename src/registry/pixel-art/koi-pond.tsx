'use client'

import { useMemo, useRef } from 'react'
import type * as THREE from 'three'
import { IsoPixelScene, Part, useIso, useLoop, type IsoPixelSceneProps } from '@/registry/pixel-art/iso-scene'

/* -------------------------------------------------------------------------------------------------
 * Koi Pond: a tiny isometric pixel-art garden pond.
 * Koi wander on smooth looping paths under a see-through water surface with spreading ripples,
 * lily pads bob, stones ring the edge, and an arched bridge and stone lantern sit on the banks
 * (the lantern glows in dark mode).
 * -----------------------------------------------------------------------------------------------*/

const C = {
  grass: '#b9dca0',
  grassDark: '#9fcb88',
  bed: '#5d9ca8',
  water: '#8fd6e4',
  ripple: '#e9fbff',
  stone: '#a9a8a2',
  stoneDark: '#8c8b86',
  stoneLight: '#c4c2bb',
  pad: '#5fa35a',
  padDark: '#4c8c4a',
  flower: '#ff9cc0',
  bridge: '#d9503e',
  plank: '#b7804b',
  lanternGlow: '#ffd27a',
  pine: '#3f7f4f',
  trunk: '#7d5636',
  outline: '#22303a',
}

/** Koi coat patterns: [body, patches, fins]. */
const COATS = [
  ['#fbf7ef', '#ef5a2f', '#fbf7ef'], // kohaku
  ['#ffb23f', '#ffd27a', '#ffcf7a'], // yamabuki
  ['#fbf7ef', '#2a2a30', '#fbf7ef'], // shiro utsuri
  ['#ef5a2f', '#fbf7ef', '#ff8a5c'], // aka
  ['#f2efe6', '#ef5a2f', '#2a2a30'], // sanke
  ['#ffd27a', '#ef5a2f', '#ffe6a8'],
  ['#e6e8ee', '#5c78a8', '#e6e8ee'], // asagi
] as const

const POND_R = 2.5
const WATER_Y = 0.16

export interface KoiPondProps extends Omit<IsoPixelSceneProps, 'scene' | 'outlineColor' | 'groundColor'> {
  /** How many koi are swimming (1–7). */
  koiCount?: number
  /** Show the arched bridge. */
  showBridge?: boolean
}

/** A smooth wandering path that stays inside the pond. */
function koiPath(t: number, seed: number): [number, number] {
  const angle = t * (0.25 + seed * 0.05) * (seed % 2 ? 1 : -1) + seed * 2.1
  const radius = 1.15 + Math.sin(t * 0.37 + seed * 1.3) * 0.55 + Math.sin(t * 0.83 + seed) * 0.2
  return [Math.cos(angle) * radius, Math.sin(angle) * radius]
}

function Koi({ seed }: { seed: number }) {
  const fish = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const tail = useRef<THREE.Group>(null)
  const [skin, patch, fin] = COATS[seed % COATS.length]
  const size = 0.85 + ((seed * 37) % 10) / 30

  useLoop((t) => {
    const [x, z] = koiPath(t, seed)
    const [nx, nz] = koiPath(t + 0.05, seed)
    if (fish.current) {
      fish.current.position.set(x, 0.1 + Math.sin(t * 0.7 + seed) * 0.012, z)
      fish.current.rotation.y = Math.atan2(-(nz - z), nx - x)
    }
    const wag = Math.sin(t * 7 + seed * 3)
    if (body.current) body.current.rotation.y = wag * 0.1
    if (tail.current) tail.current.rotation.y = wag * 0.6
  })

  return (
    <group ref={fish} scale={size}>
      <group ref={body}>
        <Part args={[0.36, 0.08, 0.15]} color={skin} />
        <Part args={[0.15, 0.075, 0.12]} position={[0.24, 0, 0]} color={skin} />
        <Part args={[0.14, 0.012, 0.1]} position={[0.03, 0.045, 0.01]} color={patch} outline={false} />
        <Part args={[0.08, 0.012, 0.08]} position={[0.22, 0.042, -0.01]} color={patch} outline={false} />
        <Part args={[0.08, 0.01, 0.1]} position={[0.08, -0.02, 0.11]} rotation={[0, -0.5, 0]} color={fin} outline={false} />
        <Part args={[0.08, 0.01, 0.1]} position={[0.08, -0.02, -0.11]} rotation={[0, 0.5, 0]} color={fin} outline={false} />
      </group>
      <group ref={tail} position={[-0.18, 0, 0]}>
        <Part args={[0.12, 0.06, 0.08]} position={[-0.05, 0, 0]} color={skin} />
        <Part args={[0.12, 0.015, 0.2]} position={[-0.15, 0, 0]} color={fin} />
      </group>
    </group>
  )
}

function Ripples({ count = 4 }: { count?: number }) {
  const rings = useRef<(THREE.Mesh | null)[]>([])
  const spots = useRef<[number, number][]>(Array.from({ length: count }, () => [0, 0]))
  const last = useRef<number[]>(Array.from({ length: count }, () => -1))

  useLoop((t) => {
    rings.current.forEach((ring, i) => {
      if (!ring) return
      const cycle = t * 0.35 + i / count
      const p = cycle % 1
      const n = Math.floor(cycle)
      if (n !== last.current[i]) {
        // New ripple: pick a fresh spot (deterministic, so it looks random but stays stable).
        last.current[i] = n
        const a = Math.sin(n * 12.9898 + i * 78.233) * 43758.5453
        const r = (a - Math.floor(a)) * (POND_R - 0.7)
        const b = (a * 7.13) % (Math.PI * 2)
        spots.current[i] = [Math.cos(b) * r, Math.sin(b) * r]
      }
      const [x, z] = spots.current[i]
      ring.position.set(x, WATER_Y + 0.01, z)
      ring.scale.setScalar(0.1 + p * 0.6)
      ;(ring.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.8
    })
  })

  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          ref={(m) => {
            rings.current[i] = m
          }}
        >
          <ringGeometry args={[0.8, 1, 20]} />
          <meshBasicMaterial color={C.ripple} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function LilyPad({ position, size = 1, flower = false, seed }: { position: [number, number]; size?: number; flower?: boolean; seed: number }) {
  const pad = useRef<THREE.Group>(null)
  useLoop((t) => {
    if (!pad.current) return
    pad.current.position.y = WATER_Y + 0.015 + Math.sin(t * 1.2 + seed) * 0.01
    pad.current.rotation.y = seed + Math.sin(t * 0.3 + seed) * 0.2
  })
  return (
    <group ref={pad} position={[position[0], WATER_Y, position[1]]} scale={size}>
      <Part shape="cylinder" args={[0.26, 0.26, 0.025, 10]} color={C.pad} />
      {/* the notch */}
      <Part args={[0.16, 0.03, 0.05]} position={[0.18, 0.002, 0]} color={C.water} outline={false} />
      {flower && (
        <group position={[-0.06, 0.05, 0.02]}>
          <Part shape="cone" args={[0.09, 0.1, 6]} color={C.flower} />
          <Part shape="sphere" args={[0.035, 0]} position={[0, 0.04, 0]} color="#ffe27a" outline={false} />
        </group>
      )}
    </group>
  )
}

function Stones() {
  const stones = useMemo(() => {
    const list: { x: number; z: number; s: number; color: string; rot: number }[] = []
    const n = 22
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      const wobble = Math.sin(i * 2.7) * 0.1
      const s = 0.22 + ((i * 7) % 5) * 0.04
      list.push({
        x: Math.cos(a) * (POND_R + 0.1 + wobble),
        z: Math.sin(a) * (POND_R + 0.1 + wobble),
        s,
        color: [C.stone, C.stoneDark, C.stoneLight][i % 3],
        rot: i * 1.3,
      })
    }
    return list
  }, [])
  return (
    <group>
      {stones.map((st, i) => (
        <Part
          key={i}
          shape="sphere"
          args={[st.s, 0]}
          position={[st.x, st.s * 0.45, st.z]}
          rotation={[0, st.rot, 0]}
          scale={[1.15, 0.7, 1]}
          color={st.color}
        />
      ))}
    </group>
  )
}

function Bridge() {
  const planks = 9
  const span = 3.3
  const rise = 0.45
  return (
    <group position={[0, 0, 1.95]}>
      {Array.from({ length: planks }, (_, i) => {
        const u = i / (planks - 1)
        const x = -span / 2 + u * span
        const y = 0.22 + Math.sin(u * Math.PI) * rise
        const slope = Math.atan(Math.cos(u * Math.PI) * ((rise * Math.PI) / span))
        return <Part key={i} args={[0.4, 0.07, 0.62]} position={[x, y, 0]} rotation={[0, 0, slope]} color={C.plank} />
      })}
      {[-0.34, 0.34].map((z) =>
        Array.from({ length: 5 }, (_, i) => {
          const u = i / 4
          const x = -span / 2 + 0.1 + u * (span - 0.2)
          const y = 0.22 + Math.sin(u * Math.PI) * rise
          return (
            <group key={`${z}${i}`}>
              <Part args={[0.07, 0.36, 0.07]} position={[x, y + 0.18, z]} color={C.bridge} />
              {i < 4 && (
                <Part
                  args={[span / 4 - 0.1, 0.06, 0.06]}
                  position={[x + (span - 0.2) / 8, 0.22 + Math.sin((u + 0.125) * Math.PI) * rise + 0.34, z]}
                  rotation={[0, 0, Math.atan(Math.cos((u + 0.125) * Math.PI) * ((rise * Math.PI) / span))]}
                  color={C.bridge}
                />
              )}
            </group>
          )
        }),
      )}
    </group>
  )
}

function StoneLantern({ position }: { position: [number, number, number] }) {
  const { dark } = useIso()
  const glow = useRef<THREE.MeshBasicMaterial>(null)
  const light = useRef<THREE.PointLight>(null)
  useLoop((t) => {
    const flicker = 0.85 + Math.sin(t * 9) * Math.sin(t * 5.1) * 0.15
    glow.current?.color.set(dark ? C.lanternGlow : '#e8d9b0').multiplyScalar(dark ? 0.8 + flicker * 0.3 : 1)
    if (light.current) light.current.intensity = dark ? 6 * flicker : 0
  })
  return (
    <group position={position}>
      <Part args={[0.5, 0.12, 0.5]} position={[0, 0.06, 0]} color={C.stoneDark} />
      <Part shape="cylinder" args={[0.1, 0.12, 0.5, 6]} position={[0, 0.37, 0]} color={C.stone} />
      <Part args={[0.42, 0.08, 0.42]} position={[0, 0.66, 0]} color={C.stoneDark} />
      <Part args={[0.32, 0.26, 0.32]} position={[0, 0.83, 0]} color={C.stone} />
      <mesh position={[0, 0.83, 0]}>
        <boxGeometry args={[0.34, 0.14, 0.14]} />
        <meshBasicMaterial ref={glow} color={C.lanternGlow} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.83, 0]}>
        <boxGeometry args={[0.14, 0.14, 0.34]} />
        <meshBasicMaterial color={dark ? C.lanternGlow : '#e8d9b0'} toneMapped={false} />
      </mesh>
      <Part shape="cone" args={[0.38, 0.26, 4]} position={[0, 1.09, 0]} rotation={[0, Math.PI / 4, 0]} color={C.stoneDark} />
      <Part shape="sphere" args={[0.06, 0]} position={[0, 1.25, 0]} color={C.stone} outline={false} />
      <pointLight ref={light} position={[0.3, 0.85, 0.3]} color={C.lanternGlow} distance={5} decay={2} />
    </group>
  )
}

function Pine({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <Part shape="cylinder" args={[0.08, 0.11, 0.6, 6]} position={[0, 0.3, 0]} color={C.trunk} />
      <Part shape="cone" args={[0.55, 0.6, 7]} position={[0, 0.8, 0]} color={C.pine} />
      <Part shape="cone" args={[0.42, 0.5, 7]} position={[0, 1.15, 0]} color={C.pine} />
      <Part shape="cone" args={[0.28, 0.42, 7]} position={[0, 1.45, 0]} color={C.pine} />
    </group>
  )
}

function Diorama({ koiCount, showBridge }: { koiCount: number; showBridge: boolean }) {
  const count = Math.min(7, Math.max(1, Math.round(koiCount)))
  return (
    <>
      {/* ground with the pond basin */}
      <Part args={[8, 0.5, 7]} position={[0, -0.25, 0]} color={C.grass} />
      {[
        [-3.2, -2.8],
        [3.1, 2.7],
        [3.3, -1.2],
      ].map(([x, z]) => (
        <Part key={`${x}${z}`} args={[0.8, 0.02, 0.6]} position={[x, 0.01, z]} color={C.grassDark} outline={false} />
      ))}
      <Part shape="cylinder" args={[POND_R + 0.05, POND_R + 0.05, 0.04, 28]} position={[0, 0.02, 0]} color={C.bed} outline={false} />
      {Array.from({ length: count }, (_, i) => (
        <Koi key={i} seed={i} />
      ))}
      {/* see-through water surface */}
      <mesh position={[0, WATER_Y, 0]}>
        <cylinderGeometry args={[POND_R + 0.05, POND_R + 0.05, 0.02, 28]} />
        <meshBasicMaterial color={C.water} transparent opacity={0.3} depthWrite={false} toneMapped={false} />
      </mesh>
      <Ripples />
      <LilyPad seed={1} position={[-1.3, -0.9]} flower />
      <LilyPad seed={2} position={[-0.8, -1.5]} size={0.8} />
      <LilyPad seed={3} position={[1.5, -0.6]} size={1.1} />
      <LilyPad seed={4} position={[1.1, 0.4]} size={0.7} flower />
      <LilyPad seed={5} position={[-1.7, 0.3]} size={0.9} />
      <Stones />
      {showBridge && <Bridge />}
      <StoneLantern position={[-3.0, 0, -1.6]} />
      <Pine position={[3.1, 0, -2.6]} />
      <Pine position={[-3.3, 0, 2.6]} scale={0.8} />
    </>
  )
}

/** Isometric pixel-art koi pond. Put any content inside it as children. */
export function KoiPond({ koiCount = 5, showBridge = true, children, ...props }: KoiPondProps) {
  return (
    <IsoPixelScene
      {...props}
      outlineColor={C.outline}
      groundColor={C.grass}
      extent={[10.6, 8.2]}
      target={[0, 0.5, 0]}
      scene={<Diorama koiCount={koiCount} showBridge={showBridge} />}
    >
      {children}
    </IsoPixelScene>
  )
}
