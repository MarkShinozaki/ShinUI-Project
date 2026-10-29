'use client'

import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { IsoPixelScene, Part, ToonMaterial, useCanvasTexture, useIso, useLoop, type IsoPixelSceneProps } from '@/registry/pixel-art/iso-scene'

/* -------------------------------------------------------------------------------------------------
 * Car Track: a tiny isometric pixel-art race loop.
 * Little cars lap a stadium-shaped track with red/white curbs, a checkered start line, trees,
 * cones and a tyre stack. Each car follows the curve, turns to face where it is going,
 * leans into the bends, and spins its wheels at a rate that matches its speed.
 * -----------------------------------------------------------------------------------------------*/

const C = {
  grass: '#a8d89a',
  grassDark: '#8cc47e',
  asphalt: '#5d6170',
  line: '#f4f1ea',
  curbRed: '#e5483d',
  curbWhite: '#f6f3ec',
  trunk: '#8a5a3a',
  leaf: '#4f9b5a',
  leafLight: '#6fbf6a',
  cone: '#ff8a3d',
  tyre: '#2f313a',
  glass: '#bfe3f2',
  wheel: '#24252c',
  hub: '#c9ced6',
  light: '#fff3b0',
  outline: '#232532',
}

/** Half the straight length and the centre-line radius of the stadium track. */
const L = 3.0
const R = 1.5
const WIDTH = 0.9
const PERIMETER = 2 * L + 2 * Math.PI * R

/** Point and unit tangent on the stadium at distance `s`, pushed out by `offset` from the centre line. */
function stadium(distance: number, offset = 0): [number, number, number, number] {
  let s = ((distance % PERIMETER) + PERIMETER) % PERIMETER
  const r = R + offset
  const arc = Math.PI * R
  if (s < L) return [-L / 2 + s, r, 1, 0]
  s -= L
  if (s < arc) {
    const a = Math.PI / 2 - s / R
    return [L / 2 + Math.cos(a) * r, Math.sin(a) * r, Math.sin(a), -Math.cos(a)]
  }
  s -= arc
  if (s < L) return [L / 2 - s, -r, -1, 0]
  s -= L
  const a = -Math.PI / 2 - s / R
  return [-L / 2 + Math.cos(a) * r, Math.sin(a) * r, Math.sin(a), -Math.cos(a)]
}

function stadiumShape(radius: number) {
  const shape = new THREE.Shape()
  shape.moveTo(-L / 2, -radius)
  shape.lineTo(L / 2, -radius)
  shape.absarc(L / 2, 0, radius, -Math.PI / 2, Math.PI / 2, false)
  shape.lineTo(-L / 2, radius)
  shape.absarc(-L / 2, 0, radius, Math.PI / 2, (3 * Math.PI) / 2, false)
  return shape
}

export interface CarTrackProps extends Omit<IsoPixelSceneProps, 'scene' | 'outlineColor' | 'groundColor'> {
  /** Paint of the lead car. */
  carColor?: string
  /** How many cars are lapping (1–3). */
  cars?: number
}

function Track() {
  const geometry = useMemo(() => {
    const outer = stadiumShape(R + WIDTH / 2)
    outer.holes.push(stadiumShape(R - WIDTH / 2))
    return new THREE.ExtrudeGeometry(outer, { depth: 0.05, bevelEnabled: false, curveSegments: 24 })
  }, [])
  useEffect(() => () => geometry.dispose(), [geometry])

  const checker = useCanvasTexture(
    4,
    8,
    (ctx) => {
      for (let y = 0; y < 8; y++)
        for (let x = 0; x < 4; x++) {
          ctx.fillStyle = (x + y) % 2 ? '#22232b' : '#f6f3ec'
          ctx.fillRect(x, y, 1, 1)
        }
    },
    'checker',
  )

  // Curb blocks along both edges, alternating red and white.
  const curbs = useMemo(() => {
    const count = 44
    const blocks: { x: number; z: number; angle: number; red: boolean }[] = []
    for (const side of [-1, 1]) {
      for (let i = 0; i < count; i++) {
        const [x, z, tx, tz] = stadium((i / count) * PERIMETER, side * (WIDTH / 2 + 0.06))
        blocks.push({ x, z, angle: Math.atan2(-tz, tx), red: i % 2 === 0 })
      }
    }
    return blocks
  }, [])

  return (
    <group>
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <ToonMaterial color={C.asphalt} />
      </mesh>
      {/* start / finish line on the front straight */}
      <mesh position={[0, 0.06, R]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.24, WIDTH]} />
        <meshBasicMaterial map={checker} toneMapped={false} />
      </mesh>
      {/* dashed centre line on the straights */}
      {[-1, 1].flatMap((side) =>
        [-1.1, -0.4, 0.3, 1.0].map((x) => (
          <mesh key={`${side}${x}`} position={[x + 0.2, 0.056, side * R]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 0.05]} />
            <meshBasicMaterial color={C.line} toneMapped={false} />
          </mesh>
        )),
      )}
      {curbs.map((b, i) => (
        <Part
          key={i}
          args={[0.24, 0.07, 0.12]}
          position={[b.x, 0.04, b.z]}
          rotation={[0, b.angle, 0]}
          color={b.red ? C.curbRed : C.curbWhite}
          outline={false}
        />
      ))}
    </group>
  )
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <Part shape="cylinder" args={[0.1, 0.12, 0.5, 6]} position={[0, 0.25, 0]} color={C.trunk} />
      <Part shape="sphere" args={[0.42, 0]} position={[0, 0.75, 0]} color={C.leaf} />
      <Part shape="sphere" args={[0.28, 0]} position={[0.12, 1.08, 0.05]} color={C.leafLight} />
    </group>
  )
}

function Cone({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Part args={[0.26, 0.04, 0.26]} position={[0, 0.02, 0]} color={C.cone} />
      <Part shape="cone" args={[0.1, 0.3, 8]} position={[0, 0.19, 0]} color={C.cone} />
      <Part shape="cylinder" args={[0.065, 0.075, 0.05, 8]} position={[0, 0.17, 0]} color={C.curbWhite} outline={false} />
    </group>
  )
}

function TyreStack({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1, 2].map((i) => (
        <Part key={i} shape="cylinder" args={[0.22, 0.22, 0.12, 10]} position={[0, 0.06 + i * 0.13, 0]} color={C.tyre} />
      ))}
    </group>
  )
}

const WHEEL_R = 0.09

function Wheel({ position, spin }: { position: [number, number, number]; spin: RefObject<number> }) {
  const ref = useRef<THREE.Group>(null)
  useLoop(() => {
    if (ref.current) ref.current.rotation.z = -spin.current
  })
  return (
    <group position={position}>
      <group ref={ref}>
        <Part shape="cylinder" args={[WHEEL_R, WHEEL_R, 0.07, 8]} rotation={[Math.PI / 2, 0, 0]} color={C.wheel} />
        {/* an off-centre hub mark so the spin reads at pixel scale */}
        <Part args={[0.05, 0.05, 0.075]} position={[0.03, 0.02, 0]} color={C.hub} outline={false} />
      </group>
    </group>
  )
}

function Car({ color, start, lane, pace }: { color: string; start: number; lane: number; pace: number }) {
  const { dark } = useIso()
  const car = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const distance = useRef(start)
  const spin = useRef(0)

  useLoop((t, dt) => {
    const travel = dt * pace
    distance.current += travel
    spin.current += travel / WHEEL_R
    const [x, z, tx, tz] = stadium(distance.current, lane)
    // Look a little ahead to measure how hard we are turning, then lean into it.
    const [, , ax, az] = stadium(distance.current + 0.25, lane)
    const turn = tx * az - tz * ax
    if (car.current) {
      car.current.position.set(x, 0.05, z)
      car.current.rotation.y = Math.atan2(-tz, tx)
    }
    if (body.current) {
      body.current.rotation.x = turn * 0.5
      body.current.position.y = WHEEL_R + 0.06 + Math.sin(t * 30) * 0.004
    }
  })

  return (
    <group ref={car}>
      <group ref={body}>
        <Part args={[0.62, 0.12, 0.34]} color={color} />
        <Part args={[0.3, 0.12, 0.28]} position={[-0.06, 0.12, 0]} color={color} />
        <Part args={[0.02, 0.09, 0.24]} position={[0.095, 0.12, 0]} color={C.glass} outline={false} />
        <Part args={[0.12, 0.03, 0.36]} position={[-0.3, 0.09, 0]} color={C.tyre} />
        {[0.11, -0.11].map((z) => (
          <mesh key={z} position={[0.315, 0.01, z]}>
            <boxGeometry args={[0.02, 0.04, 0.07]} />
            <meshBasicMaterial color={C.light} toneMapped={false} />
          </mesh>
        ))}
        {/* headlight beam at night */}
        {dark && <pointLight position={[0.7, 0.1, 0]} color={C.light} intensity={2.5} distance={2.2} decay={2} />}
      </group>
      <Wheel position={[0.19, WHEEL_R, 0.18]} spin={spin} />
      <Wheel position={[0.19, WHEEL_R, -0.18]} spin={spin} />
      <Wheel position={[-0.19, WHEEL_R, 0.18]} spin={spin} />
      <Wheel position={[-0.19, WHEEL_R, -0.18]} spin={spin} />
    </group>
  )
}

const RIVALS = ['#3d7bff', '#ffc53d']

function Diorama({ carColor, cars }: { carColor: string; cars: number }) {
  const count = Math.min(3, Math.max(1, Math.round(cars)))
  return (
    <>
      {/* ground */}
      <Part args={[8.6, 0.5, 6.4]} position={[0, -0.25, 0]} color={C.grass} />
      {[
        [-3.6, 2.6],
        [3.2, -2.7],
        [0.4, 2.75],
        [-1.2, -2.8],
      ].map(([x, z]) => (
        <Part key={`${x}${z}`} args={[0.9, 0.02, 0.6]} position={[x, 0.01, z]} color={C.grassDark} outline={false} />
      ))}
      <Track />
      <Tree position={[-3.75, 0, -2.55]} scale={1.1} />
      <Tree position={[-3.2, 0, -2.75]} scale={0.8} />
      <Tree position={[3.75, 0, 2.5]} />
      <Tree position={[3.8, 0, -1.6]} scale={0.9} />
      <Tree position={[-0.2, 0, 0]} scale={0.75} />
      <Cone position={[-1.1, 0, 0.3]} />
      <Cone position={[0.9, 0, -0.3]} />
      <Cone position={[1.3, 0, 0.35]} />
      <TyreStack position={[-3.85, 0, 1.0]} />
      <TyreStack position={[3.85, 0, 0.6]} />
      {Array.from({ length: count }, (_, i) => (
        <Car
          key={i}
          color={i === 0 ? carColor : RIVALS[i - 1]}
          start={(PERIMETER / count) * i}
          lane={i % 2 === 0 ? -0.17 : 0.17}
          pace={1.6}
        />
      ))}
    </>
  )
}

/** Isometric pixel-art race loop. Put any content inside it as children. */
export function CarTrack({ carColor = '#e5483d', cars = 2, children, ...props }: CarTrackProps) {
  return (
    <IsoPixelScene
      {...props}
      outlineColor={C.outline}
      groundColor={C.grass}
      extent={[11, 7.6]}
      target={[0, 0.3, 0]}
      scene={<Diorama carColor={carColor} cars={cars} />}
    >
      {children}
    </IsoPixelScene>
  )
}
