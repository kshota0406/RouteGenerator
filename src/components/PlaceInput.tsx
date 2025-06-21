'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Place } from '@/lib/mapsUrl';
import PhotoGalleryModal from './PhotoGalleryModal';
import ReviewsModal from './ReviewsModal';
import PlaceDetails from './PlaceDetails';
import AutoCompleteInput from './AutoCompleteInput';

interface PlaceInputProps {
  value: Place | null;
  onChange: (place: Place | null) => void;
  placeholder: string;
  isDetailsVisible: boolean;
  onToggleDetails: () => void;
}

const PlaceInput: React.FC<PlaceInputProps> = ({
  value,
  onChange,
  placeholder,
  isDetailsVisible,
  onToggleDetails,
}) => {
  const attributionsRef = useRef<HTMLDivElement>(null);
  const placeCacheRef = useRef<Map<string, Place>>(new Map());
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  useEffect(() => {
    new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places']
    }).load().then(() => {
      if (attributionsRef.current) {
        setPlacesService(new google.maps.places.PlacesService(attributionsRef.current));
      }
    });
  }, []);

  const handleSelectSuggestion = useCallback((prediction: google.maps.places.AutocompletePrediction) => {
    const placeId = prediction.place_id;
    if (!placeId || !placesService) return;

    if (placeCacheRef.current.has(placeId)) {
      onChange(placeCacheRef.current.get(placeId)!);
      return;
    }

    setIsFetchingDetails(true);
    const fields = ['name', 'formatted_address', 'geometry', 'website', 'rating', 'opening_hours', 'business_status', 'user_ratings_total', 'reviews', 'photos', 'place_id', 'utc_offset_minutes'];
    
    placesService.getDetails({ placeId, fields }, (placeDetails, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
        const newPlace: Place = {
          placeId: placeDetails.place_id ?? placeId,
          name: placeDetails.name ?? '',
          lat: placeDetails.geometry?.location?.lat() ?? 0,
          lng: placeDetails.geometry?.location?.lng() ?? 0,
          formattedAddress: placeDetails.formatted_address,
          geometry: placeDetails.geometry,
          website: placeDetails.website,
          rating: placeDetails.rating,
          openingHours: placeDetails.opening_hours,
          businessStatus: placeDetails.business_status as Place['businessStatus'],
          userRatingsTotal: placeDetails.user_ratings_total,
          photos: placeDetails.photos,
          reviews: placeDetails.reviews,
          html_attributions: placeDetails.html_attributions,
          utcOffsetMinutes: placeDetails.utc_offset_minutes,
        };
        placeCacheRef.current.set(placeId, newPlace);
        onChange(newPlace);
      }
      setIsFetchingDetails(false);
    });
  }, [placesService, onChange]);

  const handleClear = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <div className="w-full">
      <AutoCompleteInput
        onSelect={handleSelectSuggestion}
        onClear={handleClear}
        initialValue={value?.name || ''}
        placeholder={placeholder}
      />

      {isFetchingDetails && <div className="mt-2 text-sm text-gray-500">詳細を読み込んでいます...</div>}
      
      {value && (
        <div className="mt-2">
          <button
            type="button"
            onClick={onToggleDetails}
            className="flex items-center justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isDetailsVisible ? '詳細を閉じる' : '詳細を見る'}
          </button>
          {isDetailsVisible && (
            <div>
              <PlaceDetails
                place={value}
                onShowPhotos={() => setIsPhotoModalOpen(true)}
                onShowReviews={() => setIsReviewsModalOpen(true)}
              />
            </div>
          )}
        </div>
      )}

      {isPhotoModalOpen && value?.photos && (
        <PhotoGalleryModal
          photos={value.photos}
          onClose={() => setIsPhotoModalOpen(false)}
          placeName={value.name}
        />
      )}
      {isReviewsModalOpen && value?.reviews && (
        <ReviewsModal
          reviews={value.reviews}
          onClose={() => setIsReviewsModalOpen(false)}
          placeName={value.name}
        />
      )}

      {/* For Google Attributions */}
      <div ref={attributionsRef}></div>
    </div>
  );
};

export default PlaceInput; 