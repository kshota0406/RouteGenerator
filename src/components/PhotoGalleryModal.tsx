'use client';
import { useState } from 'react';
import { Place } from '@/lib/mapsUrl';
import ModalBase from './ModalBase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoGalleryModalProps {
  photos: Place['photos'];
  onClose: () => void;
  placeName?: string;
}

const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({ photos, onClose, placeName }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  if (!photos || photos.length === 0) return null;

  // 最大10枚まで表示
  const displayPhotos = photos.slice(0, 10);
  const totalPhotos = Math.min(photos.length, 10);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % totalPhotos);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };

  const goToPhoto = (index: number) => {
    setCurrentPhotoIndex(index);
  };

  const modalTitle = `${placeName ? `${placeName}の写真` : '写真'} (${currentPhotoIndex + 1}/${totalPhotos})`;

  return (
    <ModalBase title={modalTitle} onClose={onClose}>
      {/* メイン写真表示 */}
      <div className="relative mb-4">
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayPhotos[currentPhotoIndex].getUrl({ maxWidth: 800, maxHeight: 600 })}
            alt={`${placeName || '場所'}の写真 ${currentPhotoIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        {/* ナビゲーションボタン */}
        {totalPhotos > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* サムネイル一覧 */}
      {totalPhotos > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {displayPhotos.map((photo, index) => (
            <button
              key={index}
              onClick={() => goToPhoto(index)}
              className={`aspect-square overflow-hidden rounded-md shadow-md transition-all ${
                index === currentPhotoIndex 
                  ? 'ring-2 ring-blue-500 scale-105' 
                  : 'hover:scale-105'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.getUrl({ maxWidth: 150, maxHeight: 150 })}
                alt={`サムネイル ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* 写真数が10枚を超える場合の注意書き */}
      {photos.length > 10 && (
        <div className="mt-4 text-sm text-black text-center">
          表示可能な写真は最大10枚です（全{photos.length}枚中）
        </div>
      )}
    </ModalBase>
  );
};

export default PhotoGalleryModal;
