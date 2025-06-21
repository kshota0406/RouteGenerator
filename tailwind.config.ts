import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        hologram: {
          '0%, 100%': {
            textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff, 0 0 55px #ff00ff, 0 0 75px #ff00ff',
          },
          '50%': {
            textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff, 0 0 55px #00ffff, 0 0 75px #00ffff',
          },
        },
      },
      animation: {
        hologram: 'hologram 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config 