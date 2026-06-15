import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import Sun from './Sun'
import Planet from './Planet'
import Starfield from './Starfield'

function assignOrbits(repos) {
  const MIN_ORBIT = 5
  const GAP = 2.8
  return repos.map((repo, i) => ({
    repo,
    orbitRadius: MIN_ORBIT + i * GAP,
    initialAngle: (i / repos.length) * Math.PI * 2,
  }))
}

export default function SolarSystem({ profile, repos, selectedRepo, onPlanetClick }) {
  const planets = assignOrbits(repos)

  return (
    <Canvas
      camera={{ position: [0, 28, 60], fov: 55 }}
      style={{ background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000005 100%)' }}
    >
      <Suspense fallback={null}>
        <Starfield />
        <Sun profile={profile} />
        {planets.map(({ repo, orbitRadius, initialAngle }) => (
          <Planet
            key={repo.id}
            repo={repo}
            orbitRadius={orbitRadius}
            initialAngle={initialAngle}
            onClick={onPlanetClick}
            isSelected={selectedRepo?.id === repo.id}
          />
        ))}
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={8}
        maxDistance={200}
        maxPolarAngle={Math.PI * 0.85}
        minPolarAngle={Math.PI * 0.05}
      />
    </Canvas>
  )
}
