'use client';
import { Place } from '@/lib/mapsUrl';
import ModalBase from './ModalBase';
import { Star } from 'lucide-react';

interface ReviewsModalProps {
  reviews: NonNullable<Place['reviews']>;
  placeName?: string;
  onClose: () => void;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        fill="currentColor"
      />
    ))}
  </div>
);

const ReviewsModal: React.FC<ReviewsModalProps> = ({ reviews, placeName, onClose }) => {
  if (!reviews || reviews.length === 0) return null;

  const modalTitle = placeName ? `${placeName}のレビュー` : 'レビュー';

  return (
    <ModalBase title={modalTitle} onClose={onClose}>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.time} className="border-t pt-4 first:border-t-0 first:pt-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {review.profile_photo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={review.profile_photo_url} alt={review.author_name} className="w-8 h-8 rounded-full mr-3" />
                )}
                <span className="font-semibold text-gray-800">{review.author_name}</span>
              </div>
              {typeof review.rating === 'number' && <StarRating rating={review.rating} />}
            </div>
            <p className="text-black text-sm leading-relaxed whitespace-pre-wrap">{review.text}</p>
            <p className="text-right text-xs text-gray-500 mt-2">{review.relative_time_description}</p>
          </div>
        ))}
      </div>
    </ModalBase>
  );
};

export default ReviewsModal;
