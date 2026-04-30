"use client";

import { useEffect, useRef } from 'react';

interface AnimatedCharacterProps {
  isPasswordFocused: boolean;
}

export default function AnimatedCharacter({ isPasswordFocused }: AnimatedCharacterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cute panda/woman face
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Face
    ctx.fillStyle = '#FFC0CB';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    if (isPasswordFocused) {
      // Hands covering eyes
      ctx.fillStyle = '#FFB6C1';
      
      // Left hand
      ctx.beginPath();
      ctx.ellipse(centerX - 40, centerY - 10, 30, 40, 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Right hand
      ctx.beginPath();
      ctx.ellipse(centerX + 40, centerY - 10, 30, 40, -0.3, 0, Math.PI * 2);
      ctx.fill();
      
      // Fingers
      ctx.strokeStyle = '#FF69B4';
      ctx.lineWidth = 3;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX - 40 + (i * 10), centerY - 30);
        ctx.lineTo(centerX - 40 + (i * 10), centerY + 10);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 40 + (i * 10), centerY - 30);
        ctx.lineTo(centerX + 40 + (i * 10), centerY + 10);
        ctx.stroke();
      }
    } else {
      // Open eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(centerX - 25, centerY - 10, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 25, centerY - 10, 15, 0, Math.PI * 2);
      ctx.fill();

      // Pupils
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(centerX - 25, centerY - 10, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 25, centerY - 10, 8, 0, Math.PI * 2);
      ctx.fill();

      // Sparkle in eyes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(centerX - 22, centerY - 13, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 28, centerY - 13, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nose
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 10, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth (smile)
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY + 20, 25, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Blush
    ctx.fillStyle = 'rgba(255, 105, 180, 0.3)';
    ctx.beginPath();
    ctx.ellipse(centerX - 55, centerY + 15, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(centerX + 55, centerY + 15, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();

  }, [isPasswordFocused]);

  return (
    <div className="flex items-center justify-center p-6">
      <canvas
        ref={canvasRef}
        width={250}
        height={250}
        className="transition-all duration-500 transform hover:scale-105"
      />
    </div>
  );
}
