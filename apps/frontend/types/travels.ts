export interface Moods {
	nature: number;
	relax: number;
	history: number;
	culture: number;
	party: number;
}
export interface Travel {
	id: string;
	name: string;
	description: string;
	slug: string;
	maxCapacity: number;
	startingDate: Date;
	endingDate: Date;
	price: number;
	moods: Moods;
}

export interface GetTravelsData {
	travels: Travel[];
}

export interface GetTravelByIdData {
	travel: Travel;
}

export interface Cart {
	id: string;
	email: string;
	expiresAt: Date;
	lockedSeats: number;
	travelId: string;
}

export interface Booking {
	id: string;
	travelId: string;
	seatsReserved: number;
}

export interface InitCartResponse {
	initCart: Cart;
}

export interface ResetCartResponse {
	resetCart: Cart;
}

export interface ReserveBookingResponse {
	reserveBooking: Booking;
}

export interface TravelAvailabilityResponse {
	availability: number;
}
