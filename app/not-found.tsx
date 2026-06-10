'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Home, Dumbbell, RotateCcw } from 'lucide-react';

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Keep game state refs to access in the anim loop without re-triggering useEffect
  const stateRef = useRef({
    gameState: 'idle',
    score: 0,
    playerY: 140,
    playerDy: 0,
    isJumping: false,
    obstacles: [] as Array<{ x: number; y: number; width: number; height: number; emoji: string; speed: number }>,
    obstacleTimer: 0,
    bgStars: [] as Array<{ x: number; y: number; size: number; speed: number }>,
  });

  useEffect(() => {
    // Load high score from local storage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('momentum-runner-highscore');
      if (saved) setHighScore(parseInt(saved, 10));
    }
  }, []);

  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  // Initializing stars for background parallax effect
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 25; i++) {
      stars.push({
        x: Math.random() * 600,
        y: Math.random() * 120,
        size: Math.random() * 2,
        speed: 0.2 + Math.random() * 0.5,
      });
    }
    stateRef.current.bgStars = stars;
  }, []);

  const startGame = () => {
    setScore(0);
    setGameState('playing');
    stateRef.current.score = 0;
    stateRef.current.playerY = 140;
    stateRef.current.playerDy = 0;
    stateRef.current.isJumping = false;
    stateRef.current.obstacles = [];
    stateRef.current.obstacleTimer = 0;
  };

  const handleJump = () => {
    if (stateRef.current.gameState === 'idle') {
      startGame();
    } else if (stateRef.current.gameState === 'gameover') {
      startGame();
    } else if (stateRef.current.gameState === 'playing' && !stateRef.current.isJumping) {
      stateRef.current.playerDy = -9.5;
      stateRef.current.isJumping = true;
    }
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    const canvasWidth = 600;
    const canvasHeight = 180;
    const groundY = 160;

    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#050506';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw background stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      stateRef.current.bgStars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
        if (stateRef.current.gameState === 'playing') {
          star.x -= star.speed;
          if (star.x < 0) star.x = canvasWidth;
        }
      });

      // Draw ground line
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvasWidth, groundY);
      ctx.stroke();

      const game = stateRef.current;

      // Update Player Physics
      if (game.gameState === 'playing') {
        game.playerDy += 0.45; // Gravity
        game.playerY += game.playerDy;

        if (game.playerY >= groundY - 24) {
          game.playerY = groundY - 24;
          game.playerDy = 0;
          game.isJumping = false;
        }
      }

      // Draw Player Runner Emoji 🏃
      ctx.font = '22px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      // Make runner rotate slightly or hop when jumping
      ctx.save();
      ctx.translate(50 + 11, game.playerY + 12);
      if (game.isJumping) {
        ctx.rotate(-0.1);
      }
      ctx.fillText('🏃', -11, -12);
      ctx.restore();

      // Handle Obstacles Spawning
      if (game.gameState === 'playing') {
        game.obstacleTimer++;
        if (game.obstacleTimer > 100 + Math.random() * 60) {
          game.obstacleTimer = 0;
          const obstaclesPool = ['🍕', '🍔', '🍩', '🏋️', '💪', '🍰'];
          const randomEmoji = obstaclesPool[Math.floor(Math.random() * obstaclesPool.length)];
          game.obstacles.push({
            x: canvasWidth,
            y: groundY - 24,
            width: 22,
            height: 22,
            emoji: randomEmoji,
            speed: 3.5 + Math.floor(game.score / 250) * 0.5,
          });
        }
      }

      // Draw & Update Obstacles
      for (let i = game.obstacles.length - 1; i >= 0; i--) {
        const obs = game.obstacles[i];
        
        if (game.gameState === 'playing') {
          obs.x -= obs.speed;
        }

        // Draw obstacle emoji
        ctx.font = '18px Arial';
        ctx.fillText(obs.emoji, obs.x, obs.y + 1);

        // Collision detection
        const px = 50;
        const py = game.playerY;
        const pWidth = 18;
        const pHeight = 22;

        if (
          px < obs.x + obs.width - 4 &&
          px + pWidth - 4 > obs.x &&
          py < obs.y + obs.height - 4 &&
          py + pHeight - 4 > obs.y
        ) {
          // Collision happened! Game Over
          setGameState('gameover');
          setHighScore(prev => {
            const nextHigh = Math.max(prev, game.score);
            localStorage.setItem('momentum-runner-highscore', nextHigh.toString());
            return nextHigh;
          });
        }

        // Score update on pass
        if (obs.x + obs.width < px && !(obs as any).passed && game.gameState === 'playing') {
          (obs as any).passed = true;
          game.score += 50;
          setScore(game.score);
        }

        // Remove offscreen obstacles
        if (obs.x < -40) {
          game.obstacles.splice(i, 1);
        }
      }

      // Render Overlay prompts based on gameState
      if (game.gameState === 'idle') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('CLICK / TAP OR PRESS SPACE TO JUMP', canvasWidth / 2, canvasHeight / 2 - 10);
        ctx.fillStyle = '#a1a1aa';
        ctx.font = '10px font-mono';
        ctx.fillText('AVOID PIZZA, BURGERS & JUNK OBSTACLES', canvasWidth / 2, canvasHeight / 2 + 12);
      } else if (game.gameState === 'gameover') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 15px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvasWidth / 2, canvasHeight / 2 - 15);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px system-ui';
        ctx.fillText(`Final Score: ${game.score} pts`, canvasWidth / 2, canvasHeight / 2 + 8);
        ctx.fillStyle = '#a1a1aa';
        ctx.font = '9px font-mono';
        ctx.fillText('TAP OR PRESS SPACE TO RESTART', canvasWidth / 2, canvasHeight / 2 + 28);
      }

      animFrameId = requestAnimationFrame(gameLoop);
    };

    animFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  return (
    <div className="min-screen-height flex flex-col items-center justify-center p-6 bg-black text-[#f4f4f5] select-none text-center">
      
      {/* 404 Heading */}
      <div className="space-y-2 max-w-md mx-auto mb-6 mt-12">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 tracking-tighter">
          404
        </h1>
        <h2 className="text-lg font-bold text-white tracking-tight">Page Not Found</h2>
        <p className="text-xs text-[#a1a1aa] leading-relaxed">
          Looks like this route is out of training scope. While you are resting, keep your streaks burning in our mini fitness runner game!
        </p>
      </div>

      {/* Game Center */}
      <div className="w-full max-w-[600px] bg-[#09090b] border border-[#27272a] rounded-2xl p-4 md:p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between text-xs px-2">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Dumbbell className="w-4 h-4 text-brand-success" />
            <span>Score: <span className="font-mono text-brand-success">{score}</span></span>
          </div>
          <div className="text-zinc-400 font-semibold">
            High Score: <span className="font-mono text-white">{highScore}</span>
          </div>
        </div>

        {/* Canvas Game element */}
        <div 
          onClick={handleJump}
          onTouchStart={(e) => {
            e.preventDefault();
            handleJump();
          }}
          className="relative overflow-hidden rounded-xl border border-white/5 cursor-pointer bg-[#050506] w-full"
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={180}
            className="w-full h-auto block aspect-[600/180]"
          />
        </div>

        {/* Restart / Jump Trigger buttons for mobile/visual assistance */}
        <div className="flex justify-center gap-4">
          {gameState === 'gameover' ? (
            <button
              onClick={startGame}
              className="py-2 px-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer active-bounce"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Play Again
            </button>
          ) : (
            <button
              onClick={handleJump}
              className="py-2 px-6 bg-brand-success hover:bg-brand-success-hover text-black rounded-xl text-xs font-extrabold transition-colors cursor-pointer active-bounce"
            >
              TAP TO JUMP
            </button>
          )}
        </div>
      </div>

      {/* Navigation redirects */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-8 max-w-sm w-full">
        <Link 
          href="/today"
          className="w-full py-2.5 px-4 bg-[#121214] hover:bg-[#18181b] border border-[#27272a] rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4 text-brand-success" />
          Back to Today Hub
        </Link>
      </div>

    </div>
  );
}
