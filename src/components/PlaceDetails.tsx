'use client';

import { Place } from '@/lib/mapsUrl';
import { useState, useCallback } from 'react';
import { Star, Clock, Globe, ChevronDown, ChevronUp, MapPin } from 'lucide-react';

interface PlaceDetailsProps {
  place: Place;
  onShowPhotos: () => void;
  onShowReviews: () => void;
}

const WeeklyHours: React.FC<{ openingHours: google.maps.places.PlaceOpeningHours }> = ({ openingHours }) => {
  const [isOpen, setIsOpen] = useState(false);
  const googleTodayIndex = (new Date().getDay() === 0) ? 6 : new Date().getDay() - 1;

  return (
    <div className="mt-4 text-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isOpen ? '営業時間を閉じる' : '週間営業時間を表示'}
        {isOpen ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
      </button>
      {isOpen && (
        <ul className="mt-2 pl-4 text-gray-600">
          {openingHours.weekday_text?.map((day, index) => (
            <li key={index} className={index === googleTodayIndex ? 'font-bold' : ''}>
              {day}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const StarRating: React.FC<{ rating: number; totalReviews?: number; onClick: () => void }> = ({ rating, totalReviews, onClick }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <button type="button" onClick={onClick} className="flex flex-col items-start cursor-pointer hover:opacity-80">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <Star className="w-4 h-4 text-yellow-400 fill-current absolute inset-0" style={{ clipPath: 'inset(0 50% 0 0)' }} />
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="font-semibold ml-1">{rating.toFixed(1)}</span>
      </div>
      {totalReviews && (
        <span className="text-gray-500 text-sm mt-1">({totalReviews}件のレビュー)</span>
      )}
    </button>
  );
};

const PlaceDetails: React.FC<PlaceDetailsProps> = ({ place, onShowPhotos, onShowReviews }) => {
  const isCurrentlyOpen = useCallback(() => {
    if (!place.openingHours) return null;
    if (place.businessStatus === 'CLOSED_PERMANENTLY') return { text: '閉業', color: 'text-red-600' };
    if (place.businessStatus === 'CLOSED_TEMPORARILY') return { text: '一時的に休業', color: 'text-yellow-600' };

    try {
      const isOpen = place.openingHours.isOpen?.();
      if (typeof isOpen === 'boolean') {
        return isOpen ? { text: '営業中', color: 'text-green-600' } : { text: '営業時間外', color: 'text-red-600' };
      }
    } catch (e) {
      console.warn("openingHours.isOpen() failed, falling back.", e)
    }
    
    return { text: '時間情報なし', color: 'text-gray-500' };
  }, [place.openingHours, place.businessStatus]);

  const openStatus = isCurrentlyOpen();
  const photoCount = place.photos?.length || 0;
  const remainingPhotos = photoCount > 1 ? photoCount - 1 : 0;

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
      <div className="flex items-start space-x-4">
        {place.photos && place.photos[0] && (
          <div className="flex-shrink-0 w-24 relative">
            <button type="button" onClick={onShowPhotos} className="w-full aspect-square rounded-lg overflow-hidden block group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 })}
                alt={`Photo of ${place.name}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              {remainingPhotos > 0 && (
                <div className="absolute top-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                  +{remainingPhotos}
                </div>
              )}
            </button>
          </div>
        )}
        <div className="flex-grow flex flex-col justify-between">
          {/* 上部: 評価と営業状態 */}
          <div className="flex items-start flex-wrap gap-x-4 gap-y-2">
            {place.rating && (
              <StarRating
                rating={place.rating}
                totalReviews={place.userRatingsTotal}
                onClick={onShowReviews}
              />
            )}
            {openStatus && (
              <div className="flex items-center pt-1">
                <Clock className={`w-4 h-4 mr-1 ${openStatus.color}`} />
                <span className={`${openStatus.color} font-semibold`}>{openStatus.text}</span>
              </div>
            )}
          </div>
          
          {/* 下部: アイコン */}
          <div className="flex items-center space-x-2 self-end mt-2">
            {place.website && (
              <a href={place.website} target="_blank" rel="noopener noreferrer" title="ウェブサイト" className="text-gray-500 hover:text-blue-600">
                <Globe className="w-5 h-5" />
              </a>
            )}
            {place.placeId && (
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.placeId}`} target="_blank" rel="noopener noreferrer" title="Googleマップで見る" className="text-gray-500 hover:text-blue-600">
                <MapPin className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {place.openingHours && (
        <WeeklyHours openingHours={place.openingHours as google.maps.places.PlaceOpeningHours} />
      )}

      {place.html_attributions && place.html_attributions.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          {place.html_attributions.map((attr, i) => (
            <span key={i} dangerouslySetInnerHTML={{ __html: attr }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceDetails; 