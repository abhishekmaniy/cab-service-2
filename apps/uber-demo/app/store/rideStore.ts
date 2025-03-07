import { create } from 'zustand'
// import { Ride } from '@prisma/client'

interface Ride {
  riderId: string
  pickup: string
  destination: string
}

type RideStore = {
  availableRide: Ride[]
  setAvailabelRide: (ride: Ride) => void
}

export const useRideStore = create<RideStore>(set => ({
  availableRide: [],
  setAvailabelRide: ride =>
    set(state => ({
      availableRide: [...state.availableRide, ride]
    }))
}))
