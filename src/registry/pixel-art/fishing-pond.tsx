'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { IsoPixelScene, Part, useIso, useLoop, type IsoPixelSceneProps } from '@/registry/pixel-art/iso-scene'

/* -------------------------------------------------------------------------------------------------
 * Fishing Pond: a tiny isometric pixel-art pond with someone fishing off a wooden dock.
 * The bobber floats and sends out ripples; every so often there's a bite: the bobber dips,
 * the rod bends, the angler reels in, a little fish flips on the line, then it's let go and
 * the line is cast again. Cattails sway, a dragonfly darts by day and fireflies blink at night.
 * -----------------------------------------------------------------------------------------------*/

const BASE = {
  grass: '#a9d68f',
  grassDark: '#92c47a',
  mud: '#8f7a5a',
  water: '#7cc7d9',
  ripple: '#f0fbff',
  wood: '#b7804b',
  woodDark: '#7f5532',
  skin: '#f2c29b',
  shirt: '#4f7cc9',
  pants: '#3a4a63',
  shoes: '#2f2a28',
  hat: '#e9cf86',
  hatBand: '#c0503e',
  rod: '#5a3b26',
  reed: '#5f9e4f',
  cattail: '#7a4e2e',
  pad: '#5fa35a',
  metal: '#b9c2cc',
  tackle: '#d9483b',
  stone: '#a9a8a2',
  leaf: '#4f9b5a',
  trunk: '#8a5a3a',
  bobber: '#e5483d',
  fish: '#dfe9ef',
  fishBack: '#8fa9b8',
  dragonfly: '#2bb5a8',
  firefly: '#e4ff7a',
  line: '#26303a',
  outline: '#22303a',
}

const PALETTES = {
  day: BASE,
  sunset: {
    ...BASE,
    grass: '#c9c27e',
    grassDark: '#b5ad6c',
    water: '#f3b08f',
    ripple: '#ffe8d6',
    leaf: '#7f9a4f',
    pad: '#7d9a4f',
    reed: '#8a9a4f',
    shirt: '#c9604f',
  },
  night: BASE,
} as const

export type FishingPondTimeOfDay = keyof typeof PALETTES
type Palette = (typeof PALETTES)[FishingPondTimeOfDay]

export interface FishingPondProps extends Omit<IsoPixelSceneProps, 'scene' | 'outlineColor' | 'groundColor' | 'night'> {
  /** Seconds of calm floating between bites. */
  biteInterval?: number
  /** Lighting and colors: day, warm sunset, or night (dark sky + fireflies). */
  timeOfDay?: FishingPondTimeOfDay
}

const POND: [number, number] = [0.6, -0.4]
const POND_R = 2.3
const WATER_TOP = 0.03
const REST = new THREE.Vector3(1.6, WATER_TOP + 0.03, 0.2)
/** Seconds the bite → reel → show → cast sequence takes. */
const ACTION = 4.2

// Scratch vectors (module level so hooks never mutate memoised values).
const tipWorld = new THREE.Vector3()
const end = new THREE.Vector3()
const hang = new THREE.Vector3()
const control = new THREE.Vector3()
const point = new THREE.Vector3()

const ease = (k: number) => k * k * (3 - 2 * k)
const clamp01 = (k: number) => Math.min(1, Math.max(0, k))

/* ---------------------------------------------------------------------------------- the angler -- */

function Fishing({ colors, biteInterval }: { colors: Palette; biteInterval: number }) {
  const torso = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const rod = useRef<THREE.Group>(null)
  const tip = useRef<THREE.Group>(null)
  const tipMarker = useRef<THREE.Object3D>(null)
  const reel = useRef<THREE.Group>(null)
  const bobber = useRef<THREE.Group>(null)
  const fish = useRef<THREE.Group>(null)
  const lineRef = useRef<THREE.Line>(null)
  const rings = useRef<(THREE.Mesh | null)[]>([])

  const SEGMENTS = 14
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array((SEGMENTS + 1) * 3), 3))
    return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: BASE.line }))
  }, [])
  useEffect(
    () => () => {
      line.geometry.dispose()
      ;(line.material as THREE.Material).dispose()
    },
    [line],
  )

  useLoop((t, dt) => {
    const interval = Math.max(1, biteInterval)
    const cycle = interval + ACTION
    const b = (t % cycle) - interval // < 0 while waiting for a bite

    let rodAngle = 0.55 + Math.sin(t * 0.8) * 0.02
    let bend = -0.05
    let tension = 0 // 0 = slack line, 1 = taut
    let fishOut = false
    let inWater = true
    let rippleRate = 0.55
    let rippleSize = 0.5
    let reelSpin = 0

    // Bobber position for the calm and bite phases.
    end.copy(REST)
    end.y += Math.sin(t * 2.2) * 0.012

    if (b >= 0 && b < 0.9) {
      // Bite: twitchy dips.
      const twitch = Math.sin(b * 26) > -0.2 ? 1 : 0.35
      end.y = REST.y - 0.06 * twitch
      bend = -0.3 * twitch
      rodAngle = 0.5
      tension = 0.6
      rippleRate = 2.2
      rippleSize = 0.8
    }

    // Rod pose first, so the tip position is current before we hang the line from it.
    if (b >= 0.9 && b < 2.0) {
      const k = ease((b - 0.9) / 1.1)
      rodAngle = 0.5 + 0.5 * k
      bend = -0.45 * (1 - k * 0.45)
      tension = 1
      reelSpin = 18
    } else if (b >= 2.0 && b < 3.4) {
      rodAngle = 1.0 + Math.sin(b * 6) * 0.03
      bend = -0.22 + Math.sin(b * 14) * 0.05
      tension = 1
    } else if (b >= 3.4) {
      const k = ease((b - 3.4) / (ACTION - 3.4))
      rodAngle = 1.0 - 0.45 * k
      bend = -0.25 * (1 - k)
      tension = 0.3
    }

    if (rod.current) rod.current.rotation.z = rodAngle
    if (tip.current) tip.current.rotation.z = bend
    if (reel.current) reel.current.rotation.z -= reelSpin * dt
    if (torso.current) torso.current.rotation.z = -0.08 + Math.sin(t * 0.9) * 0.02 - (b >= 0.9 && b < 2 ? 0.08 : 0)
    if (head.current) head.current.rotation.y = Math.sin(t * 0.4) * 0.25 + (b >= 0 && b < 0.9 ? 0.2 : 0)

    const parent = lineRef.current
    if (!parent || !tipMarker.current) return
    tipMarker.current.updateWorldMatrix(true, false)
    tipMarker.current.getWorldPosition(tipWorld)
    parent.worldToLocal(tipWorld)

    // Where the fish hangs below the tip once it's out of the water.
    hang.set(tipWorld.x + 0.1, Math.max(WATER_TOP + 0.3, tipWorld.y - 0.7), tipWorld.z)

    if (b >= 0.9 && b < 2.0) {
      const k = ease((b - 0.9) / 1.1)
      end.lerpVectors(REST, hang, k)
      end.y -= Math.sin(k * Math.PI) * 0.1
      fishOut = end.y > WATER_TOP + 0.08
      inWater = !fishOut
      rippleRate = 2.6
      rippleSize = 0.7
    } else if (b >= 2.0 && b < 3.4) {
      end.copy(hang)
      end.x += Math.sin(b * 5) * 0.08
      fishOut = true
      inWater = false
    } else if (b >= 3.4) {
      // Fish released, cast back out in a little arc.
      const k = ease((b - 3.4) / (ACTION - 3.4))
      end.lerpVectors(hang, REST, k)
      end.y += Math.sin(k * Math.PI) * 0.8
      inWater = k > 0.95
    }

    // Line: a bezier from the rod tip to the end, sagging when slack.
    control.lerpVectors(tipWorld, end, 0.5)
    control.y -= 0.35 * (1 - tension)
    const arr = parent.geometry.attributes.position.array as Float32Array
    for (let i = 0; i <= SEGMENTS; i++) {
      const s = i / SEGMENTS
      const a = (1 - s) * (1 - s)
      const m = 2 * (1 - s) * s
      const c = s * s
      point.set(
        a * tipWorld.x + m * control.x + c * end.x,
        a * tipWorld.y + m * control.y + c * end.y,
        a * tipWorld.z + m * control.z + c * end.z,
      )
      arr[i * 3] = point.x
      arr[i * 3 + 1] = point.y
      arr[i * 3 + 2] = point.z
    }
    parent.geometry.attributes.position.needsUpdate = true

    if (bobber.current) {
      bobber.current.position.copy(end)
      if (fishOut) bobber.current.position.y += 0.22
    }
    if (fish.current) {
      fish.current.visible = fishOut
      fish.current.position.copy(end)
      fish.current.rotation.z = Math.PI / 2 + Math.sin(t * 18) * 0.6
      fish.current.rotation.y = Math.sin(t * 7) * 0.5
    }

    rings.current.forEach((ring, i) => {
      if (!ring) return
      const p = (t * rippleRate + i / rings.current.length) % 1
      ring.visible = inWater
      ring.position.set(REST.x, WATER_TOP + 0.005, REST.z)
      ring.scale.setScalar(0.08 + p * rippleSize)
      ;(ring.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.8
    })
  })

  return (
    <group>
      {/* the angler, sitting on the end of the dock facing the pond (+x) */}
      <group position={[-0.85, 0.3, 0.4]}>
        <Part args={[0.32, 0.12, 0.28]} position={[0.06, 0.06, 0]} color={colors.pants} />
        {[-0.08, 0.08].map((z) => (
          <group key={z}>
            <Part args={[0.1, 0.3, 0.1]} position={[0.26, -0.12, z]} color={colors.pants} />
            <Part args={[0.14, 0.07, 0.1]} position={[0.29, -0.29, z]} color={colors.shoes} />
          </group>
        ))}
        <group ref={torso} position={[-0.05, 0.12, 0]}>
          <Part args={[0.2, 0.34, 0.28]} position={[0, 0.17, 0]} color={colors.shirt} />
          {[-0.1, 0.1].map((z) => (
            <Part key={z} args={[0.28, 0.07, 0.07]} position={[0.12, 0.24, z]} rotation={[0, 0, -0.35]} color={colors.shirt} />
          ))}
          <group ref={head} position={[0.02, 0.45, 0]}>
            <Part args={[0.2, 0.2, 0.2]} color={colors.skin} />
            <Part shape="cylinder" args={[0.2, 0.2, 0.03, 12]} position={[0, 0.11, 0]} color={colors.hat} />
            <Part shape="cylinder" args={[0.11, 0.12, 0.11, 10]} position={[0, 0.18, 0]} color={colors.hat} />
            <Part shape="cylinder" args={[0.125, 0.125, 0.03, 10]} position={[0, 0.14, 0]} color={colors.hatBand} outline={false} />
          </group>
          {/* rod, held in both hands */}
          <group ref={rod} position={[0.27, 0.2, 0]}>
            <Part args={[0.26, 0.04, 0.04]} position={[-0.05, 0, 0]} color={colors.woodDark} />
            <group ref={reel} position={[0.04, -0.05, 0]}>
              <Part shape="cylinder" args={[0.04, 0.04, 0.03, 8]} rotation={[Math.PI / 2, 0, 0]} color={colors.metal} />
              <Part args={[0.06, 0.012, 0.012]} position={[0.03, 0, 0.025]} color={colors.shoes} outline={false} />
            </group>
            <Part args={[1.0, 0.05, 0.05]} position={[0.5, 0, 0]} color={colors.rod} />
            <group ref={tip} position={[1.0, 0, 0]}>
              <Part args={[0.8, 0.035, 0.035]} position={[0.4, 0, 0]} color={colors.rod} />
              <object3D ref={tipMarker} position={[0.8, 0, 0]} />
            </group>
          </group>
        </group>
      </group>

      <primitive ref={lineRef} object={line} />

      <group ref={bobber}>
        <Part shape="sphere" args={[0.055, 1]} color={colors.bobber} />
        <Part shape="cylinder" args={[0.045, 0.045, 0.03, 8]} position={[0, 0.03, 0]} color="#f6f3ec" outline={false} />
      </group>

      <group ref={fish} visible={false}>
        <Part args={[0.24, 0.08, 0.06]} color={colors.fish} />
        <Part args={[0.2, 0.025, 0.065]} position={[0, 0.03, 0]} color={colors.fishBack} outline={false} />
        <Part args={[0.08, 0.1, 0.02]} position={[-0.15, 0, 0]} color={colors.fishBack} />
      </group>

      {Array.from({ length: 3 }, (_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          ref={(m) => {
            rings.current[i] = m
          }}
        >
          <ringGeometry args={[0.82, 1, 20]} />
          <meshBasicMaterial color={colors.ripple} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------------------------ scenery -- */

function Dock({ colors }: { colors: Palette }) {
  return (
    <group>
      {Array.from({ length: 6 }, (_, i) => (
        <Part key={i} args={[0.36, 0.06, 0.9]} position={[-2.65 + i * 0.4, 0.27, 0.4]} color={i % 2 ? colors.wood : colors.woodDark} />
      ))}
      {[-0.7, -1.5].flatMap((x) =>
        [0.02, 0.78].map((z) => (
          <Part key={`${x}${z}`} shape="cylinder" args={[0.05, 0.05, 0.36, 6]} position={[x, 0.08, z]} color={colors.woodDark} />
        )),
      )}
      {/* tackle box + bucket */}
      <group position={[-1.75, 0.3, 0.72]} rotation={[0, 0.3, 0]}>
        <Part args={[0.34, 0.16, 0.2]} position={[0, 0.08, 0]} color={colors.tackle} />
        <Part args={[0.34, 0.03, 0.2]} position={[0, 0.17, 0]} color={colors.woodDark} outline={false} />
        <Part args={[0.14, 0.04, 0.03]} position={[0, 0.21, 0]} color={colors.shoes} outline={false} />
      </group>
      <group position={[-1.3, 0.3, 0.08]}>
        <Part shape="cylinder" args={[0.13, 0.1, 0.22, 10]} position={[0, 0.11, 0]} color={colors.metal} />
        <Part shape="cylinder" args={[0.11, 0.11, 0.01, 10]} position={[0, 0.21, 0]} color={colors.water} outline={false} />
      </group>
    </group>
  )
}

function Reed({ position, height, cattail, seed, colors }: { position: [number, number]; height: number; cattail: boolean; seed: number; colors: Palette }) {
  const pivot = useRef<THREE.Group>(null)
  useLoop((t) => {
    if (!pivot.current) return
    pivot.current.rotation.z = Math.sin(t * 1.3 + seed) * 0.08
    pivot.current.rotation.x = Math.sin(t * 0.9 + seed * 1.7) * 0.05
  })
  return (
    <group ref={pivot} position={[position[0], 0, position[1]]}>
      <Part args={[0.04, height, 0.04]} position={[0, height / 2, 0]} color={colors.reed} />
      <Part args={[0.03, height * 0.6, 0.08]} position={[0.05, height * 0.3, 0.03]} rotation={[0.25, 0, -0.2]} color={colors.reed} outline={false} />
      {cattail && <Part shape="cylinder" args={[0.05, 0.05, 0.22, 6]} position={[0, height - 0.08, 0]} color={colors.cattail} />}
    </group>
  )
}

function Dragonfly({ colors }: { colors: Palette }) {
  const fly = useRef<THREE.Group>(null)
  const wings = useRef<THREE.Group>(null)
  useLoop((t) => {
    if (!fly.current) return
    // Dart, pause, dart: a smoothstepped hop between Lissajous points.
    const hop = Math.floor(t * 0.7)
    const k = ease(clamp01(((t * 0.7) % 1) * 2.5))
    const at = (n: number): [number, number, number] => [
      2.1 + Math.sin(n * 2.3) * 0.9,
      0.75 + Math.sin(n * 1.7) * 0.2,
      -1.0 + Math.cos(n * 1.9) * 0.8,
    ]
    const a = at(hop)
    const c = at(hop + 1)
    fly.current.position.set(a[0] + (c[0] - a[0]) * k, a[1] + (c[1] - a[1]) * k + Math.sin(t * 9) * 0.01, a[2] + (c[2] - a[2]) * k)
    fly.current.rotation.y = Math.atan2(-(c[2] - a[2]), c[0] - a[0])
    if (wings.current) wings.current.scale.z = Math.sin(t * 60) > 0 ? 1 : 0.4
  })
  return (
    <group ref={fly}>
      <Part args={[0.2, 0.03, 0.03]} color={colors.dragonfly} outline={false} />
      <group ref={wings} position={[0.03, 0.02, 0]}>
        <Part args={[0.04, 0.005, 0.26]} color="#e8f6ff" outline={false} />
        <Part args={[0.04, 0.005, 0.22]} position={[-0.05, 0, 0]} color="#e8f6ff" outline={false} />
      </group>
    </group>
  )
}

function Fireflies({ colors, count = 10 }: { colors: Palette; count?: number }) {
  const bugs = useRef<(THREE.Mesh | null)[]>([])
  useLoop((t) => {
    bugs.current.forEach((m, i) => {
      if (!m) return
      const a = t * (0.2 + (i % 3) * 0.07) + i * 1.9
      const r = 2.6 + Math.sin(t * 0.3 + i) * 0.6
      m.position.set(POND[0] + Math.cos(a) * r, 0.5 + Math.sin(t * 0.8 + i * 2.2) * 0.3 + (i % 4) * 0.12, POND[1] + Math.sin(a) * r * 0.85)
      const blink = Math.max(0, Math.sin(t * 1.6 + i * 2.7))
      ;(m.material as THREE.MeshBasicMaterial).opacity = blink ** 3
    })
  })
  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            bugs.current[i] = m
          }}
        >
          <boxGeometry args={[0.06, 0.06, 0.06]} />
          <meshBasicMaterial color={colors.firefly} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Diorama({ colors, biteInterval }: { colors: Palette; biteInterval: number }) {
  const { dark } = useIso()
  const reeds = useMemo(
    () =>
      [
        [2.7, -1.6, 0.9, true],
        [2.9, -1.25, 0.7, false],
        [2.5, -2.0, 1.0, true],
        [2.75, -1.95, 0.6, false],
        [3.0, -0.85, 0.8, true],
        [-1.3, -1.85, 0.8, true],
        [-1.55, -1.5, 0.6, false],
        [-1.1, -2.15, 0.7, true],
      ] as const,
    [],
  )
  return (
    <>
      {/* ground + pond */}
      <Part args={[8, 0.5, 7]} position={[0, -0.25, 0]} color={colors.grass} />
      {[
        [-3.1, -2.7],
        [3.2, 2.6],
        [-3.3, 2.4],
      ].map(([x, z]) => (
        <Part key={`${x}${z}`} args={[0.8, 0.02, 0.6]} position={[x, 0.01, z]} color={colors.grassDark} outline={false} />
      ))}
      <Part shape="cylinder" args={[POND_R + 0.14, POND_R + 0.14, 0.03, 28]} position={[POND[0], 0.012, POND[1]]} color={colors.mud} outline={false} />
      <Part shape="cylinder" args={[POND_R, POND_R, 0.05, 28]} position={[POND[0], 0.005, POND[1]]} color={colors.water} outline={false} />
      {[
        [0.2, -1.6, 0.9],
        [-0.3, -0.9, 0.7],
        [1.9, -1.9, 0.8],
      ].map(([x, z, s], i) => (
        <group key={i} position={[x, WATER_TOP + 0.01, z]} scale={s} rotation={[0, i * 1.7, 0]}>
          <Part shape="cylinder" args={[0.26, 0.26, 0.02, 10]} color={colors.pad} />
          <Part args={[0.16, 0.025, 0.05]} position={[0.18, 0.002, 0]} color={colors.water} outline={false} />
        </group>
      ))}
      {[
        [-1.75, 0.9, 0.22],
        [2.9, 0.3, 0.2],
        [1.6, 1.85, 0.26],
        [-0.6, -2.55, 0.2],
      ].map(([x, z, s], i) => (
        <Part key={i} shape="sphere" args={[s, 0]} position={[x, s * 0.4, z]} scale={[1.2, 0.7, 1]} color={colors.stone} />
      ))}
      {/* tree */}
      <group position={[-3.1, 0, -2.6]}>
        <Part shape="cylinder" args={[0.1, 0.13, 0.7, 6]} position={[0, 0.35, 0]} color={colors.trunk} />
        <Part shape="sphere" args={[0.55, 0]} position={[0, 1.0, 0]} color={colors.leaf} />
        <Part shape="sphere" args={[0.36, 0]} position={[0.2, 1.4, 0.1]} color={colors.leaf} />
      </group>
      {reeds.map(([x, z, h, cat], i) => (
        <Reed key={i} position={[x, z]} height={h} cattail={cat} seed={i * 1.3} colors={colors} />
      ))}
      <Dock colors={colors} />
      <Fishing colors={colors} biteInterval={biteInterval} />
      {dark ? <Fireflies colors={colors} /> : <Dragonfly colors={colors} />}
    </>
  )
}

/** Isometric pixel-art fishing pond. Put any content inside it as children. */
export function FishingPond({ biteInterval = 7, timeOfDay = 'day', style, children, ...props }: FishingPondProps) {
  const colors = PALETTES[timeOfDay] ?? PALETTES.day
  const night = timeOfDay === 'night'
  return (
    <IsoPixelScene
      {...props}
      night={night}
      style={night ? { background: '#0f1626', ...style } : style}
      outlineColor={colors.outline}
      groundColor={colors.grass}
      extent={[10.6, 8.4]}
      target={[0, 0.6, 0]}
      scene={<Diorama colors={colors} biteInterval={biteInterval} />}
    >
      {children}
    </IsoPixelScene>
  )
}
