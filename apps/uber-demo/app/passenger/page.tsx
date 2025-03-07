'use client'

import React from 'react';
import Map from '@/components/Map';
import RideRequest from '@/components/RiderRequest';
import RideStatus from '@/components/RideStatus';
import { useJsApiLoader } from '@react-google-maps/api';

export default function RiderPage() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLEMAP_API!,
    libraries: ['places']
  });

  return (
    <>
      {isLoaded ? (
        <div className='space-y-8'>
          <h1 className='text-3xl font-bold text-white'>Rider Dashboard</h1>
          <Map />
          <div className='grid md:grid-cols-2 gap-8'>
            <RideRequest />
            <RideStatus role='rider' />
          </div>
        </div>
      ) : (
        <div>Loading Map...</div>
      )}
    </>
  );
}
