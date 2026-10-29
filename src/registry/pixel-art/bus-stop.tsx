'use client'

import { useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { IsoPixelScene, Part, useCanvasTexture, useIso, useLoop, type IsoPixelSceneProps } from '@/registry/pixel-art/iso-scene'

/* -------------------------------------------------------------------------------------------------
 * Bus Stop: an isometric pixel-art street corner. Someone strolls up to the stop and waits,
 * glancing down the road; the bus pulls in and brakes, the doors slide open, they hop on, the
 * doors close and the bus pulls away. Then the next rider walks up and it all starts again.
 * Three distinct buses: a city commuter, a yellow school bus and a red double-decker.
 * -----------------------------------------------------------------------------------------------*/

const C = {
  road: '#5d6170',
  roadEdge: '#4d5160',
  lane: '#f2efe6',
  curb: '#c9c4ba',
  walk: '#dcd6ca',
  walkLine: '#cbc4b6',
  grass: '#9fcf86',
  post: '#6f7785',
  roof: '#3f6fb8',
  glass: '#bfe3f2',
  bench: '#b7804b',
  sign: '#2f7de1',
  skin: '#f2c29b',
  hair: '#3a2a26',
  coat: '#e0703a',
  pants: '#36405a',
  shoe: '#2f2a28',
  bag: '#5a8a5a',
  tire: '#2a2a30',
  hub: '#b9c2cc',
  window: '#2c3a4e',
  windowLit: '#ffe9a8',
  leaf: '#4f9b5a',
  trunk: '#8a5a3a',
  lamp: '#fff1b0',
  outline: '#26303a',
}

export type BusType = 'commuter' | 'school' | 'double-decker'

interface BusSpec {
  length: number
  height: number
  body: string
  trim: string
  /** Distance of the door center from the bus center (toward the front). */
  door: number
}

const BUSES: Record<BusType, BusSpec> = {
  commuter: { length: 4.4, height: 1.25, body: '#eef1f4', trim: '#2f7de1', door: 1.55 },
  school: { length: 4.0, height: 1.3, body: '#f2b705', trim: '#2a2a30', door: 0.95 },
  'double-decker': { length: 3.8, height: 2.25, body: '#d8322e', trim: '#f2e6c8', door: 1.35 },
}

export interface BusStopProps extends Omit<IsoPixelSceneProps, 'scene' | 'outlineColor' | 'groundColor'> {
  /** Which bus serves the stop. */
  busType?: BusType
  /** Seconds the rider waits at the stop before the bus shows up. */
  waitTime?: number
  /** Color of the rider's coat. */
  coatColor?: string
}

const LANE_Z = -0.55
const BUS_W = 1.2
const CURB_Z = 0.55
const STOP_X = 0.4
const RIDER_Z = 1.55
const EDGE = 5.05

// Timeline (seconds). The wait slot is the `waitTime` prop.
const WALK_IN = 2.6
const ARRIVE = 3
const OPEN = 0.6
const BOARD = 1.6
const CLOSE = 0.6
const DEPART = 3.2

const ease = (k: number) => k * k * (3 - 2 * k)
const clamp01 = (k: number) => Math.min(1, Math.max(0, k))

/** Clip anything outside the diorama's x range (the bus enters and leaves through the edges). */
function useEdgeClipping(anchor: RefObject<THREE.Group | null>) {
  const renderer = useRef<THREE.WebGLRenderer | null>(null)
  const planes = useMemo(() => [new THREE.Plane(), new THREE.Plane()], [])
  const base = useMemo(
    () => [new THREE.Plane(new THREE.Vector3(1, 0, 0), EDGE), new THREE.Plane(new THREE.Vector3(-1, 0, 0), EDGE)],
    [],
  )
  // Drop the planes again when the scene unmounts.
  useEffect(
    () => () => {
      if (renderer.current) renderer.current.clippingPlanes = []
    },
    [],
  )
  // Follow the turntable so auto-rotate keeps clipping in the diorama's own space.
  useFrame(({ gl }) => {
    renderer.current = gl
    if (gl.clippingPlanes !== planes) gl.clippingPlanes = planes
    const m = anchor.current?.matrixWorld
    if (!m) return
    planes.forEach((p, i) => p.copy(base[i]).applyMatrix4(m))
  })
}

/* ------------------------------------------------------------------------------------- rider -- */

interface RiderPose {
  x: number
  z: number
  y: number
  facing: number
  walk: number
  visible: boolean
  look: number
  watch: number
}

function Rider({ pose, coat }: { pose: RefObject<RiderPose>; coat: string }) {
  const root = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const legs = useRef<(THREE.Group | null)[]>([])
  const arms = useRef<(THREE.Group | null)[]>([])
  useFrame(() => {
    const p = pose.current
    if (!root.current) return
    root.current.visible = p.visible
    root.current.position.set(p.x, p.y + Math.abs(Math.sin(p.walk * 2)) * 0.03, p.z)
    root.current.rotation.y = p.facing
    const swing = Math.sin(p.walk * 2) * 0.6
    legs.current[0]?.rotation.set(swing, 0, 0)
    legs.current[1]?.rotation.set(-swing, 0, 0)
    arms.current[0]?.rotation.set(-swing * 0.8, 0, 0)
    // Right arm swings while walking, or lifts to check the watch.
    arms.current[1]?.rotation.set(swing * 0.8 * (1 - p.watch) - p.watch * 1.3, 0, -p.watch * 0.5)
    if (head.current) head.current.rotation.y = p.look
  })
  return (
    <group ref={root}>
      {[0, 1].map((i) => (
        <group key={i} ref={(g) => void (legs.current[i] = g)} position={[i ? 0.08 : -0.08, 0.42, 0]}>
          <Part args={[0.11, 0.38, 0.12]} position={[0, -0.2, 0]} color={C.pants} />
          <Part args={[0.12, 0.06, 0.18]} position={[0, -0.39, 0.03]} color={C.shoe} outline={false} />
        </group>
      ))}
      <Part args={[0.32, 0.42, 0.2]} position={[0, 0.62, 0]} color={coat} />
      <Part args={[0.22, 0.24, 0.08]} position={[0, 0.62, -0.13]} color={C.bag} />
      {[0, 1].map((i) => (
        <group key={i} ref={(g) => void (arms.current[i] = g)} position={[i ? 0.21 : -0.21, 0.8, 0]}>
          <Part args={[0.09, 0.36, 0.1]} position={[0, -0.17, 0]} color={coat} />
          <Part args={[0.08, 0.07, 0.08]} position={[0, -0.37, 0]} color={C.skin} outline={false} />
        </group>
      ))}
      <group ref={head} position={[0, 0.98, 0]}>
        <Part args={[0.24, 0.24, 0.24]} color={C.skin} />
        <Part args={[0.26, 0.09, 0.26]} position={[0, 0.12, -0.01]} color={C.hair} outline={false} />
        <Part args={[0.26, 0.16, 0.06]} position={[0, 0.04, -0.12]} color={C.hair} outline={false} />
      </group>
    </group>
  )
}

/* --------------------------------------------------------------------------------------- bus -- */

function Wheel({ x, z, r, spin }: { x: number; z: number; r: number; spin: RefObject<number> }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (ref.current) ref.current.rotation.z = -spin.current / r
  })
  return (
    <group position={[x, r, z]}>
      <group ref={ref}>
        <Part shape="cylinder" args={[r, r, 0.16, 8]} rotation={[Math.PI / 2, 0, 0]} color={C.tire} />
        <Part args={[r * 0.9, 0.06, 0.17]} color={C.hub} outline={false} />
      </group>
    </group>
  )
}

/** Sliding door: two leaves that part along the bus side. `open` is 0..1. */
function Door({ x, height, width, open }: { x: number; height: number; width: number; open: RefObject<number> }) {
  const leaves = useRef<(THREE.Group | null)[]>([])
  useFrame(() => {
    const o = open.current * width * 0.48
    leaves.current.forEach((leaf, i) => {
      if (leaf) leaf.position.x = (i ? 1 : -1) * (width / 4 + o)
    })
  })
  const z = BUS_W / 2
  return (
    <group position={[x, 0, z]}>
      <Part args={[width, height, 0.02]} position={[0, 0.22 + height / 2, 0.005]} color="#1c222c" outline={false} />
      {[0, 1].map((i) => (
        <group key={i} ref={(g) => void (leaves.current[i] = g)} position={[(i ? 1 : -1) * (width / 4), 0, 0]}>
          <Part args={[width / 2 - 0.02, height, 0.03]} position={[0, 0.22 + height / 2, 0.02]} color="#9fb0c0" outline={false} />
          <Part args={[width / 2 - 0.1, height * 0.55, 0.035]} position={[0, 0.22 + height * 0.62, 0.025]} color={C.window} outline={false} />
        </group>
      ))}
    </group>
  )
}

function WindowStrip({ from, to, y, h, gap = 0.08, pane = 0.55, lit }: { from: number; to: number; y: number; h: number; gap?: number; pane?: number; lit: boolean }) {
  const panes: number[] = []
  for (let x = from + pane / 2; x <= to - pane / 2 + 0.001; x += pane + gap) panes.push(x)
  return (
    <>
      {panes.map((x) => (
        <Part key={x} args={[pane, h, 0.02]} position={[x, y, BUS_W / 2 + 0.005]} color={lit ? C.windowLit : C.window} outline={false} />
      ))}
    </>
  )
}

function Lamp({ position, color, on }: { position: [number, number, number]; color: string; on?: RefObject<boolean> }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (ref.current && on) ref.current.visible = on.current
  })
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.06, 0.1, 0.16]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

function BusModel({ type, door, spin, flash }: { type: BusType; door: RefObject<number>; spin: RefObject<number>; flash: RefObject<boolean> }) {
  const { dark } = useIso()
  const spec = BUSES[type]
  const L = spec.length
  const front = L / 2
  const wheelR = 0.26
  const sign = useCanvasTexture(
    64,
    12,
    (ctx) => {
      ctx.fillStyle = '#121418'
      ctx.fillRect(0, 0, 64, 12)
      ctx.fillStyle = type === 'school' ? '#ffd23a' : '#ffb02e'
      ctx.font = 'bold 9px monospace'
      ctx.textBaseline = 'middle'
      ctx.fillText(type === 'school' ? 'SCHOOL' : type === 'double-decker' ? '24 CENTRE' : '12 HARBOR', 3, 6.5)
    },
    type,
  )

  let body: ReactNode
  if (type === 'commuter') {
    body = (
      <>
        <Part args={[L, spec.height, BUS_W]} position={[0, 0.22 + spec.height / 2, 0]} color={spec.body} />
        <Part args={[L + 0.01, 0.12, BUS_W + 0.01]} position={[0, 0.5, 0]} color={spec.trim} outline={false} />
        <Part args={[L + 0.01, 0.05, BUS_W + 0.01]} position={[0, 1.28, 0]} color={spec.trim} outline={false} />
        <WindowStrip from={-front + 0.2} to={front - 0.95} y={1.0} h={0.42} lit={dark} />
        {/* big flat windscreen and roof pod */}
        <Part args={[0.02, 0.55, BUS_W - 0.14]} position={[front + 0.005, 1.0, 0]} color={C.window} outline={false} />
        <Part args={[1.3, 0.16, 0.8]} position={[-0.4, 0.22 + spec.height + 0.08, 0]} color="#c9ced6" />
        <mesh position={[front + 0.012, 1.38, 0]}>
          <boxGeometry args={[0.01, 0.12, 0.7]} />
          <meshBasicMaterial map={sign} toneMapped={false} />
        </mesh>
        <Door x={spec.door} height={0.95} width={0.6} open={door} />
        <Door x={-0.35} height={0.95} width={0.6} open={door} />
      </>
    )
  } else if (type === 'school') {
    // Conventional nose: the hood sticks out ahead of the boxy cabin.
    const cab = L - 0.75
    const cabX = -0.375
    body = (
      <>
        <Part args={[cab, spec.height, BUS_W]} position={[cabX, 0.22 + spec.height / 2, 0]} color={spec.body} />
        <Part args={[0.75, 0.55, BUS_W - 0.16]} position={[front - 0.375, 0.5, 0]} color={spec.body} />
        <Part args={[0.06, 0.3, BUS_W - 0.3]} position={[front + 0.01, 0.48, 0]} color="#c9ced6" outline={false} />
        <Part args={[0.2, 0.08, BUS_W - 0.1]} position={[front - 0.05, 0.24, 0]} color={C.tire} outline={false} />
        {[0.42, 0.72, 1.32].map((y) => (
          <Part key={y} args={[cab + 0.01, 0.04, BUS_W + 0.01]} position={[cabX, y, 0]} color={spec.trim} outline={false} />
        ))}
        <WindowStrip from={cabX - cab / 2 + 0.15} to={cabX + cab / 2 - 0.7} y={1.04} h={0.34} pane={0.36} gap={0.1} lit={dark} />
        <Part args={[0.02, 0.45, BUS_W - 0.14]} position={[cabX + cab / 2 + 0.005, 1.05, 0]} color={C.window} outline={false} />
        <mesh position={[cabX + cab / 2 + 0.012, 1.42, 0]}>
          <boxGeometry args={[0.01, 0.12, 0.7]} />
          <meshBasicMaterial map={sign} toneMapped={false} />
        </mesh>
        <Door x={spec.door} height={0.95} width={0.5} open={door} />
        {/* red warning lights flash while stopped */}
        {[-0.4, 0.4].map((z) => (
          <Lamp key={z} position={[cabX + cab / 2 + 0.02, 1.42, z]} color="#ff3b30" on={flash} />
        ))}
        {[-0.4, 0.4].map((z) => (
          <Lamp key={`r${z}`} position={[cabX - cab / 2 - 0.02, 1.42, z]} color="#ff3b30" on={flash} />
        ))}
      </>
    )
  } else {
    body = (
      <>
        <Part args={[L, spec.height, BUS_W]} position={[0, 0.22 + spec.height / 2, 0]} color={spec.body} />
        <Part args={[L - 0.1, 0.08, BUS_W - 0.1]} position={[0, 0.22 + spec.height + 0.04, 0]} color={spec.body} />
        <Part args={[L + 0.01, 0.1, BUS_W + 0.01]} position={[0, 1.33, 0]} color={spec.trim} outline={false} />
        <WindowStrip from={-front + 0.15} to={front - 0.1} y={1.88} h={0.4} pane={0.5} gap={0.07} lit={dark} />
        <WindowStrip from={-front + 0.15} to={front - 0.85} y={1.0} h={0.4} pane={0.5} gap={0.07} lit={dark} />
        <Part args={[0.02, 0.42, BUS_W - 0.14]} position={[front + 0.005, 1.0, 0]} color={C.window} outline={false} />
        <Part args={[0.02, 0.4, BUS_W - 0.14]} position={[front + 0.005, 1.88, 0]} color={C.window} outline={false} />
        <mesh position={[front + 0.012, 1.4, 0]}>
          <boxGeometry args={[0.01, 0.12, 0.8]} />
          <meshBasicMaterial map={sign} toneMapped={false} />
        </mesh>
        <Door x={spec.door} height={0.95} width={0.55} open={door} />
      </>
    )
  }
  const axles = type === 'school' ? [front - 0.55, -front + 0.75] : [front - 0.7, -front + 0.75]
  return (
    <>
      {body}
      {axles.flatMap((x) => [BUS_W / 2 - 0.12, -BUS_W / 2 + 0.12].map((z) => <Wheel key={`${x}${z}`} x={x} z={z} r={wheelR} spin={spin} />))}
      {/* headlights and tail lights */}
      {[-0.4, 0.4].map((z) => (
        <Lamp key={`h${z}`} position={[front + 0.02, 0.42, z]} color={dark ? '#fff6c8' : '#f4f0e0'} />
      ))}
      {[-0.42, 0.42].map((z) => (
        <Lamp key={`t${z}`} position={[-front - 0.02, 0.46, z]} color="#d8322e" />
      ))}
    </>
  )
}

/* ---------------------------------------------------------------------------------- the stop -- */

function Street() {
  const { dark } = useIso()
  const sign = useCanvasTexture(
    24,
    24,
    (ctx) => {
      ctx.fillStyle = C.sign
      ctx.beginPath()
      ctx.arc(12, 12, 11, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(6, 7, 12, 8)
      ctx.fillStyle = C.sign
      ctx.fillRect(7, 8, 4, 3)
      ctx.fillRect(13, 8, 4, 3)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(7, 15, 3, 2)
      ctx.fillRect(14, 15, 3, 2)
    },
    'bus-sign',
  )
  return (
    <>
      {/* road and sidewalk */}
      <Part args={[10, 0.5, 4.1]} position={[0, -0.25, -1.45]} color={C.road} />
      <Part args={[10, 0.62, 2.9]} position={[0, -0.19, 2.05]} color={C.walk} />
      <Part args={[10, 0.14, 0.14]} position={[0, 0.05, CURB_Z + 0.07]} color={C.curb} outline={false} />
      {Array.from({ length: 7 }, (_, i) => (
        <Part key={i} args={[0.7, 0.01, 0.08]} position={[-4.3 + i * 1.45, 0.005, -2.1]} color={C.lane} outline={false} />
      ))}
      <Part args={[10, 0.01, 0.06]} position={[0, 0.005, -3.3]} color={C.lane} outline={false} />
      {/* bus bay markings */}
      <Part args={[3.6, 0.01, 0.06]} position={[0.2, 0.006, 0.4]} color="#f2c94c" outline={false} />
      {Array.from({ length: 9 }, (_, i) => (
        <Part key={i} args={[0.02, 0.005, 2.7]} position={[-4.5 + i * 1.12, 0.122, 2.05]} color={C.walkLine} outline={false} />
      ))}
      {/* shelter */}
      <group position={[-2.0, 0.12, 1.75]}>
        {[
          [-0.85, -0.45],
          [0.85, -0.45],
          [-0.85, 0.45],
          [0.85, 0.45],
        ].map(([x, z]) => (
          <Part key={`${x}${z}`} args={[0.06, 1.5, 0.06]} position={[x, 0.75, z]} color={C.post} />
        ))}
        <Part args={[1.9, 0.08, 1.1]} position={[0, 1.54, 0]} color={C.roof} />
        <mesh position={[0, 0.85, 0.45]}>
          <boxGeometry args={[1.66, 1.1, 0.03]} />
          <meshBasicMaterial color={C.glass} transparent opacity={0.35} depthWrite={false} />
        </mesh>
        <mesh position={[-0.85, 0.85, 0]}>
          <boxGeometry args={[0.03, 1.1, 0.86]} />
          <meshBasicMaterial color={C.glass} transparent opacity={0.35} depthWrite={false} />
        </mesh>
        <Part args={[1.2, 0.06, 0.32]} position={[0.05, 0.42, 0.22]} color={C.bench} />
        {[-0.45, 0.55].map((x) => (
          <Part key={x} args={[0.06, 0.4, 0.26]} position={[x, 0.2, 0.22]} color={C.post} outline={false} />
        ))}
        <Part args={[0.5, 0.65, 0.04]} position={[0.55, 1.0, 0.43]} color={dark ? '#ffe9a8' : '#f4f1ea'} outline={false} />
      </group>
      {/* bus stop sign */}
      <group position={[1.15, 0.12, 0.95]}>
        <Part shape="cylinder" args={[0.035, 0.035, 1.9, 6]} position={[0, 0.95, 0]} color={C.post} />
        <mesh position={[0, 1.8, 0.04]}>
          <boxGeometry args={[0.42, 0.42, 0.02]} />
          <meshBasicMaterial map={sign} transparent toneMapped={false} />
        </mesh>
        <Part args={[0.3, 0.4, 0.04]} position={[0, 1.3, 0.04]} color="#f4f1ea" outline={false} />
      </group>
      {/* street lamp, tree, bin */}
      <group position={[3.4, 0.12, 1.0]}>
        <Part shape="cylinder" args={[0.04, 0.05, 2.2, 6]} position={[0, 1.1, 0]} color={C.post} />
        <Part args={[0.5, 0.06, 0.12]} position={[-0.22, 2.2, 0]} color={C.post} />
        <mesh position={[-0.42, 2.14, 0]}>
          <boxGeometry args={[0.16, 0.06, 0.12]} />
          <meshBasicMaterial color={dark ? C.lamp : '#d9d6cc'} toneMapped={false} />
        </mesh>
        {dark && <pointLight position={[-0.42, 1.9, 0]} intensity={4} distance={4} color={C.lamp} />}
      </group>
      <group position={[-4.2, 0.12, 2.6]}>
        <Part args={[0.6, 0.12, 0.6]} position={[0, 0.06, 0]} color="#7a5a3a" outline={false} />
        <Part shape="cylinder" args={[0.07, 0.09, 0.8, 6]} position={[0, 0.4, 0]} color={C.trunk} />
        <Part shape="sphere" args={[0.5, 0]} position={[0, 1.05, 0]} color={C.leaf} />
        <Part shape="sphere" args={[0.32, 0]} position={[0.2, 1.4, 0.1]} color={C.leaf} />
      </group>
      <Part shape="cylinder" args={[0.16, 0.14, 0.45, 8]} position={[2.3, 0.345, 2.9]} color="#5a7a5a" />
      <Part args={[10, 0.02, 0.5]} position={[0, 0.13, 3.25]} color={C.grass} outline={false} />
    </>
  )
}

function Diorama({ busType, waitTime, coat }: { busType: BusType; waitTime: number; coat: string }) {
  const anchor = useRef<THREE.Group>(null)
  useEdgeClipping(anchor)
  const bus = useRef<THREE.Group>(null)
  const door = useRef(0)
  const spin = useRef(0)
  const flash = useRef(false)
  const pose = useRef<RiderPose>({ x: STOP_X, z: RIDER_Z, y: 0.12, facing: 0, walk: 0, visible: true, look: 0, watch: 0 })
  const spec = BUSES[busType] ?? BUSES.commuter
  const stopX = STOP_X - spec.door
  const lastX = useRef(-12)

  useLoop((t) => {
    const wait = Math.max(1, waitTime)
    const cycle = WALK_IN + wait + ARRIVE + OPEN + BOARD + CLOSE + DEPART
    let k = t % cycle
    const p = pose.current
    let busX = -12
    door.current = 0
    p.look = 0
    p.watch = 0
    p.visible = true
    p.y = 0.12

    if (k < WALK_IN) {
      // Stroll in from the right along the sidewalk.
      const e = k / WALK_IN
      p.x = STOP_X + (1 - e) * 5.2
      p.z = RIDER_Z
      p.facing = -Math.PI / 2
      p.walk = k * 5
      if (e > 0.85) p.walk = 0
    } else if ((k -= WALK_IN) < wait) {
      // Wait: face the road, glance up the street, check the watch.
      p.x = STOP_X
      p.z = RIDER_Z
      p.facing = Math.PI
      p.walk = 0
      p.look = Math.sin(k * 1.4) > 0.3 ? 0.9 : 0
      p.watch = clamp01(Math.sin(k * 0.9 + 2) * 3 - 2)
    } else if ((k -= wait) < ARRIVE) {
      // Bus brakes into the stop (ease-out).
      const e = k / ARRIVE
      busX = stopX - (1 - e) * (1 - e) * 11
      p.x = STOP_X
      p.z = RIDER_Z
      p.facing = Math.PI
      p.look = 0.9 * (1 - e)
    } else if ((k -= ARRIVE) < OPEN) {
      busX = stopX
      door.current = ease(k / OPEN)
      p.x = STOP_X
      p.z = RIDER_Z
      p.facing = Math.PI
    } else if ((k -= OPEN) < BOARD) {
      // Walk to the door and step up inside.
      busX = stopX
      door.current = 1
      const e = k / BOARD
      p.x = STOP_X
      p.facing = Math.PI
      p.z = RIDER_Z - e * (RIDER_Z - 0.05)
      p.y = 0.12 + clamp01((e - 0.6) / 0.3) * 0.14
      p.walk = k * 5
    } else if ((k -= BOARD) < CLOSE) {
      busX = stopX
      door.current = 1 - ease(k / CLOSE)
      p.visible = false
    } else {
      k -= CLOSE
      // Pull away (ease-in) and leave through the right edge.
      const e = k / DEPART
      busX = stopX + e * e * 12
      p.visible = false
    }
    flash.current = busX === stopX && Math.floor(t * 3) % 2 === 0

    if (bus.current) {
      bus.current.position.x = busX
      bus.current.visible = busX > -10 && busX < 11
    }
    spin.current += busX - lastX.current > 0 && busX - lastX.current < 1 ? busX - lastX.current : 0
    lastX.current = busX
  })

  return (
    <group ref={anchor}>
      <Street />
      <Rider pose={pose} coat={coat} />
      <group ref={bus} position={[-12, 0, LANE_Z]}>
        <BusModel key={busType} type={busType} door={door} spin={spin} flash={flash} />
      </group>
    </group>
  )
}

/** Isometric pixel-art bus stop with an arriving bus. Put any content inside it as children. */
export function BusStop({ busType = 'commuter', waitTime = 3, coatColor = C.coat, children, ...props }: BusStopProps) {
  return (
    <IsoPixelScene
      {...props}
      outlineColor={C.outline}
      groundColor={C.walk}
      extent={[11, 8.6]}
      target={[0, 0.8, 0]}
      scene={<Diorama busType={busType} waitTime={waitTime} coat={coatColor} />}
    >
      {children}
    </IsoPixelScene>
  )
}
