import { useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Sun({ profile }) {
  const meshRef = useRef()

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.1
  })

  return (
    <group>
      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshBasicMaterial color="#ff8800" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      {/* Sun body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshStandardMaterial
          color="#ff9500"
          emissive="#ff6600"
          emissiveIntensity={0.8}
          roughness={0.8}
          metalness={0}
        />
      </mesh>

      {/* Point light so planets get lit */}
      <pointLight color="#fff8e7" intensity={4} distance={200} decay={1.2} />
      <ambientLight intensity={0.15} />
    </group>
  )
}
