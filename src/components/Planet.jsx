import { useRef, useState, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Torus } from '@react-three/drei'
import * as THREE from 'three'
import Moon from './Moon'
import { getLangColor } from '../utils/colorMap'

function orbitSpeed(repo) {
  const daysSinceUpdate =
    (Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24)
  // Fresh repos orbit fast; stale repos orbit slow
  return Math.max(0.02, Math.min(0.5, 30 / (daysSinceUpdate + 10)))
}

function planetSize(repo) {
  const stars = repo.stargazers_count
  if (stars === 0) return 0.22
  return Math.min(0.22 + Math.log10(stars + 1) * 0.18, 0.8)
}

export default function Planet({ repo, orbitRadius, initialAngle, onClick, isSelected }) {
  const groupRef = useRef()
  const meshRef = useRef()
  const angle = useRef(initialAngle)
  const speed = useMemo(() => orbitSpeed(repo), [repo])
  const size = useMemo(() => planetSize(repo), [repo])
  const color = useMemo(() => getLangColor(repo.language), [repo])
  const [hovered, setHovered] = useState(false)
  const pointerDown = useRef({ x: 0, y: 0 })

  useFrame((_, delta) => {
    angle.current += delta * speed
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle.current) * orbitRadius
      groupRef.current.position.z = Math.sin(angle.current) * orbitRadius
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <>
      {/* Orbit ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.015, orbitRadius + 0.015, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>

      <group ref={groupRef}>
        {/* Issue rings (like Saturn) */}
        {repo.open_issues_count > 0 && (
          <mesh rotation={[Math.PI / 3.5, 0, 0]}>
            <torusGeometry args={[size * 1.5, size * 0.08, 8, 64]} />
            <meshStandardMaterial color={color} transparent opacity={0.55} />
          </mesh>
        )}

        {/* Planet sphere */}
        <mesh
          ref={meshRef}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
          onPointerDown={(e) => { e.stopPropagation(); pointerDown.current = { x: e.clientX, y: e.clientY } }}
          onPointerUp={(e) => {
            e.stopPropagation()
            const dx = Math.abs(e.clientX - pointerDown.current.x)
            const dy = Math.abs(e.clientY - pointerDown.current.y)
            if (dx < 5 && dy < 5) onClick(repo)
          }}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={isSelected || hovered ? color : '#000000'}
            emissiveIntensity={isSelected ? 0.45 : hovered ? 0.25 : 0}
            roughness={0.65}
            metalness={0.1}
          />
        </mesh>

        {/* Moons */}
        {repo.contributors?.slice(0, 3).map((c, i) => (
          <Moon key={c.login} contributor={c} index={i} totalMoons={Math.min(repo.contributors.length, 3)} />
        ))}

        {/* Hover label */}
        {hovered && (
          <Html center distanceFactor={15} style={{ pointerEvents: 'none' }}>
            <div className="text-xs text-white bg-black/75 px-2 py-1 rounded whitespace-nowrap border border-white/20">
              {repo.name}
            </div>
          </Html>
        )}
      </group>
    </>
  )
}
