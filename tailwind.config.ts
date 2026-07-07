import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        mobile: {'max': '430px'},
        tablet: {'min': '768px', 'max': '1024px'},
        desktop: {'min': '1280px', 'max': '1919px'},
        wide: '1920px',
      },
    },
  },
  plugins: [],
};

export default config;
