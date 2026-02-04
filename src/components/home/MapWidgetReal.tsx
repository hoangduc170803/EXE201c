import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
// Leaflet CSS is loaded from CDN in index.css
import type { Listing } from '@/types';

interface MapWidgetProps {
  listings?: Listing[];
  onMarkerClick?: (listingId: string) => void;
  activeListingId?: string | null;
}

// Custom price marker icon
const createPriceIcon = (price: number, isActive: boolean) => {
  const bgColor = isActive ? '#0d141b' : '#ffffff';
  const textColor = isActive ? '#ffffff' : '#0d141b';
  const scale = isActive ? 'scale(1.1)' : 'scale(1)';

  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        color: ${textColor};
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 13px;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 2px solid ${isActive ? '#0d141b' : '#ffffff'};
        transform: ${scale};
        transition: all 0.2s ease;
        cursor: pointer;
      ">
        đ${price.toLocaleString('vi-VN')}
      </div>
    `,
    iconSize: [100, 30],
    iconAnchor: [50, 15],
  });
};

// Vietnam cities coordinates mapping
const VIETNAM_CITIES: Record<string, [number, number]> = {
  'ha noi': [21.0285, 105.8542],
  'hanoi': [21.0285, 105.8542],
  'hà nội': [21.0285, 105.8542],
  'ho chi minh': [10.8231, 106.6297],
  'hcm': [10.8231, 106.6297],
  'saigon': [10.8231, 106.6297],
  'hồ chí minh': [10.8231, 106.6297],
  'da nang': [16.0544, 108.2022],
  'danang': [16.0544, 108.2022],
  'đà nẵng': [16.0544, 108.2022],
  'da lat': [11.9404, 108.4583],
  'dalat': [11.9404, 108.4583],
  'đà lạt': [11.9404, 108.4583],
  'nha trang': [12.2388, 109.1967],
  'phu quoc': [10.2899, 103.9840],
  'phú quốc': [10.2899, 103.9840],
  'hoi an': [15.8801, 108.3380],
  'hội an': [15.8801, 108.3380],
  'sapa': [22.3364, 103.8438],
  'sa pa': [22.3364, 103.8438],
  'ha long': [20.9101, 107.1839],
  'halong': [20.9101, 107.1839],
  'hạ long': [20.9101, 107.1839],
  'vung tau': [10.4114, 107.1362],
  'vũng tàu': [10.4114, 107.1362],
  'mui ne': [10.9333, 108.2833],
  'mũi né': [10.9333, 108.2833],
  'can tho': [10.0452, 105.7469],
  'cần thơ': [10.0452, 105.7469],
  'hue': [16.4637, 107.5909],
  'huế': [16.4637, 107.5909],
  'quy nhon': [13.7829, 109.2196],
  'quy nhơn': [13.7829, 109.2196],
  'ninh binh': [20.2506, 105.9744],
  'ninh bình': [20.2506, 105.9744],
  'hai phong': [20.8449, 106.6881],
  'hải phòng': [20.8449, 106.6881],
  'vietnam': [16.0, 108.0],
};

// Generate coordinates based on listing location
const getCoordinates = (id: string, location?: string): [number, number] => {
  if (location) {
    const locationLower = location.toLowerCase();
    for (const [city, coords] of Object.entries(VIETNAM_CITIES)) {
      if (locationLower.includes(city)) {
        // Add small random offset within the city
        const hash = id.split('').reduce((a, b) => ((a << 5) - a) + (b.codePointAt(0) || 0), 0);
        const latOffset = (Math.abs(hash % 100) - 50) * 0.003;
        const lngOffset = (Math.abs((hash * 7) % 100) - 50) * 0.003;
        return [coords[0] + latOffset, coords[1] + lngOffset];
      }
    }
  }

  // Default: random location centered on Ha Noi
  const hash = id.split('').reduce((a, b) => ((a << 5) - a) + (b.codePointAt(0) || 0), 0);
  const baseLat = 21.0285;
  const baseLng = 105.8542;
  const latOffset = (Math.abs(hash % 100) - 50) * 0.015;
  const lngOffset = (Math.abs((hash * 7) % 100) - 50) * 0.015;

  return [baseLat + latOffset, baseLng + lngOffset];
};

// Component to handle map view updates
const MapController: React.FC<{
  center: [number, number];
  zoom: number;
  onMapReady: (map: L.Map) => void;
}> = ({ center, zoom, onMapReady }) => {
  const map = useMap();

  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

const MapWidget: React.FC<MapWidgetProps> = ({
  listings = [],
  onMarkerClick,
  activeListingId
}) => {
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  // Default center: Central Vietnam (Da Nang area) for better overview
  const [mapCenter, setMapCenter] = useState<[number, number]>([16.0544, 108.2022]);
  const [mapZoom, setMapZoom] = useState(6); // Start with overview of Vietnam
  const mapRef = useRef<L.Map | null>(null);

  // Update map center based on listings
  useEffect(() => {
    if (listings.length > 0) {
      const coords = listings.map(l => getCoordinates(l.id, l.location));
      const avgLat = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
      const avgLng = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
      setMapCenter([avgLat, avgLng]);

      // Adjust zoom based on coordinate spread
      const latSpread = Math.max(...coords.map(c => c[0])) - Math.min(...coords.map(c => c[0]));
      const lngSpread = Math.max(...coords.map(c => c[1])) - Math.min(...coords.map(c => c[1]));
      const maxSpread = Math.max(latSpread, lngSpread);

      if (maxSpread > 2) setMapZoom(8);
      else if (maxSpread > 1) setMapZoom(9);
      else if (maxSpread > 0.5) setMapZoom(10);
      else if (maxSpread > 0.2) setMapZoom(11);
      else setMapZoom(13);
    }
  }, [listings]);

  const displayListings = listings.length > 0 ? listings.slice(0, 50) : [];

  const handleSearchArea = () => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      console.log('Search area bounds:', {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      });
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  return (
    <div className="h-full w-full overflow-hidden">
      {/* Search this area button */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
        <button
          onClick={handleSearchArea}
          className="bg-white dark:bg-gray-800 text-[#0d141b] dark:text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm flex items-center gap-2 hover:scale-105 transition-transform border border-gray-200 dark:border-gray-700"
        >
          <span className="material-symbols-outlined !text-[18px]">search</span>
          Tìm khu vực này
        </button>
      </div>

      {/* Location indicator */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md flex items-center gap-2">
        <span className="material-symbols-outlined !text-[18px] text-red-500">location_on</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {displayListings.length > 0 ? `${displayListings.length} chỗ ở` : 'Việt Nam'}
        </span>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-4 flex flex-col gap-2 z-[1000]">
        <button
          onClick={() => mapRef.current?.setZoom(mapRef.current.getZoom() + 2)}
          className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-[#0d141b] dark:text-white transition-colors border border-gray-200 dark:border-gray-700"
          title="Phóng to"
        >
          <span className="material-symbols-outlined !text-[20px]">open_in_full</span>
        </button>
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-[#0d141b] dark:text-white transition-colors border-b border-gray-200 dark:border-gray-700"
          >
            <span className="material-symbols-outlined !text-[20px]">add</span>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-[#0d141b] dark:text-white transition-colors"
          >
            <span className="material-symbols-outlined !text-[20px]">remove</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={true}
        minZoom={5}
        maxZoom={18}
        // Limit map bounds to Vietnam and surrounding area
        maxBounds={[
          [8.0, 102.0],   // Southwest corner (South Vietnam, Cambodia border)
          [24.0, 112.0]   // Northeast corner (North Vietnam, China border)
        ]}
        maxBoundsViscosity={0.8}
      >
        <MapController
          center={mapCenter}
          zoom={mapZoom}
          onMapReady={(map) => { mapRef.current = map; }}
        />

        {/* Map Tiles - Using CartoDB for better international coverage */}
        {/* Option 1: CartoDB Voyager (colorful, detailed) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Price Markers for listings */}
        {displayListings.map((listing) => {
          const coords = getCoordinates(listing.id, listing.location);
          const isActive = activeListingId === listing.id || hoveredMarkerId === listing.id;

          return (
            <Marker
              key={listing.id}
              position={coords}
              icon={createPriceIcon(listing.price, isActive)}
              eventHandlers={{
                click: () => onMarkerClick?.(listing.id),
                mouseover: () => setHoveredMarkerId(listing.id),
                mouseout: () => setHoveredMarkerId(null),
              }}
            >
              <Popup>
                <div className="w-[220px]">
                  <img
                    src={listing.image}
                    alt={listing.location}
                    className="w-full h-28 object-cover rounded-lg mb-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/220x112?text=No+Image';
                    }}
                  />
                  <div className="font-semibold text-sm text-gray-900">{listing.location}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{listing.details}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-sm">đ{listing.price.toLocaleString('vi-VN')}/đêm</span>
                    {listing.rating > 0 && (
                      <span className="flex items-center gap-1 text-xs">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{listing.rating}</span>
                      </span>
                    )}
                  </div>
                  {listing.isGuestFavorite && (
                    <div className="mt-2 text-xs text-pink-600 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined !text-[14px]">favorite</span>
                      Được khách yêu thích
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Default markers when no listings */}
        {displayListings.length === 0 && (
          <>
            <Marker position={[21.0285, 105.8542]} icon={createPriceIcon(2500000, false)}>
              <Popup>
                <div className="text-center p-2">
                  <div className="font-semibold">Hà Nội</div>
                  <div className="text-sm text-gray-500">đ2.500.000/đêm</div>
                </div>
              </Popup>
            </Marker>
            <Marker position={[10.8231, 106.6297]} icon={createPriceIcon(1800000, false)}>
              <Popup>
                <div className="text-center p-2">
                  <div className="font-semibold">Hồ Chí Minh</div>
                  <div className="text-sm text-gray-500">đ1.800.000/đêm</div>
                </div>
              </Popup>
            </Marker>
            <Marker position={[16.0544, 108.2022]} icon={createPriceIcon(2200000, false)}>
              <Popup>
                <div className="text-center p-2">
                  <div className="font-semibold">Đà Nẵng</div>
                  <div className="text-sm text-gray-500">đ2.200.000/đêm</div>
                </div>
              </Popup>
            </Marker>
            <Marker position={[11.9404, 108.4583]} icon={createPriceIcon(1500000, true)}>
              <Popup>
                <div className="text-center p-2">
                  <div className="font-semibold">Đà Lạt</div>
                  <div className="text-sm text-gray-500">đ1.500.000/đêm</div>
                </div>
              </Popup>
            </Marker>
            <Marker position={[12.2388, 109.1967]} icon={createPriceIcon(2800000, false)}>
              <Popup>
                <div className="text-center p-2">
                  <div className="font-semibold">Nha Trang</div>
                  <div className="text-sm text-gray-500">đ2.800.000/đêm</div>
                </div>
              </Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      {/* Custom styles */}
      <style>{`
        .custom-price-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          padding: 0;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0;
          padding: 12px;
        }
        .leaflet-popup-close-button {
          top: 8px !important;
          right: 8px !important;
          color: #666 !important;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
};

export default MapWidget;

