import { create } from "zustand";

type LocationStore = {
  location: { latitude: number; longitude: number } | null;
  pickupLocation: { latitude: number; longitude: number } | null;
  dropoffLocation: { latitude: number; longitude: number } | null;
  directionsResponse: google.maps.DirectionsResult | null;
  distance: string;
  duration: string;
  setLocation: (location: { latitude: number; longitude: number } | null) => void;
  setPickupLocation: (location: { latitude: number; longitude: number } | null) => void;
  setDropoffLocation: (location: { latitude: number; longitude: number } | null) => void;
  setDirectionsResponse: (response: google.maps.DirectionsResult | null) => void;
  setDistance: (distance: string) => void;
  setDuration: (duration: string) => void;
};

export const useLocationStore = create<LocationStore>(set => ({
  location: null,
  pickupLocation: null,
  dropoffLocation: null,
  directionsResponse: null,
  distance: '',
  duration: '',
  setLocation: location => set({ location }),
  setPickupLocation: location => set({ pickupLocation: location }),
  setDropoffLocation: location => set({ dropoffLocation: location }),
  setDirectionsResponse: response => set({ directionsResponse: response }),
  setDistance: distance => set({ distance }),
  setDuration: duration => set({ duration })
}));
