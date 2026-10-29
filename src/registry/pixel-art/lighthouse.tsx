'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { IsoPixelScene, Part, ToonMaterial, useIso, useLoop, type IsoPixelSceneProps } from '@/registry/pixel-art/iso-scene'

/* -------------------------------------------------------------------------------------------------
 * Lighthouse: a tiny isometric pixel-art island.
 * A striped lighthouse on a rocky island with a keeper's cottage, faceted waves rolling around
 * it, gulls circling, and a rotating lamp that sweeps two fading light beams. At night the
 * beams, lamp, and cottage window glow.
 * -----------------------------------------------------------------------------------------------*/

const C = {
  sea: '#5fb7d0',
  seaDeep: '#3f8fb0',
  foam: '#f2fbff',
  rock: '#8f8a84',
  rockDark: '#6f6a66',
  rockLight: '#aaa59d',
  grass: '#8fca78',
  white: '#f6f3ec',
  red: '#d9483b',
  roof: '#3f4a5c',
  glass: '#fff2b0',
  wall: '#efe3cc',
  wood: '#8a5a3a',
  gull: '#fbfbf8',
  gullWing: '#c9ced6',
  beak: '#ffb23f',
  outline: '#1f2733',
}

const SEA_W = 9
const SEA_D = 8
const SEA_Y = -0.12
const LAMP_Y = 3.55

export interface LighthouseProps extends Omit<IsoPixelSceneProps, 'scene' | 'outlineColor' | 'groundColor'> {
  /** Night mode: dark sky, glowing lamp and window, brighter beams. */
  night?: boolean
  /** Color of the sweeping light beams. */
  beamColor?: string
}

/** Faceted, gently rolling sea surface on top of a water block. */
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
    const pos = g.attributes.position
    const arr = pos.array as Float32Array
    for (let i = 0; i < arr.length; i += 3) {
      const x = base[i]
      const z = base[i + 2]
      // Keep the rim flat so the water block's sides stay clean.
      const edge = Math.min(1, (SEA_W / 2 - Math.abs(x)) * 2, (SEA_D / 2 - Math.abs(z)) * 2)
      arr[i + 1] = (Math.sin(x * 1.3 + t * 1.4) * 0.05 + Math.sin(z * 1.7 - t * 1.1) * 0.04) * Math.max(0, edge)
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
  })

  return (
    <group>
      <Part args={[SEA_W, 0.8, SEA_D]} position={[0, SEA_Y - 0.42, 0]} color={C.seaDeep} />
      <mesh ref={surface} geometry={geometry} position={[0, SEA_Y, 0]} receiveShadow>
        <ToonMaterial color={C.sea} />
      </mesh>
    </group>
  )
}

/** A ring of foam blocks bobbing where the waves meet the rocks. */
function Foam() {
  const blocks = useRef<(THREE.Mesh | null)[]>([])
  const n = 20
  useLoop((t) => {
    blocks.current.forEach((m, i) => {
      if (!m) return
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.8 + i * 1.7)
      m.position.y = SEA_Y + 0.04 + pulse * 0.03
      m.scale.set(0.6 + pulse * 0.6, 1, 0.6 + pulse * 0.4)
    })
  })
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2
        const r = 2.15 + Math.sin(i * 2.3) * 0.15
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * r, SEA_Y, Math.sin(a) * r * 0.9]}
            rotation={[0, -a, 0]}
            ref={(m) => {
              blocks.current[i] = m
            }}
          >
            <boxGeometry args={[0.18, 0.03, 0.4]} />
            <meshBasicMaterial color={C.foam} toneMapped={false} />
          </mesh>
        )
      })}
    </group>
  )
}

function Island() {
  const rocks = useMemo(() => {
    const list: { x: number; z: number; y: number; s: number; color: string }[] = []
    const n = 14
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      const r = 1.75 + Math.sin(i * 3.1) * 0.15
      list.push({
        x: Math.cos(a) * r,
        z: Math.sin(a) * r * 0.9,
        y: 0.05,
        s: 0.42 + ((i * 5) % 4) * 0.08,
        color: [C.rock, C.rockDark, C.rockLight][i % 3],
      })
    }
    return list
  }, [])
  return (
    <group>
      <Part shape="cylinder" args={[1.85, 2.05, 0.9, 9]} position={[0, 0.15, 0]} color={C.rock} />
      <Part shape="cylinder" args={[1.65, 1.8, 0.14, 9]} position={[0, 0.66, 0]} color={C.grass} />
      {rocks.map((r, i) => (
        <Part key={i} shape="sphere" args={[r.s, 0]} position={[r.x, r.y, r.z]} rotation={[0, i, 0]} scale={[1.2, 0.8, 1]} color={r.color} />
      ))}
      <Part shape="sphere" args={[0.35, 0]} position={[2.6, SEA_Y, -1.6]} scale={[1.2, 0.7, 1]} color={C.rockDark} />
      <Part shape="sphere" args={[0.22, 0]} position={[-2.4, SEA_Y, 2.2]} scale={[1.2, 0.7, 1]} color={C.rock} />
    </group>
  )
}

function Tower() {
  const { dark } = useIso()
  const stripes = 4
  const segH = 0.62
  return (
    <group position={[-0.35, 0.73, -0.25]}>
      {Array.from({ length: stripes }, (_, i) => {
        const r0 = 0.55 - i * 0.06
        const r1 = 0.55 - (i + 1) * 0.06
        return (
          <Part
            key={i}
            shape="cylinder"
            args={[r1, r0, segH, 10]}
            position={[0, segH / 2 + i * segH, 0]}
            color={i % 2 ? C.red : C.white}
          />
        )
      })}
      {/* door + windows */}
      <Part args={[0.2, 0.32, 0.06]} position={[0.22, 0.16, 0.48]} rotation={[0, 0.45, 0]} color={C.wood} outline={false} />
      <Part args={[0.1, 0.14, 0.04]} position={[0.17, 1.4, 0.4]} rotation={[0, 0.45, 0]} color={dark ? C.glass : C.roof} outline={false} />
      {/* gallery */}
      <Part shape="cylinder" args={[0.5, 0.42, 0.1, 10]} position={[0, stripes * segH + 0.05, 0]} color={C.roof} />
      <Part shape="cylinder" args={[0.48, 0.48, 0.14, 10]} position={[0, stripes * segH + 0.17, 0]} color={C.red} outline={false} />
      {/* lantern room */}
      <mesh position={[0, LAMP_Y - 0.73, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.36, 8]} />
        <meshBasicMaterial color={dark ? C.glass : '#fff8d8'} toneMapped={false} />
      </mesh>
      <Part shape="cone" args={[0.34, 0.34, 8]} position={[0, LAMP_Y - 0.73 + 0.35, 0]} color={C.red} />
      <Part shape="sphere" args={[0.06, 0]} position={[0, LAMP_Y - 0.73 + 0.56, 0]} color={C.roof} outline={false} />
    </group>
  )
}

/** Two opposite cones of light that fade out with distance, rotating around the lamp. */
function Beam({ color }: { color: string }) {
  const { dark } = useIso()
  const spinner = useRef<THREE.Group>(null)
  const light = useRef<THREE.PointLight>(null)
  const fade = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 64)
      g.addColorStop(0, '#ffffff')
      g.addColorStop(0.35, '#7a7a7a')
      g.addColorStop(1, '#000000')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 1, 64)
    }
    return new THREE.CanvasTexture(canvas)
  }, [])
  useEffect(() => () => fade.dispose(), [fade])

  useLoop((t) => {
    if (spinner.current) spinner.current.rotation.y = t * 0.9
    if (light.current) light.current.intensity = dark ? 3.5 + Math.sin(t * 9) * 0.3 : 0
  })

  const length = 4.2
  return (
    <group position={[-0.35, LAMP_Y, -0.25]}>
      <group ref={spinner}>
        {[0, Math.PI].map((r) => (
          <group key={r} rotation={[0, r, 0]}>
            {/* ConeGeometry points +y; turn it so the tip sits on the lamp and it opens along +x. */}
            <mesh position={[length / 2, -0.15, 0]} rotation={[0, 0, Math.PI / 2 + 0.08]}>
              <coneGeometry args={[0.85, length, 16, 1, true]} />
              <meshBasicMaterial
                color={color}
                alphaMap={fade}
                transparent
                opacity={dark ? 0.6 : 0.22}
                depthWrite={false}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
      </group>
      <pointLight ref={light} position={[0.6, 0.2, 0.6]} color={color} distance={5} decay={2} />
    </group>
  )
}

function Cottage() {
  const { dark } = useIso()
  return (
    <group position={[0.75, 0.73, 0.55]} rotation={[0, -0.35, 0]}>
      <Part args={[0.9, 0.55, 0.7]} position={[0, 0.275, 0]} color={C.wall} />
      <Part shape="cone" args={[0.72, 0.42, 4]} position={[0, 0.76, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1.05, 1, 0.82]} color={C.roof} />
      <Part args={[0.12, 0.3, 0.12]} position={[0.25, 0.85, -0.1]} color={C.rockDark} />
      <Part args={[0.18, 0.3, 0.03]} position={[-0.18, 0.15, 0.36]} color={C.wood} outline={false} />
      <mesh position={[0.18, 0.32, 0.36]}>
        <boxGeometry args={[0.2, 0.16, 0.02]} />
        <meshBasicMaterial color={dark ? C.glass : '#9fc6d6'} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Gull({ radius, height, pace, phase }: { radius: number; height: number; pace: number; phase: number }) {
  const bird = useRef<THREE.Group>(null)
  const left = useRef<THREE.Group>(null)
  const right = useRef<THREE.Group>(null)
  useLoop((t) => {
    const a = t * pace + phase
    if (bird.current) {
      bird.current.position.set(Math.cos(a) * radius, height + Math.sin(t * 1.3 + phase) * 0.2, Math.sin(a) * radius)
      // Fly along the circle's tangent (counter-clockwise seen from above).
      bird.current.rotation.y = -a - Math.PI / 2 * Math.sign(pace)
      bird.current.rotation.x = -0.3 * Math.sign(pace)
    }
    const flap = Math.sin(t * 8 + phase) * 0.6
    if (left.current) left.current.rotation.x = flap
    if (right.current) right.current.rotation.x = -flap
  })
  return (
    <group ref={bird}>
      <Part args={[0.26, 0.08, 0.09]} color={C.gull} />
      <Part args={[0.06, 0.03, 0.04]} position={[0.16, 0, 0]} color={C.beak} outline={false} />
      <group ref={left} position={[0, 0.02, 0.04]}>
        <Part args={[0.12, 0.02, 0.26]} position={[0, 0, 0.13]} color={C.gullWing} />
      </group>
      <group ref={right} position={[0, 0.02, -0.04]}>
        <Part args={[0.12, 0.02, 0.26]} position={[0, 0, -0.13]} color={C.gullWing} />
      </group>
    </group>
  )
}

function Diorama({ beamColor }: { beamColor: string }) {
  return (
    <>
      <Sea />
      <Foam />
      <Island />
      <Tower />
      <Cottage />
      <Beam color={beamColor} />
      <Gull radius={2.4} height={3.0} pace={0.5} phase={0} />
      <Gull radius={1.9} height={3.6} pace={-0.65} phase={2} />
    </>
  )
}

/** Isometric pixel-art lighthouse island. Put any content inside it as children. */
export function Lighthouse({ night = false, beamColor = '#fff1a8', style, children, ...props }: LighthouseProps) {
  return (
    <IsoPixelScene
      {...props}
      night={night}
      style={night ? { background: '#0f1626', ...style } : style}
      outlineColor={C.outline}
      groundColor={C.sea}
      extent={[11.4, 10.2]}
      target={[0, 1.6, 0]}
      scene={<Diorama beamColor={beamColor} />}
    >
      {children}
    </IsoPixelScene>
  )
}
