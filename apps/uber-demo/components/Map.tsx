'use client'

import React, { useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { LocateIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useLocationStore } from '@/app/store/mapStore';

const center = { lat: 48.8584, lng: 2.2945 };

export default function Map() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { directionsResponse } = useLocationStore();

  return (
    <div className='bg-black h-64 md:h-96 rounded-lg overflow-hidden shadow-inner relative'>
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='bg-white rounded-lg shadow-lg w-full h-full'>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={15}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false
            }}
            onLoad={map => setMap(map)}
          >
            <Marker position={center} />
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </div>
        <Button onClick={() => map?.panTo(center)}>
          <LocateIcon />
        </Button>
      </div>
    </div>
  );
}
