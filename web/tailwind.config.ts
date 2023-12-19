import type { Config } from 'tailwindcss';

export default {
  mode: 'jit',
  darkMode: 'class',
  content: ['./src/**/*.{tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
