'use client'

import { useLocationStore } from '@/app/store/mapStore'
import { Button } from '@/components/ui/button'
import useWebSocket from '@/hooks/useSocket'
import { useAuth } from '@clerk/nextjs'
import { Autocomplete } from '@react-google-maps/api'
import { useRef, useState } from 'react'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { Input } from './ui/input'

export default function RideRequest () {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const { userId } = useAuth()
  const socket = useWebSocket()
  const originRef = useRef<HTMLInputElement>(null)
  const destinationRef = useRef<HTMLInputElement>(null)

  const {
    setPickupLocation,
    setDropoffLocation,
    directionsResponse,
    setDirectionsResponse,
    distance,
    setDistance,
    duration,
    setDuration
  } = useLocationStore()

  const calculateRoute = async () => {
    if (!originRef.current?.value || !destinationRef.current?.value) {
      return
    }

    const directionService = new google.maps.DirectionsService()
    const results = await directionService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance?.text || '')
    setDuration(results.routes[0].legs[0].duration?.text || '')
  }

  function clearRoute () {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    if (originRef.current) originRef.current.value = ''
    if (destinationRef.current) destinationRef.current.value = ''
  }

  const handleRequest = async () => {
    if (!pickup || !destination) {
      alert('Please enter both pickup & dropoff locations')
      return
    }

    console.log(pickup, destination)

    try {
      // Convert Pickup Address to Lat/Lng
      const pickupResults = await geocodeByAddress(pickup)
      const pickupLocation = await getLatLng(pickupResults[0])

      // Convert Destination Address to Lat/Lng
      const destinationResults = await geocodeByAddress(destination)
      const destinationLocation = await getLatLng(destinationResults[0])

      if (!pickupLocation || !destinationLocation) {
        return alert('Invalid pickup & destination location')
      }

      setPickupLocation({
        latitude: pickupLocation.lat,
        longitude: pickupLocation.lng
      })
      setDropoffLocation({
        latitude: destinationLocation.lat,
        longitude: destinationLocation.lng
      })

      const response = await fetch('/api/create-ride', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupLat: pickupLocation.lat,
          pickupLng: pickupLocation.lng,
          destinationLat: destinationLocation.lat,
          destinationLng: destinationLocation.lng,
          riderId: userId
        })
      })

      if (!response.ok) throw new Error('Error while creating ride')

      if (socket) {
        socket.emit('event:request_ride', {
          riderId: userId,
          pickup,
          destination
        })
        alert('Ride Created')
      } else {
        alert('Socket connection not established')
      }
    } catch (error) {
      console.error('Error Creating Ride:', error)
      alert('Something went wrong!')
    }
  }

  return (
    <div className='bg-gray-900 p-6 rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold mb-6 text-white'>Request a Ride</h2>
      <div className='space-y-6'>
        {/* Pickup Location */}
        <div className='relative'>
          <Autocomplete>
            <Input
              value={pickup}
              onChange={e => setPickup(e.target.value)}
              placeholder='Enter Pickup'
            />
          </Autocomplete>
        </div>

        {/* Dropoff Location */}
        <div className='relative'>
          <Autocomplete>
            <Input
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder='Enter Destination'
            />
          </Autocomplete>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleRequest}
          className='w-full bg-gray-800 hover:bg-gray-700'
        >
          Request Ride
        </Button>
      </div>
    </div>
  )
}
