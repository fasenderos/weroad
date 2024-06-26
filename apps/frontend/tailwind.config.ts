import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default (<Partial<Config>>{
	theme: {
		fontFamily: {
			sans: ["Inter Variable", "sans-serif"],
			heading: ["Inter Variable", "sans-serif"],
		},
		extend: {
			colors: {
				primary: colors.red,
			},
		},
	},
});
