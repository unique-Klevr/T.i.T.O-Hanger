
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF, CircleF } from '@react-google-maps/api';
import { Drop, Campaign, DropStatus } from '../types';
import { STATUS_COLORS, STATUS_LABELS, STATUS_HEX } from '../constants';
import { supabase } from '../services/supabaseClient';

interface CrewDashboardProps {
  drops: Drop[];
  activeCampaign?: Campaign;
  onAddDrop: (drop: Omit<Drop, 'id' | 'timestamp' | 'userId' | 'campaignId'>) => void;
  userId?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 34.0522,
  lng: -118.2437
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

const CrewDashboard: React.FC<CrewDashboardProps> = ({ drops, activeCampaign, onAddDrop, userId }) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showDropModal, setShowDropModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("Detecting location...");
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          setIsLocating(false);
          setGpsError(null);
          // Simple mock reverse geocoding for UI feel
          setSelectedAddress(`${Math.abs(pos.coords.latitude).toFixed(4)}°N, ${Math.abs(pos.coords.longitude).toFixed(4)}°W`);
        },
        (err) => {
          console.error(err);
          setGpsError("GPS access denied. Please enable location services.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setGpsError("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  }, []);

  const saveDrop = async ({
    latitude,
    longitude,
    status,
    campaignId,
    userId
  }: {
    latitude: number;
    longitude: number;
    status: DropStatus;
    campaignId?: string;
    userId?: string;
  }) => {
    // Save locally
    onAddDrop({
      lat: latitude,
      lng: longitude,
      status,
      address: selectedAddress,
      imageUrl: photoBase64
    });

    // Placeholder for Supabase insert
    console.log('Supabase placeholder: Inserting drop...', { latitude, longitude, status, campaignId, userId });
    /*
    try {
      const { data, error } = await supabase
        .from('drops')
        .insert([{ 
          lat: latitude, 
          lng: longitude, 
          status, 
          campaign_id: campaignId, 
          user_id: userId, 
          timestamp: new Date().toISOString() 
        }]);
      if (error) throw error;
    } catch (err) {
      console.error('Error saving to Supabase:', err);
    }
    */
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError(null);

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPhotoError("The image is too large (max 10MB).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setPhotoBase64(reader.result as string);
        setPhotoError(null);
      }
    };
    reader.onerror = () => {
      setPhotoError("Failed to read the image.");
    };
    reader.readAsDataURL(file);
  };

  const handleMarkDrop = (status: DropStatus) => {
    const targetCoords = pendingCoords || coords;
    if (targetCoords) {
      saveDrop({
        latitude: targetCoords.lat,
        longitude: targetCoords.lng,
        status,
        campaignId: activeCampaign?.id,
        userId: userId
      });
      setShowDropModal(false);
      setPendingCoords(null);
      setPhotoBase64(undefined);
      setPhotoError(null);
    }
  };

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setPendingCoords({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
      setShowDropModal(true);
    }
  }, []);

  const closeAndReset = () => {
    setShowDropModal(false);
    setPendingCoords(null);
    setPhotoBase64(undefined);
    setPhotoError(null);
  };

  const triggerPhotoInput = () => {
    setPhotoError(null);
    fileInputRef.current?.click();
  };

  if (loadError) return <div className="h-full flex items-center justify-center bg-rose-50 text-rose-600 font-bold p-10 text-center">Error loading Google Maps. Check your API key.</div>;

  return (
    <div className="h-full relative overflow-hidden bg-slate-200">
      {/* Map Implementation */}
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={coords || defaultCenter}
          zoom={18}
          options={mapOptions}
          onClick={onMapClick}
        >
          {/* Current User Marker */}
          {coords && (
            <>
              <MarkerF
                position={coords}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#3b82f6",
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "#ffffff",
                }}
              />
              <CircleF
                center={coords}
                radius={20}
                options={{
                  fillColor: "#3b82f6",
                  fillOpacity: 0.15,
                  strokeWeight: 0,
                }}
              />
            </>
          )}

          {/* Pending Marker */}
          {pendingCoords && (
            <MarkerF
              position={pendingCoords}
              animation={google.maps.Animation.BOUNCE}
            />
          )}

          {/* Existing Drops */}
          {drops.map((drop) => (
            <MarkerF
              key={drop.id}
              position={{ lat: drop.lat, lng: drop.lng }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: (STATUS_HEX as any)[drop.status] || "#94a3b8",
                fillOpacity: 1,
                strokeWeight: 1.5,
                strokeColor: "#ffffff",
              }}
            />
          ))}
        </GoogleMap>
      ) : (
        <div className="h-full flex items-center justify-center bg-slate-100">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Initializing Maps...</p>
          </div>
        </div>
      )}

      {/* GPS Loading Overlay */}
      {isLocating && (
        <div className="absolute inset-0 z-[60] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Acquiring GPS...</h2>
          <p className="text-slate-500 font-bold max-w-xs text-sm">Please allow location access for high-accuracy tracking.</p>
        </div>
      )}

      {/* GPS Error Overlay */}
      {gpsError && (
        <div className="absolute inset-0 z-[60] bg-rose-50 flex flex-col items-center justify-center p-10 text-center">
          <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">GPS Failure</h2>
          <p className="text-rose-600 font-bold mb-8">{gpsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Header Info */}
      <div className="absolute top-4 left-4 right-4 z-30">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 border border-slate-200/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider leading-none mb-1">Active Area</p>
                <h2 className="text-base font-black text-slate-800 leading-none truncate max-w-[150px]">{activeCampaign?.name || 'Loading...'}</h2>
              </div>
            </div>
            <div className="text-right border-l border-slate-100 pl-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Your Drops</p>
              <p className="text-lg font-black text-emerald-600 leading-none">{drops.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Button */}
      <div className="absolute bottom-10 left-0 right-0 z-30 px-6">
        <button
          onClick={() => {
            setPendingCoords(null);
            setShowDropModal(true);
          }}
          className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-transform group border-4 border-white/10"
        >
          <div className="bg-emerald-500 p-2 rounded-xl group-active:scale-110 transition-transform">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-xl font-black uppercase tracking-tight">Mark This House</span>
        </button>
        <p className="text-center text-slate-500 font-bold text-[10px] mt-4 uppercase tracking-[0.2em] bg-white/50 backdrop-blur-sm py-1 rounded-full">
          Or tap directly on the map
        </p>
      </div>

      {showDropModal && (
        <div className="absolute inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="w-full bg-white rounded-t-[3rem] shadow-2xl p-8 animate-slide-up max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-8"></div>

            <div className="flex flex-col mb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Record Drop</h3>
                <div className="bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">GPS Locked</span>
                </div>
              </div>
              <p className="text-slate-400 font-bold text-sm mb-8 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                {pendingCoords ? `${pendingCoords.lat.toFixed(6)}, ${pendingCoords.lng.toFixed(6)}` : selectedAddress}
              </p>

              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
              />

              {photoBase64 ? (
                <div className="relative w-full aspect-video bg-slate-100 rounded-[2rem] overflow-hidden mb-8 border-4 border-emerald-500 shadow-xl">
                  <img
                    src={photoBase64}
                    alt="Proof"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setPhotoBase64(undefined)}
                    className="absolute top-4 right-4 bg-rose-500 text-white p-3 rounded-2xl shadow-lg active:scale-90 transition-transform"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={triggerPhotoInput}
                  className="w-full mb-8 flex items-center justify-center gap-4 bg-slate-50 border-4 border-dashed border-slate-200 py-12 rounded-[2.5rem] active:bg-slate-100 transition-all hover:border-emerald-300 group"
                >
                  <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 group-active:scale-90 transition-transform">
                    <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-black text-slate-800 text-lg uppercase tracking-tight leading-none">Photo Proof</p>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Optional but recommended</p>
                  </div>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleMarkDrop(key as DropStatus)}
                  className={`${STATUS_COLORS[key]} text-white h-32 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 shadow-xl active:scale-95 active:brightness-90 transition-all border-4 border-white/20`}
                >
                  <StatusIcon status={key as DropStatus} />
                  <span className="font-black text-xs uppercase tracking-widest text-center px-4 leading-tight">{label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={closeAndReset}
              className="w-full py-6 text-slate-400 font-black uppercase text-sm tracking-[0.2em] border-2 border-slate-100 rounded-3xl active:bg-slate-50 transition-colors mb-6"
            >
              Discard Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusIcon: React.FC<{ status: DropStatus }> = ({ status }) => {
  switch (status) {
    case 'dropped': return <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
    case 'skipped': return <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>;
    case 'no-soliciting': return <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" /></svg>;
    case 'existing-client': return <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
    default: return null;
  }
};

export default CrewDashboard;
