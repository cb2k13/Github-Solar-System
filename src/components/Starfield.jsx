import { Stars } from '@react-three/drei'

export default function Starfield() {
  return (
    <Stars
      radius={300}
      depth={60}
      count={6000}
      factor={4}
      saturation={0.3}
      fade
      speed={0.4}
    />
  )
}
