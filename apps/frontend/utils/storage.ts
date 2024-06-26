export const WEROAD_CARTS_KEY = "weroad-carts";

export function saveToStorage<T>(
	key: string,
	value: T,
	type: "local" | "session" = "session",
	stringify?: boolean,
): void {
	try {
		const storage = type === "session" ? sessionStorage : localStorage;
		const data = stringify ? JSON.stringify(value) : value;
		// @ts-ignore
		storage.setItem(key, data);
	} catch {}
}

export function getFromStorage<T>(
	key: string,
	type: "local" | "session" = "session",
	parse?: boolean,
): T | null {
	let value = null;
	try {
		const storage = type === "session" ? sessionStorage : localStorage;
		value = storage.getItem(key);
		if (value && parse === true) {
			value = JSON.parse(value);
		}
	} catch {}
	return value;
}

export function removeFromStorage(
	key: string,
	type: "local" | "session" = "session",
) {
	const storage = type === "session" ? sessionStorage : localStorage;
	storage.removeItem(key);
}
