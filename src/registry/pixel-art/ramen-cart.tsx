'use client'

import { createContext, useContext, useRef } from 'react'
import type * as THREE from 'three'
import { IsoPixelScene, Part, useCanvasTexture, useIso, useLoop, type IsoPixelSceneProps } from '@/registry/pixel-art/iso-scene'

/* -------------------------------------------------------------------------------------------------
 * Ramen Cart: a tiny isometric pixel-art street scene.
 * A yatai ramen cart with a swaying noren curtain, a steaming pot, a flickering sign and
 * paper lantern, and a sleepy cat on a stool. Rendered with three.js at a low pixel ratio
 * and upscaled with nearest-neighbour filtering, so every frame looks hand-pixeled.
 * -----------------------------------------------------------------------------------------------*/

const PALETTES = {
  classic: {
    ground: '#ece6da', tile: '#ddd5c6', curb: '#c8bfae',
    wood: '#c98a4b', woodDark: '#8a5530', roof: '#d9503e', roofDark: '#a8382b',
    noren: '#2f3e66', ink: '#f6f0e4', metal: '#b9c2cc', metalDark: '#7d8894', soup: '#f1cf8a',
    lantern: '#ff5a3c', glow: '#ffb347', stool: '#e3b36b',
    cat: '#f2a65a', catDark: '#b8692c', leaf: '#5fa36a', pot: '#c86f4a', crate: '#d9a066',
    outline: '#2a2230',
  },
  matcha: {
    ground: '#e8ecdf', tile: '#d8dfcb', curb: '#bfc8b0',
    wood: '#b9925e', woodDark: '#6f5434', roof: '#5f8d4e', roofDark: '#44683a',
    noren: '#334d36', ink: '#f3f1e2', metal: '#c3c9c2', metalDark: '#7f8a80', soup: '#e9d79a',
    lantern: '#ffcf5a', glow: '#ffe28a', stool: '#d7c08d',
    cat: '#4a4a52', catDark: '#2a2a30', leaf: '#7fb069', pot: '#a7744d', crate: '#cdb07a',
    outline: '#1f2a22',
  },
  sakura: {
    ground: '#f6ecee', tile: '#ecdde1', curb: '#dcc8cd',
    wood: '#e2b48b', woodDark: '#9b6b52', roof: '#f08fab', roofDark: '#c86684',
    noren: '#6e3557', ink: '#fff4f7', metal: '#d3cfdc', metalDark: '#8e889e', soup: '#f6d6a8',
    lantern: '#ff7aa2', glow: '#ffc2d4', stool: '#f1c7a5',
    cat: '#f7f2ea', catDark: '#a3958a', leaf: '#8fbf8a', pot: '#d98f7a', crate: '#e8bf98',
    outline: '#3a2433',
  },
} as const

export type RamenCartPalette = keyof typeof PALETTES
type Palette = (typeof PALETTES)[RamenCartPalette]

export interface RamenCartProps extends Omit<IsoPixelSceneProps, 'scene' | 'outlineColor' | 'groundColor'> {
  /** Color theme for the cart and the cat. */
  palette?: RamenCartPalette
}

const ColorsContext = createContext<Palette>(PALETTES.classic)
const useColors = () => useContext(ColorsContext)

/* ------------------------------------------------------------------------------------ pieces -- */

function Ground() {
  const colors = useColors()
  return (
    <group>
      <Part args={[7, 0.5, 7]} position={[0, -0.25, 0]} color={colors.ground} />
      <Part args={[7, 0.18, 0.7]} position={[0, 0.09, 3.15]} color={colors.curb} />
      {[
        [-2.2, -1.6],
        [1.9, -2.4],
        [2.6, 1.2],
        [-2.7, 1.9],
        [-0.6, -2.7],
      ].map(([x, z]) => (
        <Part key={`${x}${z}`} args={[1, 0.02, 1]} position={[x, 0.01, z]} color={colors.tile} outline={false} />
      ))}
    </group>
  )
}

function Wheel({ position }: { position: [number, number, number] }) {
  const colors = useColors()
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <Part shape="cylinder" args={[0.45, 0.45, 0.14, 12]} color={colors.woodDark} />
      <Part shape="cylinder" args={[0.14, 0.14, 0.2, 8]} color={colors.metalDark} outline={false} />
    </group>
  )
}

function NorenStrip({ x, letter, index }: { x: number; letter: string; index: number }) {
  const colors = useColors()
  const pivot = useRef<THREE.Group>(null)
  const map = useCanvasTexture(
    32,
    40,
    (ctx) => {
      ctx.fillStyle = colors.noren
      ctx.fillRect(0, 0, 32, 40)
      ctx.fillStyle = colors.ink
      ctx.font = 'bold 22px "Yu Gothic", "Hiragino Sans", "Noto Sans JP", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(letter, 16, 22)
    },
    `${colors.noren}${colors.ink}${letter}`,
  )
  useLoop((t) => {
    if (pivot.current) pivot.current.rotation.x = -0.12 + Math.sin(t * 1.6 + index * 0.7) * 0.1
  })
  return (
    <group ref={pivot} position={[x, 2.98, 1.0]}>
      <mesh position={[0, -0.32, 0]} castShadow>
        <boxGeometry args={[0.74, 0.64, 0.03]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Steam({ origin, count = 7 }: { origin: [number, number, number]; count?: number }) {
  const puffs = useRef<(THREE.Mesh | null)[]>([])
  useLoop((t) => {
    puffs.current.forEach((mesh, i) => {
      if (!mesh) return
      const p = (t * 0.4 + i / count) % 1
      mesh.position.set(
        origin[0] + Math.sin(p * 5 + i * 2.1) * 0.14,
        origin[1] + p * 1.5,
        origin[2] + Math.cos(i * 1.7) * 0.1,
      )
      mesh.scale.setScalar(0.06 + Math.sin(p * Math.PI) * 0.13)
      ;(mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(p * Math.PI) * 0.9
    })
  })
  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            puffs.current[i] = m
          }}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#ffffff" transparent depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Sign() {
  const colors = useColors()
  const material = useRef<THREE.MeshBasicMaterial>(null)
  const map = useCanvasTexture(
    96,
    32,
    (ctx) => {
      ctx.fillStyle = colors.ink
      ctx.fillRect(0, 0, 96, 32)
      ctx.fillStyle = colors.roofDark
      ctx.fillRect(2, 2, 92, 28)
      ctx.fillStyle = colors.ink
      ctx.font = 'bold 19px ui-monospace, Menlo, Consolas, monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('RAMEN', 48, 17)
    },
    `${colors.ink}${colors.roofDark}`,
  )
  useLoop((t) => {
    // Mostly steady, with a short stutter every few seconds like a tired neon tube.
    const cycle = t % 4.5
    const stutter = cycle > 4 && Math.sin(t * 70) > 0.2
    material.current?.color.setScalar(stutter ? 0.35 : 1)
  })
  return (
    <group position={[0, 3.62, 0.15]}>
      <Part args={[1.9, 0.62, 0.14]} color={colors.woodDark} />
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[1.76, 0.5]} />
        <meshBasicMaterial ref={material} map={map} toneMapped={false} />
      </mesh>
      <Part args={[0.08, 0.3, 0.08]} position={[-0.7, -0.42, 0]} color={colors.woodDark} outline={false} />
      <Part args={[0.08, 0.3, 0.08]} position={[0.7, -0.42, 0]} color={colors.woodDark} outline={false} />
    </group>
  )
}

function Lantern() {
  const colors = useColors()
  const { dark } = useIso()
  const swing = useRef<THREE.Group>(null)
  const body = useRef<THREE.MeshBasicMaterial>(null)
  const light = useRef<THREE.PointLight>(null)
  useLoop((t) => {
    const flicker = 0.85 + Math.sin(t * 11) * Math.sin(t * 6.3) * 0.15
    if (swing.current) swing.current.rotation.z = Math.sin(t * 1.3) * 0.12
    body.current?.color.set(colors.lantern).multiplyScalar(0.8 + flicker * 0.3)
    if (light.current) light.current.intensity = (dark ? 9 : 2.5) * flicker
  })
  return (
    <group ref={swing} position={[1.75, 2.98, 1.0]}>
      <Part args={[0.03, 0.25, 0.03]} position={[0, -0.12, 0]} color={colors.woodDark} outline={false} />
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.42, 10]} />
        <meshBasicMaterial ref={body} color={colors.lantern} toneMapped={false} />
      </mesh>
      <Part shape="cylinder" args={[0.13, 0.13, 0.06, 10]} position={[0, -0.26, 0]} color={colors.woodDark} />
      <Part shape="cylinder" args={[0.13, 0.13, 0.06, 10]} position={[0, -0.74, 0]} color={colors.woodDark} />
      <pointLight ref={light} position={[0, -0.5, 0.3]} color={colors.glow} distance={7} decay={2} />
    </group>
  )
}

function Cat() {
  const colors = useColors()
  const body = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const tail = useRef<THREE.Group>(null)
  const eyes = useRef<THREE.Group>(null)
  useLoop((t) => {
    if (body.current) body.current.scale.y = 1 + Math.sin(t * 2.2) * 0.04
    if (head.current) {
      head.current.rotation.z = Math.sin(t * 0.7) * 0.18
      head.current.rotation.y = Math.sin(t * 0.33) * 0.35
      head.current.position.y = 0.52 + Math.sin(t * 2.2) * 0.015
    }
    if (tail.current) tail.current.rotation.y = Math.sin(t * 2.6) * 0.6
    if (eyes.current) eyes.current.scale.y = t % 3.7 < 0.14 ? 0.15 : 1
  })
  return (
    <group position={[0.35, 0.92, 2.0]} rotation={[0, -0.5, 0]}>
      <group ref={body}>
        <Part args={[0.42, 0.36, 0.56]} position={[0, 0.18, 0]} color={colors.cat} />
        <Part args={[0.43, 0.06, 0.2]} position={[0, 0.3, -0.05]} color={colors.catDark} outline={false} />
        <Part args={[0.43, 0.06, 0.18]} position={[0, 0.2, 0.15]} color={colors.catDark} outline={false} />
      </group>
      <group ref={head} position={[0, 0.52, 0.22]}>
        <Part args={[0.38, 0.32, 0.32]} color={colors.cat} />
        <Part shape="cone" args={[0.08, 0.16, 4]} position={[-0.11, 0.22, 0]} rotation={[0, Math.PI / 4, 0]} color={colors.catDark} />
        <Part shape="cone" args={[0.08, 0.16, 4]} position={[0.11, 0.22, 0]} rotation={[0, Math.PI / 4, 0]} color={colors.catDark} />
        <group ref={eyes} position={[0, 0.02, 0.165]}>
          <Part args={[0.05, 0.07, 0.01]} position={[-0.08, 0, 0]} color={colors.outline} outline={false} />
          <Part args={[0.05, 0.07, 0.01]} position={[0.08, 0, 0]} color={colors.outline} outline={false} />
        </group>
        <Part args={[0.06, 0.04, 0.01]} position={[0, -0.07, 0.165]} color={colors.lantern} outline={false} />
      </group>
      <group ref={tail} position={[0, 0.08, -0.28]}>
        <Part args={[0.08, 0.08, 0.4]} position={[0.08, 0, -0.18]} rotation={[0, 0.4, 0]} color={colors.catDark} />
      </group>
    </group>
  )
}

function Stool({ position }: { position: [number, number, number] }) {
  const colors = useColors()
  return (
    <group position={position}>
      <Part shape="cylinder" args={[0.38, 0.38, 0.12, 12]} position={[0, 0.86, 0]} color={colors.stool} />
      {[
        [-0.22, -0.22],
        [0.22, -0.22],
        [-0.22, 0.22],
        [0.22, 0.22],
      ].map(([x, z]) => (
        <Part key={`${x}${z}`} args={[0.07, 0.8, 0.07]} position={[x, 0.4, z]} color={colors.woodDark} />
      ))}
    </group>
  )
}

function Plant({ position }: { position: [number, number, number] }) {
  const colors = useColors()
  const leaves = useRef<THREE.Group>(null)
  useLoop((t) => {
    if (leaves.current) leaves.current.rotation.z = Math.sin(t * 1.1) * 0.05
  })
  return (
    <group position={position}>
      <Part shape="cylinder" args={[0.32, 0.24, 0.5, 8]} position={[0, 0.25, 0]} color={colors.pot} />
      <group ref={leaves} position={[0, 0.5, 0]}>
        <Part shape="sphere" args={[0.3, 0]} position={[0, 0.25, 0]} color={colors.leaf} />
        <Part shape="sphere" args={[0.22, 0]} position={[0.2, 0.5, 0.05]} color={colors.leaf} />
        <Part shape="sphere" args={[0.2, 0]} position={[-0.18, 0.45, -0.08]} color={colors.leaf} />
      </group>
    </group>
  )
}

function Cart() {
  const colors = useColors()
  return (
    <group>
      {/* body */}
      <Part args={[3, 1.2, 1.5]} position={[0, 0.95, 0]} color={colors.wood} />
      {[-1, 0, 1].map((x) => (
        <Part key={x} args={[0.08, 1.1, 0.02]} position={[x * 0.75, 0.95, 0.76]} color={colors.woodDark} outline={false} />
      ))}
      <Wheel position={[-0.85, 0.45, 0.82]} />
      <Wheel position={[-0.85, 0.45, -0.82]} />
      {/* pull handles */}
      <Part args={[1.3, 0.09, 0.09]} position={[2.05, 1.05, 0.55]} color={colors.woodDark} />
      <Part args={[1.3, 0.09, 0.09]} position={[2.05, 1.05, -0.55]} color={colors.woodDark} />
      <Part args={[0.09, 0.09, 1.2]} position={[2.66, 1.05, 0]} color={colors.woodDark} />
      <Part args={[0.12, 0.62, 0.12]} position={[1.35, 0.31, 0.55]} color={colors.woodDark} />
      {/* counter */}
      <Part args={[3.3, 0.12, 1.9]} position={[0, 1.61, 0.15]} color={colors.woodDark} />
      {/* posts + roof */}
      {[
        [-1.5, -0.6],
        [1.5, -0.6],
        [-1.5, 0.95],
        [1.5, 0.95],
      ].map(([x, z]) => (
        <Part key={`${x}${z}`} args={[0.1, 1.35, 0.1]} position={[x, 2.34, z]} color={colors.woodDark} />
      ))}
      <Part args={[3.7, 0.16, 2.2]} position={[0, 3.08, 0.17]} color={colors.roof} />
      <Part args={[3.8, 0.08, 0.12]} position={[0, 3.0, 1.3]} color={colors.roofDark} />
      {/* pots, bowls, chopsticks */}
      <Part shape="cylinder" args={[0.36, 0.34, 0.46, 12]} position={[-0.85, 1.9, -0.2]} color={colors.metal} />
      <Part shape="cylinder" args={[0.3, 0.3, 0.02, 12]} position={[-0.85, 2.13, -0.2]} color={colors.soup} outline={false} />
      <Part shape="cylinder" args={[0.26, 0.24, 0.34, 10]} position={[-0.1, 1.84, -0.35]} color={colors.metalDark} />
      {[0.35, 0.95].map((x) => (
        <group key={x} position={[x, 1.74, 0.7]}>
          <Part shape="cylinder" args={[0.22, 0.13, 0.15, 10]} color={colors.roof} />
          <Part shape="cylinder" args={[0.19, 0.19, 0.02, 10]} position={[0, 0.07, 0]} color={colors.soup} outline={false} />
        </group>
      ))}
      <Part args={[0.5, 0.03, 0.03]} position={[0.65, 1.69, 0.95]} rotation={[0, 0.2, 0]} color={colors.woodDark} outline={false} />
      {/* curtain letters: ra-a-me-n */}
      {['ラ', 'ー', 'メ', 'ン'].map((letter, i) => (
        <NorenStrip key={i} index={i} letter={letter} x={-1.2 + i * 0.8} />
      ))}
      <Steam origin={[-0.85, 2.15, -0.2]} />
      <Sign />
      <Lantern />
    </group>
  )
}

/* --------------------------------------------------------------------------------------- scene -- */

function Diorama() {
  const colors = useColors()
  return (
    <>
      <Ground />
      <Cart />
      <Stool position={[0.35, 0, 2.0]} />
      <Cat />
      <Plant position={[-2.6, 0, 2.3]} />
      <Part args={[0.8, 0.6, 0.6]} position={[2.4, 0.3, -2.2]} rotation={[0, 0.3, 0]} color={colors.crate} />
      <Part args={[0.6, 0.45, 0.5]} position={[2.35, 0.83, -2.15]} rotation={[0, -0.2, 0]} color={colors.crate} />
    </>
  )
}

/** Isometric pixel-art ramen cart. Put any content inside it as children. */
export function RamenCart({ palette = 'classic', children, ...props }: RamenCartProps) {
  const colors = PALETTES[palette] ?? PALETTES.classic
  return (
    <IsoPixelScene
      {...props}
      outlineColor={colors.outline}
      groundColor={colors.ground}
      extent={[10.5, 8.5]}
      target={[0.1, 1.35, 0.3]}
      scene={
        <ColorsContext.Provider value={colors}>
          <Diorama />
        </ColorsContext.Provider>
      }
    >
      {children}
    </IsoPixelScene>
  )
}
