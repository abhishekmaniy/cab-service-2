'use client'

import DriverDashboard from '@/components/DriverDashboard'
import Map from '@/components/Map'
import RideStatus from '@/components/RideStatus'
import { useJsApiLoader } from '@react-google-maps/api'

export default function DriverPage () {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEMAP_API!,
    libraries: ['places']
  })

  return (
    <>
      {isLoaded ? (
        <div className='space-y-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Driver Dashboard</h1>
          <Map />
          <div className='grid md:grid-cols-2 gap-8'>
            <DriverDashboard />
            <RideStatus role='driver' />
          </div>
        </div>
      ) : (
        <span>Loading Map...</span>
      )}
    </>
  )
}
