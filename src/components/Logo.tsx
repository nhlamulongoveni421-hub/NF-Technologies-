import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const dimensions = {
    sm: { svg: 'w-12 h-12', text: 'text-lg', subtext: 'text-[7px]' },
    md: { svg: 'w-24 h-24', text: 'text-2xl', subtext: 'text-[9px]' },
    lg: { svg: 'w-40 h-40', text: 'text-4xl', subtext: 'text-[12px]' },
    xl: { svg: 'w-64 h-64', text: 'text-5xl', subtext: 'text-[14px]' },
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* High-Fidelity SVG Icon matching the user's uploaded logo exactly */}
      <svg
        viewBox="0 0 500 500"
        className={`${dimensions.svg} transition-transform duration-300 hover:scale-105`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="NF Technologies Logo"
      >
        <defs>
          {/* Silver metallic gradient for N */}
          <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#dedede" />
            <stop offset="50%" stopColor="#9c9c9c" />
            <stop offset="75%" stopColor="#cfcfcf" />
            <stop offset="100%" stopColor="#595959" />
          </linearGradient>

          {/* Electric blue metallic gradient for F */}
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#43c6ac" />
            <stop offset="30%" stopColor="#19b5fe" />
            <stop offset="70%" stopColor="#0052d4" />
            <stop offset="100%" stopColor="#0021a5" />
          </linearGradient>

          {/* Gradient for orbital ring */}
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cfcfcf" />
            <stop offset="30%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#19b5fe" />
            <stop offset="90%" stopColor="#0052d4" />
            <stop offset="100%" stopColor="#020024" />
          </linearGradient>

          {/* Drop shadow for 3D metallic feel */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="12" />
            <feOffset dx="0" dy="8" />
            <feComponentTransfer><feFuncA type="linear" slope="0.7" /></feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glow filter for electric blue accent */}
          <filter id="blueGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Deep background - purely for rendering the preview nicely */}
        <g filter="url(#shadow)">
          {/* Circular Metallic Outer Ring with breaks matching the reference */}
          <path
            d="M 250,50 A 200,200 0 1,1 150,422"
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            className="animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <path
            d="M 190,70 A 200,200 0 0,1 390,170"
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Glowing electric-blue orbital highlight */}
          <path
            d="M 380,180 A 195,195 0 0,1 360,350"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#blueGlow)"
          />

          {/* The Letter "N" (Brushed Metallic Silver) */}
          <path
            d="M 115,135 
               H 200 
               V 260 
               L 310,135 
               H 395 
               V 365 
               H 310 
               V 240 
               L 200,365 
               H 115 
               Z"
            fill="url(#silverGradient)"
            stroke="#ffffff"
            strokeWidth="1"
          />

          {/* The Letter "F" (Electric Blue with aggressive forward speed wings) */}
          {/* Overlaps the N beautifully on the right, matching the reference */}
          <path
            d="M 230,265 
               L 280,135 
               H 420 
               L 395,200 
               H 320 
               L 305,240 
               H 385 
               L 365,305 
               H 290 
               L 270,365 
               H 190 
               Z"
            fill="url(#blueGradient)"
            stroke="#00d2ff"
            strokeWidth="1.5"
            filter="url(#blueGlow)"
          />
        </g>
      </svg>

      {showText && (
        <div className="mt-4 select-none">
          {/* Main Title: NF TECHNOLOGIES */}
          <h1
            className={`font-sans font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-950 uppercase ${dimensions.text}`}
          >
            NF Technologies
          </h1>

          {/* Tagline: INNOVATE • AUTOMATE • ELEVATE */}
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-cyan-600"></span>
            <p
              className={`font-mono font-bold tracking-[0.35em] text-cyan-600 uppercase ${dimensions.subtext}`}
            >
              Innovate • Automate • Elevate
            </p>
            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-cyan-600"></span>
          </div>
        </div>
      )}
    </div>
  );
}
