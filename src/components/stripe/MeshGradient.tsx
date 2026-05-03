"use client";

import React, { useEffect, useRef } from 'react';

// MiniGL: A lightweight WebGL wrapper for the Stripe-style gradient
class MiniGL {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  mesh: any;
  program: WebGLProgram | null = null;
  time = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl', { antialias: true });
    if (!gl) throw new Error('WebGL not supported');
    this.gl = gl;
    this.init();
  }

  init() {
    const gl = this.gl;
    const vertexShader = this.createShader(gl.VERTEX_SHADER, `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `);

    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec3 uColor4;

      // Simple noise function
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float t = uTime * 0.5;

        // Create flowing waves
        float w1 = sin(p.x * 2.0 + t) * 0.5 + 0.5;
        float w2 = cos(p.y * 3.0 - t * 0.8) * 0.5 + 0.5;
        float w3 = sin((p.x + p.y) * 1.5 + t * 1.2) * 0.5 + 0.5;

        vec3 color = mix(uColor1, uColor2, w1);
        color = mix(color, uColor3, w2);
        color = mix(color, uColor4, w3);

        // Add subtle grain/noise for texture
        float n = (noise(vUv + t * 0.01) - 0.5) * 0.05;
        color += n;

        gl_FragColor = vec4(color, 1.0);
      }
    `);

    if (vertexShader && fragmentShader) {
      this.program = gl.createProgram();
      if (this.program) {
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        gl.useProgram(this.program);
      }
    }

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(this.program!, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  }

  createShader(type: number, source: string) {
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    return shader;
  }

  render(time: number, colors: string[]) {
    const gl = this.gl;
    if (!this.program) return;

    const uTime = gl.getUniformLocation(this.program, 'uTime');
    gl.uniform1f(uTime, time);

    colors.forEach((hex, i) => {
      const rgb = this.hexToRgb(hex);
      const uColor = gl.getUniformLocation(this.program!, `uColor${i + 1}`);
      gl.uniform3f(uColor, rgb.r / 255, rgb.g / 255, rgb.b / 255);
    });

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }
}

interface MeshGradientProps {
  colors?: string[];
  speed?: number;
}

const MeshGradient: React.FC<MeshGradientProps> = ({ 
  colors = ['#ff5f6d', '#ffc371', '#635bff', '#00d4ff'],
  speed = 0.01 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const miniGLRef = useRef<MiniGL | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      miniGLRef.current = new MiniGL(canvasRef.current);
      let animationFrameId: number;
      let time = 0;

      const render = () => {
        time += speed;
        miniGLRef.current?.render(time, colors);
        animationFrameId = requestAnimationFrame(render);
      };

      render();
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [colors, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
      width={800}
      height={600}
    />
  );
};

export default MeshGradient;
