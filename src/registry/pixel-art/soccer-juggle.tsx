'use client'

import { useMemo, useRef, type RefObject } from 'react'
import type * as THREE from 'three'
import { IsoPixelScene, Part, useIso, useLoop, type IsoPixelSceneProps } from '@/registry/pixel-art/iso-scene'

/* -------------------------------------------------------------------------------------------------
 * Soccer Juggle: a tiny isometric pixel-art street court with a player juggling a ball.
 * The player loops through tricks: keepy-uppies, thigh touches, a header, an around-the-world,
 * a neck stall and a flick back up. Every touch is a key pose; limbs are driven by forward
 * kinematics on pivots, and the ball flies on true ballistic arcs between the exact contact
 * points computed from those poses, so foot, thigh, head and ball always meet.
 * -----------------------------------------------------------------------------------------------*/

const C = {
  court: '#d3d7dd',
  courtDark: '#c3c8cf',
  line: '#f7f7f4',
  grass: '#9fd18a',
  skin: '#e6b088',
  hair: '#3a2a20',
  shorts: '#2a2f3a',
  sock: '#f4f2ec',
  shoe: '#1f2230',
  ball: '#f8f8f6',
  ballPatch: '#25262c',
  post: '#f4f2ec',
  net: '#c9ced6',
  cone: '#ff8a3d',
  bench: '#b7804b',
  benchLeg: '#5d6170',
  bottle: '#4fb3e8',
  leaf: '#4f9b5a',
  trunk: '#8a5a3a',
  lamp: '#fff1b0',
  pole: '#4a4f5c',
  outline: '#232532',
}

export type SoccerTrickSet = 'full' | 'keepy-uppies' | 'skills'

export interface SoccerJuggleProps extends Omit<IsoPixelSceneProps, 'scene' | 'outlineColor' | 'groundColor'> {
  /** Shirt color. */
  kitColor?: string
  /** Which tricks to loop: everything, just feet and thighs, or headers / around-the-world / neck stall. */
  trickSet?: SoccerTrickSet
}

/* ------------------------------------------------------------------------------- kinematics -- */

interface Pose {
  hipL: number
  kneeL: number
  hipR: number
  kneeR: number
  hipRz: number
  lean: number
  head: number
  armL: number
  armR: number
}

const NEUTRAL: Pose = { hipL: -0.06, kneeL: 0.14, hipR: -0.06, kneeR: 0.14, hipRz: 0, lean: 0.05, head: 0.25, armL: 0.35, armR: -0.35 }

type BodyPart = 'rfoot' | 'lfoot' | 'rthigh' | 'lthigh' | 'head' | 'neck'

const POSES: Record<BodyPart, Pose> = {
  rfoot: { hipL: -0.08, kneeL: 0.2, hipR: -0.95, kneeR: 0.55, hipRz: 0, lean: -0.05, head: 0.4, armL: 0.6, armR: -0.6 },
  lfoot: { hipL: -0.95, kneeL: 0.55, hipR: -0.08, kneeR: 0.2, hipRz: 0, lean: -0.05, head: 0.4, armL: 0.6, armR: -0.6 },
  rthigh: { hipL: -0.06, kneeL: 0.2, hipR: -1.55, kneeR: 1.45, hipRz: 0, lean: 0, head: 0.45, armL: 0.5, armR: -0.5 },
  lthigh: { hipL: -1.55, kneeL: 1.45, hipR: -0.06, kneeR: 0.2, hipRz: 0, lean: 0, head: 0.45, armL: 0.5, armR: -0.5 },
  head: { hipL: -0.15, kneeL: 0.3, hipR: -0.15, kneeR: 0.3, hipRz: 0, lean: -0.18, head: -0.5, armL: 0.45, armR: -0.45 },
  neck: { hipL: -0.3, kneeL: 0.35, hipR: -0.3, kneeR: 0.35, hipRz: 0, lean: 1.0, head: -0.35, armL: 1.25, armR: -1.25 },
}

interface Touch {
  part: BodyPart
  /** Seconds of flight to the next touch. */
  flight: number
  /** Seconds the ball rests on this body part (neck stall). */
  hold?: number
  /** Swing the right foot around the ball during the following flight. */
  atw?: boolean
}

const KEEPY: Touch[] = [
  { part: 'rfoot', flight: 0.55 },
  { part: 'lfoot', flight: 0.55 },
  { part: 'rfoot', flight: 0.6 },
  { part: 'lthigh', flight: 0.6 },
  { part: 'rthigh', flight: 0.6 },
  { part: 'lfoot', flight: 0.55 },
]
const SKILLS: Touch[] = [
  { part: 'rfoot', flight: 1.1 },
  { part: 'head', flight: 0.8 },
  { part: 'head', flight: 0.9 },
  { part: 'rfoot', flight: 0.85, atw: true },
  { part: 'lfoot', flight: 0.55 },
  { part: 'rfoot', flight: 1.0 },
  { part: 'neck', flight: 0.9, hold: 1.1 },
]
const SETS: Record<SoccerTrickSet, Touch[]> = { full: [...KEEPY, ...SKILLS], 'keepy-uppies': KEEPY, skills: SKILLS }

const THIGH = 0.42
const SHIN = 0.42
const FOOT_H = 0.07
const BALL_R = 0.11
const GRAVITY = 8.8
const HIP_X = 0.1

const reach = (hip: number, knee: number) => THIGH * Math.cos(hip) + SHIN * Math.cos(hip + knee)
/** Pelvis height that keeps the lower foot planted on the ground. */
const pelvisY = (p: Pose) => FOOT_H + Math.max(reach(p.hipL, p.kneeL), reach(p.hipR, p.kneeR))

type Vec = [number, number, number]

/** Where the ball touches the body for a pose, in player space (forward = +z). */
function contactPoint(part: BodyPart, p: Pose): Vec {
  const py = pelvisY(p)
  if (part === 'rfoot' || part === 'lfoot') {
    const right = part === 'rfoot'
    const h = right ? p.hipR : p.hipL
    const k = right ? p.kneeR : p.kneeL
    const ky = py - THIGH * Math.cos(h)
    const kz = -THIGH * Math.sin(h)
    const ay = ky - SHIN * Math.cos(h + k)
    const az = kz - SHIN * Math.sin(h + k)
    return [right ? -HIP_X : HIP_X, ay + 0.035 + BALL_R, az + 0.07]
  }
  if (part === 'rthigh' || part === 'lthigh') {
    const right = part === 'rthigh'
    const h = right ? p.hipR : p.hipL
    const off = 0.065 + BALL_R
    return [right ? -HIP_X : HIP_X, py - 0.6 * THIGH * Math.cos(h) - Math.sin(h) * off, -0.6 * THIGH * Math.sin(h) + Math.cos(h) * off]
  }
  const l = p.lean
  if (part === 'head') return [0, py + 0.6 * Math.cos(l) + 0.12 + BALL_R, 0.6 * Math.sin(l)]
  // neck stall: on the upper back, just behind the head
  const off = 0.1 + BALL_R
  return [0, py + 0.48 * Math.cos(l) + Math.sin(l) * off, 0.48 * Math.sin(l) - Math.cos(l) * off]
}

const smooth = (k: number) => k * k * (3 - 2 * k)
function mix(a: Pose, b: Pose, k: number): Pose {
  const out = { ...a }
  for (const key of Object.keys(a) as (keyof Pose)[]) out[key] = a[key] + (b[key] - a[key]) * k
  return out
}

interface Timeline {
  events: (Touch & { t: number; contact: Vec; pose: Pose })[]
  cycle: number
}

function buildTimeline(touches: Touch[]): Timeline {
  let t = 0
  const events = touches.map((touch) => {
    const e = { ...touch, t, pose: POSES[touch.part], contact: contactPoint(touch.part, POSES[touch.part]) }
    t += (touch.hold ?? 0) + touch.flight
    return e
  })
  return { events, cycle: t }
}

/** Body pose and ball position at time `time` in the loop. */
function sample(tl: Timeline, time: number, ball: Vec): { pose: Pose; flying: boolean } {
  const tau = ((time % tl.cycle) + tl.cycle) % tl.cycle
  const n = tl.events.length
  let i = n - 1
  for (let j = 0; j < n; j++) if (tl.events[j].t <= tau) i = j
  const ev = tl.events[i]
  const next = tl.events[(i + 1) % n]
  const holdEnd = ev.t + (ev.hold ?? 0)
  if (tau < holdEnd) {
    ball[0] = ev.contact[0]
    ball[1] = ev.contact[1]
    ball[2] = ev.contact[2]
    return { pose: ev.pose, flying: false }
  }
  const gap = ev.flight
  const s = tau - holdEnd
  const f = s / gap

  // ballistic arc between the two contacts
  const p0 = ev.contact
  const p1 = next.contact
  for (let a = 0; a < 3; a++) {
    const g = a === 1 ? -GRAVITY : 0
    const v0 = (p1[a] - p0[a]) / gap - 0.5 * g * gap
    ball[a] = p0[a] + v0 * s + 0.5 * g * s * s
  }

  let pose: Pose
  if (ev.atw) {
    pose = mix(ev.pose, next.pose, smooth(f))
    const env = Math.sin(Math.PI * f)
    pose.hipR += -0.55 * env
    pose.kneeR += 0.3 * env
    pose.hipRz += -0.6 * Math.sin(2 * Math.PI * f)
  } else if (gap >= 0.45) {
    pose = f < 0.5 ? mix(ev.pose, NEUTRAL, smooth(f * 2)) : mix(NEUTRAL, next.pose, smooth(f * 2 - 1))
  } else {
    pose = mix(ev.pose, next.pose, smooth(f))
  }
  return { pose, flying: true }
}

/* ------------------------------------------------------------------------------------ player -- */

function Leg({ side, kit, hipRef, kneeRef }: { side: 1 | -1; kit: string; hipRef: RefObject<THREE.Group | null>; kneeRef: RefObject<THREE.Group | null> }) {
  return (
    <group ref={hipRef} position={[side * HIP_X, 0, 0]}>
      <Part args={[0.13, THIGH, 0.14]} position={[0, -THIGH / 2, 0]} color={C.skin} />
      <Part args={[0.15, 0.14, 0.16]} position={[0, -0.06, 0]} color={C.shorts} outline={false} />
      <group ref={kneeRef} position={[0, -THIGH, 0]}>
        <Part args={[0.11, SHIN * 0.55, 0.12]} position={[0, -SHIN * 0.25, 0]} color={C.skin} />
        <Part args={[0.12, SHIN * 0.45, 0.13]} position={[0, -SHIN * 0.75, 0]} color={C.sock} />
        <Part args={[0.12, 0.02, 0.135]} position={[0, -SHIN * 0.55, 0]} color={kit} outline={false} />
        <Part args={[0.12, FOOT_H, 0.24]} position={[0, -SHIN - FOOT_H / 2 + 0.02, 0.05]} color={C.shoe} />
      </group>
    </group>
  )
}

function Player({ kitColor, trickSet }: { kitColor: string; trickSet: SoccerTrickSet }) {
  const timeline = useMemo(() => buildTimeline(SETS[trickSet] ?? SETS.full), [trickSet])
  const root = useRef<THREE.Group>(null)
  const torso = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const hipL = useRef<THREE.Group>(null)
  const kneeL = useRef<THREE.Group>(null)
  const hipR = useRef<THREE.Group>(null)
  const kneeR = useRef<THREE.Group>(null)
  const armL = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  const ball = useRef<THREE.Group>(null)
  const ballPos = useRef<Vec>([0, 0, 0])

  useLoop((t, dt) => {
    const { pose, flying } = sample(timeline, t, ballPos.current)
    if (root.current) root.current.position.y = pelvisY(pose)
    if (hipL.current) hipL.current.rotation.set(pose.hipL, 0, 0)
    if (kneeL.current) kneeL.current.rotation.x = pose.kneeL
    if (hipR.current) hipR.current.rotation.set(pose.hipR, 0, pose.hipRz)
    if (kneeR.current) kneeR.current.rotation.x = pose.kneeR
    if (torso.current) torso.current.rotation.x = pose.lean
    if (head.current) head.current.rotation.x = pose.head
    if (armL.current) armL.current.rotation.set(-(pose.hipR - pose.hipL) * 0.3, 0, pose.armL)
    if (armR.current) armR.current.rotation.set(-(pose.hipL - pose.hipR) * 0.3, 0, pose.armR)
    if (ball.current) {
      const [x, y, z] = ballPos.current
      ball.current.position.set(x, y, z)
      if (flying) {
        ball.current.rotation.x -= dt * 9
        ball.current.rotation.z += dt * 2
      }
    }
  })

  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      <group ref={root}>
        <Leg side={1} kit={kitColor} hipRef={hipL} kneeRef={kneeL} />
        <Leg side={-1} kit={kitColor} hipRef={hipR} kneeRef={kneeR} />
        <group ref={torso}>
          <Part args={[0.34, 0.16, 0.22]} position={[0, 0.02, 0]} color={C.shorts} />
          <Part args={[0.36, 0.38, 0.22]} position={[0, 0.28, 0]} color={kitColor} />
          <Part args={[0.37, 0.04, 0.225]} position={[0, 0.12, 0]} color={C.sock} outline={false} />
          <group ref={head} position={[0, 0.5, 0]}>
            <Part args={[0.08, 0.06, 0.08]} position={[0, 0, 0]} color={C.skin} outline={false} />
            <Part args={[0.22, 0.23, 0.22]} position={[0, 0.13, 0.01]} color={C.skin} />
            <Part args={[0.23, 0.08, 0.23]} position={[0, 0.235, -0.005]} color={C.hair} />
            <Part args={[0.23, 0.12, 0.05]} position={[0, 0.17, -0.1]} color={C.hair} outline={false} />
          </group>
          {(
            [
              [1, armL],
              [-1, armR],
            ] as const
          ).map(([side, ref]) => (
            <group key={side} ref={ref} position={[side * 0.22, 0.43, 0]}>
              <Part args={[0.1, 0.12, 0.11]} position={[0, -0.04, 0]} color={kitColor} />
              <Part args={[0.08, 0.36, 0.08]} position={[0, -0.2, 0]} color={C.skin} />
            </group>
          ))}
        </group>
      </group>
      <group ref={ball}>
        <Part shape="sphere" args={[BALL_R, 1]} color={C.ball} />
        <Part args={[0.06, 0.06, 0.03]} position={[0, 0, BALL_R - 0.005]} color={C.ballPatch} outline={false} />
        <Part args={[0.06, 0.03, 0.06]} position={[0, BALL_R - 0.005, 0]} color={C.ballPatch} outline={false} />
        <Part args={[0.03, 0.06, 0.06]} position={[-BALL_R + 0.005, 0, 0]} color={C.ballPatch} outline={false} />
      </group>
    </group>
  )
}

/* ---------------------------------------------------------------------------------- scenery -- */

function Goal({ position, rotation }: { position: Vec; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Part args={[0.07, 0.9, 0.07]} position={[-0.8, 0.45, 0]} color={C.post} />
      <Part args={[0.07, 0.9, 0.07]} position={[0.8, 0.45, 0]} color={C.post} />
      <Part args={[1.67, 0.07, 0.07]} position={[0, 0.9, 0]} color={C.post} />
      <Part args={[1.6, 0.85, 0.02]} position={[0, 0.45, -0.45]} color={C.net} outline={false} />
      <Part args={[0.02, 0.85, 0.45]} position={[-0.8, 0.45, -0.22]} color={C.net} outline={false} />
      <Part args={[0.02, 0.85, 0.45]} position={[0.8, 0.45, -0.22]} color={C.net} outline={false} />
      <Part args={[1.6, 0.02, 0.45]} position={[0, 0.88, -0.22]} color={C.net} outline={false} />
    </group>
  )
}

function StreetLamp({ position }: { position: Vec }) {
  const { dark } = useIso()
  return (
    <group position={position}>
      <Part shape="cylinder" args={[0.05, 0.07, 2.4, 6]} position={[0, 1.2, 0]} color={C.pole} />
      <Part args={[0.5, 0.06, 0.12]} position={[0.22, 2.4, 0]} color={C.pole} />
      <mesh position={[0.42, 2.34, 0]}>
        <boxGeometry args={[0.16, 0.06, 0.12]} />
        <meshBasicMaterial color={dark ? C.lamp : '#e9e4d0'} toneMapped={false} />
      </mesh>
      {dark && <pointLight position={[0.42, 2.1, 0]} color={C.lamp} intensity={7} distance={6} decay={2} />}
    </group>
  )
}

function Court() {
  return (
    <group>
      <Part args={[7, 0.5, 6.4]} position={[0, -0.25, 0]} color={C.grass} />
      <Part args={[5.6, 0.06, 5.0]} position={[0, 0.03, 0]} color={C.court} />
      {/* painted lines */}
      {[
        [0, 2.4, 5.4, 0.05],
        [0, -2.4, 5.4, 0.05],
        [2.7, 0, 0.05, 4.85],
        [-2.7, 0, 0.05, 4.85],
        [0, 0, 0.05, 4.85],
      ].map(([x, z, w, d], i) => (
        <Part key={i} args={[w, 0.01, d]} position={[x, 0.065, z]} color={C.line} outline={false} />
      ))}
      <mesh position={[0, 0.066, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.85, 0.9, 28]} />
        <meshBasicMaterial color={C.line} toneMapped={false} />
      </mesh>
      {[
        [-1.6, 1.4],
        [1.7, -1.3],
      ].map(([x, z]) => (
        <Part key={`${x}${z}`} args={[0.9, 0.012, 0.7]} position={[x, 0.062, z]} color={C.courtDark} outline={false} />
      ))}
    </group>
  )
}

function Diorama({ kitColor, trickSet }: { kitColor: string; trickSet: SoccerTrickSet }) {
  return (
    <>
      <Court />
      <Goal position={[-2.0, 0.06, -2.15]} rotation={0} />
      {[
        [1.6, 1.2],
        [2.1, 0.6],
        [1.1, 1.8],
      ].map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0.06, z]}>
          <Part shape="cone" args={[0.1, 0.28, 8]} position={[0, 0.14, 0]} color={C.cone} />
          <Part args={[0.22, 0.03, 0.22]} position={[0, 0.015, 0]} color={C.cone} />
        </group>
      ))}
      {/* bench + water bottle + spare ball */}
      <group position={[2.9, 0, -1.4]} rotation={[0, Math.PI / 2, 0]}>
        <Part args={[1.3, 0.08, 0.36]} position={[0, 0.42, 0]} color={C.bench} />
        <Part args={[0.08, 0.4, 0.3]} position={[-0.55, 0.2, 0]} color={C.benchLeg} />
        <Part args={[0.08, 0.4, 0.3]} position={[0.55, 0.2, 0]} color={C.benchLeg} />
        <Part shape="cylinder" args={[0.05, 0.05, 0.2, 8]} position={[0.3, 0.56, 0.05]} color={C.bottle} />
      </group>
      <Part shape="sphere" args={[BALL_R, 1]} position={[2.6, 0.17, -0.4]} color={C.ball} />
      <group position={[-3.0, 0, 2.5]}>
        <Part shape="cylinder" args={[0.1, 0.13, 0.6, 6]} position={[0, 0.3, 0]} color={C.trunk} />
        <Part shape="sphere" args={[0.5, 0]} position={[0, 0.9, 0]} color={C.leaf} />
      </group>
      <StreetLamp position={[-3.1, 0, 0.2]} />
      <group scale={1.35}>
        <Player kitColor={kitColor} trickSet={trickSet} />
      </group>
    </>
  )
}

/** Isometric pixel-art street-court juggler. Put any content inside it as children. */
export function SoccerJuggle({ kitColor = '#e5483d', trickSet = 'full', children, ...props }: SoccerJuggleProps) {
  return (
    <IsoPixelScene
      {...props}
      outlineColor={C.outline}
      groundColor={C.grass}
      extent={[9, 7.2]}
      target={[0, 0.9, 0]}
      scene={<Diorama kitColor={kitColor} trickSet={trickSet} />}
    >
      {children}
    </IsoPixelScene>
  )
}
