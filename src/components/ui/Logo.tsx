"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "light" | "dark";
}

export default function Logo({ size = "md", showText = true, variant = "dark" }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-lg" },
    md: { icon: 40, text: "text-xl" },
    lg: { icon: 48, text: "text-2xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="nGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f0f0ff" />
          </linearGradient>
        </defs>

        {/* Main rounded square */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          fill="url(#logoGradient)"
        />

        {/* Subtle inner glow */}
        <rect
          x="4"
          y="4"
          width="40"
          height="40"
          rx="10"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />

        {/* Letter "n" - modern geometric style */}
        <path
          d="M14 32V20.5C14 18.5 15.5 17 17.5 17C19.5 17 21 18.5 21 20.5V32"
          stroke="url(#nGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M21 23C21 19.5 23.5 17 27 17C30.5 17 33 19.5 33 23V32"
          stroke="url(#nGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Connection dot - represents relationships */}
        <circle
          cx="37"
          cy="13"
          r="4"
          fill="white"
          fillOpacity="0.9"
        />
        <circle
          cx="37"
          cy="13"
          r="2"
          fill="url(#logoGradient)"
        />
      </svg>

      {showText && (
        <span className={`${text} font-bold tracking-tight ${variant === "dark" ? "text-zinc-900" : "text-white"}`}>
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">n</span>
          <span className={variant === "dark" ? "text-zinc-800" : "text-white"}>CRM</span>
        </span>
      )}
    </div>
  );
}
