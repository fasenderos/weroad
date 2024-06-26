import { isAfter } from "date-fns";
import type { Cart } from "../types/travels";
import { WEROAD_CARTS_KEY, removeFromStorage } from "./storage";
type CartStorage = Record<string, Cart>;

export function getValidCart(travelId: string): Cart | null {
	// Get saved carts
	const savedCarts = getFromStorage<CartStorage>(
		WEROAD_CARTS_KEY,
		"session",
		true,
	);

	// Check if a cart exist for the given travel
	if (savedCarts?.[travelId]) {
		// If cart is expired remove from storage
		if (!isValidCart(savedCarts[travelId])) {
			delete savedCarts[travelId];
			// Update the storage
			saveToStorage(WEROAD_CARTS_KEY, savedCarts, "session", true);
			return null;
		}
		// Return the finded cart
		return savedCarts[travelId];
	}
	return null;
}

export function saveCart(cart: Cart): Cart | null {
	if (isValidCart(cart)) {
		const savedCarts = getCarts();
		let cartStorage: CartStorage = {};
		if (savedCarts) {
			cartStorage = {
				...savedCarts,
			};
		}
		// override any previous cart for the same travel (only one cart per travel)
		cartStorage[cart.travelId] = cart;
		saveToStorage<CartStorage>(WEROAD_CARTS_KEY, cartStorage, "session", true);
		return cart;
	}
	return null;
}

export function removeCart(travelId: string): void {
	const savedCarts = getCarts();
	if (savedCarts?.[travelId]) {
		delete savedCarts[travelId];
		if (Object.keys(savedCarts).length > 0) {
			saveCarts(savedCarts);
		} else {
			removeFromStorage(WEROAD_CARTS_KEY, "session");
		}
	}
}

export function saveCarts(carts: CartStorage): CartStorage {
	const savedCarts = { ...carts };
	// Remove any expired cart before saving on storage
	for (const [travelId, cart] of Object.entries<Cart>(carts)) {
		if (!isValidCart(cart)) {
			delete savedCarts[travelId];
		}
	}
	saveToStorage(WEROAD_CARTS_KEY, savedCarts, "session", true);
	return savedCarts;
}
export function getCarts(): CartStorage | null {
	return getFromStorage<CartStorage>(WEROAD_CARTS_KEY, "session", true);
}

export function isValidCart(cart: Cart): boolean {
	const now = new Date();
	return isAfter(cart.expiresAt, now);
}
