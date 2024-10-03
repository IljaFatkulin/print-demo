import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Match your source files for Tailwind
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
