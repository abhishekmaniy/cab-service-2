'use client'

import { useRideStore } from '@/app/store/rideStore'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import useWebSocket from '@/hooks/useSocket'
import { useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function DriverDashboard () {
  const [isAvailable, setIsAvailable] = useState(false)
  const { availableRide, setAvailabelRide } = useRideStore()
  const socket = useWebSocket()
  const { userId } = useAuth()

  useEffect(() => {
    // Listen for new ride requests
    console.log(socket)
    if (socket) {
      socket.on('event:new_ride', ride => {
        console.log('New Ride Request Received:', ride)
        setAvailabelRide(ride)
      })

      return () => {
        socket.off('event:new_ride')
      }
    }
  }, [socket])

  const toggleAvailability = async () => {
    setIsAvailable(!isAvailable)

    if (!isAvailable && socket) {
      socket.emit('event:available_driver', {
        driverId: `${userId}`,
        location: 'Hello'
      })
    }
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-200'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>
        Driver Dashboard
      </h2>

      <div className='flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg'>
        <span className='text-lg font-semibold text-gray-700'>
          Available for rides:
        </span>
        <Switch
          checked={isAvailable}
          onCheckedChange={toggleAvailability}
          className='data-[state=checked]:bg-green-500'
        />
      </div>

      {(availableRide && isAvailable ) && (
        <div className='space-y-4 p-4 bg-blue-50 rounded-lg'>
          <h3 className='text-xl font-semibold text-blue-800'>
            New Ride Request
          </h3>
          {availableRide.map(rides => (
            <>
              <p className='text-gray-700'>
                <strong>Pickup:</strong> {rides.pickup}
              </p>
              <p className='text-gray-700'>
                <strong>Dropoff:</strong> {rides.destination}
              </p>
              <div className='flex space-x-4'>
                <Button className='w-full bg-blue-500 hover:bg-blue-600'>
                  Accept Ride
                </Button>
              </div>
            </>
          ))}
        </div>
      )}
    </div>
  )
}
