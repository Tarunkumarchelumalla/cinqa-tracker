import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-space': '#060B18',
        'void-grey': '#1C2133',
        'arc-blue': '#1A6BFF',
        'ghost-white': '#E8EAEF',
        'canvas': '#0D1220',
        'sidebar': '#0A0F1E',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      transitionTimingFunction: {
        cinqa: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config
