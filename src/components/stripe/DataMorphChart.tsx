'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface ParticleSystemProps {
  count: number;
  color: string;
  mode: number;
  speed: number;
  offset: number;
  dataSeries: number[];
}

const MorphingParticles = ({ count, color, mode, speed, offset, dataSeries, seriesIndex }: ParticleSystemProps & { seriesIndex: number }) => {
  const mesh = useRef<THREE.Points>(null!);
  
  // Generate target positions for each mode
  const positions = useMemo(() => {
    const line = new Float32Array(count * 3);
    const bar = new Float32Array(count * 3);
    const donut = new Float32Array(count * 3);

    const numPoints = dataSeries.length;
    const pointsPerSegment = count / numPoints;

    for (let i = 0; i < count; i++) {
      const dataIndex = Math.floor(i / pointsPerSegment);
      const nextDataIndex = (dataIndex + 1) % numPoints;
      const segmentProgress = (i % pointsPerSegment) / pointsPerSegment;

      // 1. Literal Line Graph
      const xStart = (dataIndex - (numPoints - 1) / 2) * 2.5;
      const xEnd = (nextDataIndex - (numPoints - 1) / 2) * 2.5;
      const yStart = dataSeries[dataIndex] * 4 - 2;
      const yEnd = dataSeries[nextDataIndex] * 4 - 2;

      line[i * 3] = THREE.MathUtils.lerp(xStart, xEnd, segmentProgress);
      line[i * 3 + 1] = THREE.MathUtils.lerp(yStart, yEnd, segmentProgress);
      line[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      // 2. Literal Bar Chart (Grouped/Sorted by color)
      // We shift each series by a small amount based on its index to "sort" colors into distinct columns
      const groupWidth = 2.5;
      const barSpacing = 0.45;
      const barXCenter = (dataIndex - (numPoints - 1) / 2) * groupWidth + (seriesIndex - 2) * barSpacing;
      
      const barHeight = dataSeries[dataIndex] * 5;
      const barWidth = 0.35; // Thinner bars for grouping
      
      bar[i * 3] = barXCenter + (Math.random() - 0.5) * barWidth;
      bar[i * 3 + 1] = (Math.random() * barHeight) - 2.5;
      bar[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      // 3. Literal Donut Chart (Segmented arcs)
      const totalData = dataSeries.reduce((a, b) => a + b, 0);
      let currentAngle = 0;
      for (let j = 0; j < dataIndex; j++) {
        currentAngle += (dataSeries[j] / totalData) * Math.PI * 2;
      }
      const segmentAngle = (dataSeries[dataIndex] / totalData) * Math.PI * 2;
      const finalAngle = currentAngle + (segmentProgress * segmentAngle);
      
      const ringRadius = 2.6; // Reduced to prevent clipping
      const tubeRadius = 0.4;
      const localAngle = Math.random() * Math.PI * 2;
      
      donut[i * 3] = (ringRadius + Math.cos(localAngle) * tubeRadius) * Math.cos(finalAngle);
      donut[i * 3 + 1] = (ringRadius + Math.cos(localAngle) * tubeRadius) * Math.sin(finalAngle);
      donut[i * 3 + 2] = Math.sin(localAngle) * tubeRadius;
    }

    return { line, bar, donut };
  }, [count, dataSeries, seriesIndex]); // Added seriesIndex to dependencies

  // Stabilize the position array so it doesn't reset on re-render
  const initialArray = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state, delta) => {
    const target = mode === 0 ? positions.line : mode === 1 ? positions.bar : positions.donut;
    const posAttr = mesh.current.geometry.attributes.position;
    
    const lerpFactor = Math.min(delta * speed, 1); // Clamp lerp factor
    for (let i = 0; i < count * 3; i++) {
      posAttr.array[i] = THREE.MathUtils.lerp(posAttr.array[i], target[i], lerpFactor);
      
      // Jitter only when close to target to keep it "steady" but alive
      const dist = Math.abs(posAttr.array[i] - target[i]);
      if (dist < 0.2) {
        posAttr.array[i] += Math.sin(state.clock.elapsedTime * 4 + i) * 0.002;
      }
    }
    posAttr.needsUpdate = true;
    
    // Perspective rotation based on mode
    if (mode === 2) {
      mesh.current.rotation.y += delta * 0.2;
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, 0.4, delta);
    } else {
      mesh.current.rotation.y += delta * 0.05;
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, 0, delta);
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={initialArray}
          itemSize={3}
          args={[initialArray, 3]}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        vertexColors={false}
        color={color}
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
      />
    </points>
  );
};

interface ChartFrameProps {
  mode: number;
}

const FadingGridElement = ({ type, args, position, rotation, color, opacity, isMinor }: any) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uOpacity.value,
        opacity,
        delta * 2
      );
    }
  });

  const shader = useMemo(() => ({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 0 },
      uIsVertical: { value: type === 'v' },
      uIsPolar: { value: type === 'r' }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      void main() {
        vUv = uv;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform bool uIsVertical;
      uniform bool uIsPolar;
      void main() {
        float fade = 1.0;
        if (uIsPolar) {
          // Circular fade for rings
          fade = 1.0 - smoothstep(2.5, 5.0, length(vWorldPosition.xy));
        } else {
          // Edge fade for Cartesian lines
          float dist = uIsVertical ? abs(vUv.y - 0.5) * 2.0 : abs(vUv.x - 0.5) * 2.0;
          fade = 1.0 - smoothstep(0.4, 1.0, dist);
          
          // Global radial fade overlay
          float globalFade = 1.0 - smoothstep(4.0, 8.0, length(vWorldPosition.xy));
          fade *= globalFade;
        }
        gl_FragColor = vec4(uColor, uOpacity * fade);
      }
    `
  }), [color, type]);

  return (
    <mesh position={position} rotation={rotation}>
      {type === 'r' ? <torusGeometry args={args} /> : <planeGeometry args={args} />}
      <shaderMaterial ref={materialRef} {...shader} transparent depthWrite={false} />
    </mesh>
  );
};

const ChartFrame = ({ mode }: ChartFrameProps) => {
  const isDonut = mode === 2;
  const targetOpacity = isDonut ? 0.25 : 0.12;

  const cartesianGrid = useMemo(() => {
    const horizontal = [];
    const vertical = [];
    for (let y = -4; y <= 4; y += 0.5) {
      horizontal.push({ y, isMinor: y % 2 !== 0.5 && y % 1 !== 0 });
    }
    for (let x = -8; x <= 8; x += 0.5) {
      vertical.push({ x, isMinor: x % 3 !== 0 && x % 1.5 !== 0 });
    }
    return { horizontal, vertical };
  }, []);

  return (
    <group>
      {/* Cartesian Frame */}
      <group visible={mode !== 2}>
        {cartesianGrid.horizontal.map((line, i) => (
          <FadingGridElement
              key={`h-${i}`}
            type="h"
            args={[16, line.isMinor ? 0.008 : 0.025]}
            position={[0, line.y, -0.1]}
            color="#4F2683"
            opacity={targetOpacity * (line.isMinor ? 0.4 : 1)}
          />
        ))}
        {cartesianGrid.vertical.map((line, i) => (
          <FadingGridElement
              key={`v-${i}`}
            type="v"
            args={[line.isMinor ? 0.008 : 0.025, 10]}
            position={[line.x, 0, -0.1]}
            color="#4F2683"
            opacity={targetOpacity * (line.isMinor ? 0.4 : 1)}
          />
        ))}
      </group>

      {/* Polar Frame */}
      <group visible={mode === 2} rotation={[0.4, 0, 0]}>
        {[2.2, 2.6, 3.0].map((r, i) => (
          <FadingGridElement
            key={`r-${r}`}
            type="r"
            args={[r, 0.01, 16, 100]}
            rotation={[Math.PI / 2, 0, 0]}
            color="#09A5B6"
            opacity={targetOpacity}
          />
        ))}
        {[0, Math.PI / 4, Math.PI / 2, Math.PI * 0.75].map((a, i) => (
          <FadingGridElement
            key={`a-${i}`}
            type="a"
            args={[8, 0.01]}
            rotation={[0, 0, a]}
            color="#09A5B6"
            opacity={targetOpacity}
          />
        ))}
      </group>
    </group>
  );
};

const DataMorphChart = () => {
  const [mode, setMode] = useState(0);
  
  // Official brand palette
  const brandColors = useMemo(() => [
    { color: "#4F2683", data: [0.4, 0.7, 0.5, 0.9, 0.6, 0.8], speed: 2.2, offset: 0 },
    { color: "#09A5B6", data: [0.3, 0.5, 0.8, 0.4, 0.7, 0.5], speed: 2.0, offset: Math.PI * 0.4 },
    { color: "#CF1259", data: [0.5, 0.3, 0.6, 0.8, 0.4, 0.9], speed: 2.4, offset: Math.PI * 0.8 },
    { color: "#FA9F42", data: [0.8, 0.4, 0.7, 0.5, 0.9, 0.3], speed: 2.1, offset: Math.PI * 1.2 },
    { color: "#25084A", data: [0.6, 0.8, 0.4, 0.7, 0.5, 0.6], speed: 1.9, offset: Math.PI * 1.6 },
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMode((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '280px', cursor: 'pointer' }} onClick={() => setMode((m) => (m + 1) % 3)}>
      <Canvas camera={{ position: [0, 0, 10], fov: 42 }} dpr={[1, 2]}>
        <ambientLight intensity={0.8} />
        <group position={[0, -0.8, 0]}> {/* Offset entire scene down by ~10% of viewport height */}
          <ChartFrame mode={mode} />
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            {brandColors.map((series, i) => (
              <MorphingParticles 
                key={i}
                seriesIndex={i}
                count={350} 
                color={series.color} 
                mode={mode} 
                speed={series.speed} 
                offset={series.offset} 
                dataSeries={series.data}
              />
            ))}
          </Float>
        </group>
      </Canvas>
    </div>
  );
};

export default DataMorphChart;
