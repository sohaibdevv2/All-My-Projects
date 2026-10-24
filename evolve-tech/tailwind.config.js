/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      button: {
        base: 'py-2 px-4 rounded',
        primary: 'bg-blue-500 hover:bg-blue-700 text-white font-bold',
        secondary: 'bg-gray-500 hover:bg-gray-700 text-white font-bold',
        // You can add more button variants as needed
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};
