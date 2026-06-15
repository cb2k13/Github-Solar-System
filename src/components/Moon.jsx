import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export default function Moon({ contributor, index, totalMoons }) {
  const groupRef = useRef()
  const angle = useRef((index / totalMoons) * Math.PI * 2)
  const radius = 1.2
  const speed = 0.6 + index * 0.15

  useFrame((_, delta) => {
    angle.current += delta * speed
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle.current) * radius
      groupRef.current.position.z = Math.sin(angle.current) * radius
    }
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#aaaaaa" roughness={0.9} />
      </mesh>
      <Html
        center
        distanceFactor={12}
        style={{ pointerEvents: 'none' }}
      >
        <div className="text-[9px] text-gray-300 bg-black/60 px-1 rounded whitespace-nowrap">
          {contributor.login}
        </div>
      </Html>
    </group>
  )
}
