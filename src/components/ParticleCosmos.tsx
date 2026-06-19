"use client";

import React, { useEffect, useRef } from "react";

// Dala Brand Colors
const COLORS = [
  "#8052ff", // Plum Voltage
  "#ffb829", // Amber Spark
  "#15846e", // Lichen
  "#ffffff", // Bone
];

const SHAPES = ["circle", "triangle", "diamond", "square"];

class Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  shape: string;
  speed: number;
  angle: number;
  orbitRadius: number;

  constructor(width: number, height: number) {
    // Distribute heavily towards the right center
    const centerX = width * 0.75;
    const centerY = height * 0.5;

    // Use a gaussian-like distribution to cluster them
    const u = Math.random();
    const v = Math.random();
    const radius = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * (width * 0.15);
    const theta = Math.random() * 2 * Math.PI;

    this.baseX = centerX + radius * Math.cos(theta);
    this.baseY = centerY + radius * Math.sin(theta);

    // Some particles are just drifting in the void
    if (Math.random() > 0.8) {
      this.baseX = Math.random() * width;
      this.baseY = Math.random() * height;
    }

    this.x = this.baseX;
    this.y = this.baseY;

    this.size = Math.random() * 4 + 2; // 2 to 6px
    
    // Weighted color selection (mostly Bone and Plum, some Lichen and Amber)
    const colorRand = Math.random();
    if (colorRand < 0.5) this.color = COLORS[3]; // Bone
    else if (colorRand < 0.8) this.color = COLORS[0]; // Plum Voltage
    else if (colorRand < 0.9) this.color = COLORS[2]; // Lichen
    else this.color = COLORS[1]; // Amber Spark

    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    this.speed = Math.random() * 0.005 + 0.001;
    this.angle = Math.random() * Math.PI * 2;
    this.orbitRadius = Math.random() * 30 + 5;
  }

  update() {
    this.angle += this.speed;
    this.x = this.baseX + Math.cos(this.angle) * this.orbitRadius;
    this.y = this.baseY + Math.sin(this.angle) * this.orbitRadius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    if (this.shape === "circle") {
      ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shape === "square") {
      ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else if (this.shape === "triangle") {
      ctx.moveTo(this.x, this.y - this.size / 2);
      ctx.lineTo(this.x + this.size / 2, this.y + this.size / 2);
      ctx.lineTo(this.x - this.size / 2, this.y + this.size / 2);
      ctx.closePath();
      ctx.fill();
    } else if (this.shape === "diamond") {
      ctx.moveTo(this.x, this.y - this.size / 2);
      ctx.lineTo(this.x + this.size / 2, this.y);
      ctx.lineTo(this.x, this.y + this.size / 2);
      ctx.lineTo(this.x - this.size / 2, this.y);
      ctx.closePath();
      ctx.fill();
    }
  }
}

export function ParticleCosmos() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 3000); // adjust density
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      // Semi-transparent black to create a slight trail effect, but keep it mostly clean
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "#000000" }}
    />
  );
}
