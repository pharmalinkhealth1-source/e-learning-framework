'use client';

import React, { Suspense } from 'react';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';

const InsightsGradient = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <ShaderGradientCanvas
        pixelDensity={1} // As requested in the new snippet
        fov={45}
        style={{ pointerEvents: 'none' }}
      >
        <Suspense fallback={null}>
          <ShaderGradient
            animate="on"
            brightness={1.2}
            cAzimuthAngle={180}
            cDistance={3.6}
            cPolarAngle={90}
            cameraZoom={1}
            color1="#f9f6fe"
            color2="#ecfffe"
            color3="#fff4fd"
            envPreset="city"
            grain="off"
            lightType="3d"
            positionX={-1.4}
            positionY={0}
            positionZ={0}
            reflection={0.1}
            rotationX={0}
            rotationY={10}
            rotationZ={50}
            shader="defaults"
            type="plane"
            uAmplitude={1}
            uDensity={1.3}
            uFrequency={5.5}
            uSpeed={0.3}
            uStrength={2.1}
            uTime={0}
            wireframe={false}
          />
        </Suspense>
      </ShaderGradientCanvas>
    </div>
  );
};

export default InsightsGradient;
