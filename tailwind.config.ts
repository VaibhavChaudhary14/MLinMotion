import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        analog: {
          canvas: '#F4EFE4',
          card: '#FAF7F0',
          well: '#E8E1D3',
          border: '#1A1715',
          subtle: '#D8CFC0',
          ink: {
            primary: '#1A1715',
            secondary: '#5C544B',
            muted: '#948B7D',
          },
          vermilion: '#C83226',
          ultramarine: '#1848B8',
          amber: '#E28C05',
          sage: '#33634B',
          plum: '#6E3867',
        },
      },
      fontFamily: {
        display: ['var(--font-cabinet)', 'sans-serif'],
        sans: ['var(--font-general)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      boxShadow: {
        'analog-sm': '1.5px 1.5px 0px #1A1715',
        'analog': '3px 3px 0px #1A1715',
        'analog-lg': '5px 5px 0px #1A1715',
        'analog-inset': 'inset 2px 2px 0px rgba(26, 23, 21, 0.12)',
      },
      borderRadius: {
        none: '0px',
        DEFAULT: '2px',
        md: '3px',
      },
    },
  },
  plugins: [],
};

export default config;
