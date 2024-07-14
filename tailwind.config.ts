import type { Config } from "tailwindcss";
import { neutral, sky } from "tailwindcss/colors";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: sky,
        paper: neutral,
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
