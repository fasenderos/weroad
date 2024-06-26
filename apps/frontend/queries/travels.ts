import gql from "graphql-tag";

export const GET_TRAVELS = gql`
  query {
    travels {
      id
      name
      description
      slug
      moods {
        nature
        relax
        party
        history
        culture
      }
      maxCapacity
      startingDate
      endingDate
      price
    }
  }
`;

export const GET_TRAVEL_BY_ID = gql`
  query getTravelById($id: String!) {
    travel(id: $id) {
      id
      name
      description
      slug
      moods {
        nature
        relax
        party
        history
        culture
      }
      maxCapacity
      startingDate
      endingDate
      price
    }
  }
`;

export const TRAVEL_AVAILABILITY = gql`
  query getTravelAvailability($id: String!) {
    availability(id: $id)
  }
`;

export const INIT_CART = gql`
  mutation initCart($input: CreateCartDto!) {
    initCart(input: $input) {
      id
      email
      expiresAt
      lockedSeats
      travelId
    }
  }
`;

export const RESERVE_BOOKINGS = gql`
  mutation reserveBooking($input: ReserveBookingDto!) {
    reserveBooking(input: $input) {
      id
      travelId
      seatsReserved
    }
  }
`;

export const RESET_CART = gql`
mutation resetCart($input: ResetCartDto!) {
   resetCart(input: $input) {
    id
    email
    expiresAt
    lockedSeats
    travelId
  }
}
`;
