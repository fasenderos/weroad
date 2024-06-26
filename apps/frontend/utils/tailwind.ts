import tailwindDefaultColors from "tailwindcss/colors";
import tailwindConfig from "~/tailwind.config.js";
const colors = {
	...tailwindDefaultColors,
	...(tailwindConfig.theme?.extend?.colors
		? tailwindConfig.theme.extend.colors
		: {}),
};

// Get Tailwind HEX color from Tailwind class eg. blue or with variants blue-400
function getTailwindColor(colorClass: string) {
	const color = colorClass.split("-");
	// @ts-ignore
	const colorValue = colors[color[0]];
	if (!colorValue) {
		return "#000000"; // Fallback color if not found
	}
	return typeof colorValue === "object"
		? colorValue[color[1] ?? 500]
		: colorValue;
}
// Convert HEX to RGB
function hexToRgb(hexColor: string) {
	const hex = hexColor.replace(
		/^#?([a-f\d])([a-f\d])([a-f\d])$/i,
		(_, r: string, g: string, b: string) => `#${r}${r}${g}${g}${b}${b}`,
	);
	const bigint = Number.parseInt(hex.slice(1), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	return `rgb(${r}, ${g}, ${b})`;
}
// Convert Tailwind color class to RGB
export function tailwindToRgb(colorClass: string) {
	const hexColor = getTailwindColor(colorClass);
	return hexToRgb(hexColor);
}
