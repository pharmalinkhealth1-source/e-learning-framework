"use client";

import React, { useState } from 'react';
import Map, { NavigationControl, Marker, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid #e5edf5;
`;

const MarkerButton = styled.button<{ $category: string }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const MarkerDot = styled.div<{ $category: string }>`
  width: 16px;
  height: 16px;
  background-color: ${props => {
    switch(props.$category) {
      case 'pharmacy': return '#6c30c0';
      case 'clinic': return '#00a63e';
      case 'distribution-hub': return '#ff8a00';
      case 'training-centre': return '#0070f3';
      case 'laboratory': return '#7928ca';
      default: return '#425466';
    }
  }};
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
`;

const PopupContent = styled.div`
  padding: 12px;
  max-width: 200px;
`;

const PopupTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: #0a2540;
`;

const PopupCategory = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6c30c0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 8px;
`;

const PopupAddress = styled.p`
  font-size: 0.75rem;
  color: #425466;
  line-height: 1.4;
`;

interface Location {
  _id: string;
  name: string;
  category: string;
  address?: string;
  location: {
    lat: number;
    lng: number;
  };
}

export default function LocationMap({ locations }: { locations: Location[] }) {
  const [popupInfo, setPopupInfo] = useState<Location | null>(null);

  return (
    <MapContainer>
      <Map
        initialViewState={{
          longitude: 20,
          latitude: 5,
          zoom: 3
        }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />

        {locations.filter(loc => loc.location?.lat && loc.location?.lng).map((loc) => (
          <Marker
            key={loc._id}
            longitude={loc.location.lng}
            latitude={loc.location.lat}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(loc);
            }}
          >
            <MarkerButton $category={loc.category}>
              <MarkerDot $category={loc.category} />
            </MarkerButton>
          </Marker>
        ))}

        {popupInfo && popupInfo.location?.lat && popupInfo.location?.lng && (
          <Popup
            anchor="top"
            longitude={popupInfo.location.lng}
            latitude={popupInfo.location.lat}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
          >
            <PopupContent>
              <PopupCategory>{popupInfo.category.replace('-', ' ')}</PopupCategory>
              <PopupTitle>{popupInfo.name}</PopupTitle>
              {popupInfo.address && <PopupAddress>{popupInfo.address}</PopupAddress>}
            </PopupContent>
          </Popup>
        )}
      </Map>
    </MapContainer>
  );
}
