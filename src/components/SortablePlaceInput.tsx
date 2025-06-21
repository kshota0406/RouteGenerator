'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PlaceInput from './PlaceInput';
import { DraggablePlace } from '@/lib/store';
import { Place } from '@/lib/mapsUrl';
import { GripVertical } from 'lucide-react';

interface SortablePlaceInputProps {
  item: DraggablePlace;
  onRemove?: () => void;
  onChange: (place: Place | null) => void;
  isFirst: boolean;
  isLast: boolean;
  isDetailsVisible: boolean;
  onToggleDetails: () => void;
}

const SortablePlaceInput: React.FC<SortablePlaceInputProps> = ({
  item,
  onRemove,
  onChange,
  isFirst,
  isLast,
  isDetailsVisible,
  onToggleDetails,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  // 地点タイプに応じたスタイリング
  const getTypeStyles = () => {
    if (isFirst) {
      return {
        container: 'border-l-4 border-green-500 bg-green-50',
        label: 'text-green-700',
        icon: 'text-green-500',
      };
    } else if (isLast) {
      return {
        container: 'border-l-4 border-yellow-500 bg-yellow-50',
        label: 'text-yellow-700',
        icon: 'text-yellow-500',
      };
    } else {
      return {
        container: 'border-l-4 border-blue-500 bg-blue-50',
        label: 'text-blue-700',
        icon: 'text-blue-500',
      };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div ref={setNodeRef} style={style} className="flex items-center space-x- relative">
      {/* ドラッグハンドル */}
      <button {...attributes} {...listeners} className="p-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5" />
      </button>

      <div className={`flex-1 w-full min-w-0 rounded-lg p-3 ${typeStyles.container}`}>
        <PlaceInput
          value={item.place}
          onChange={onChange}
          placeholder={item.placeholder}
          isDetailsVisible={isDetailsVisible}
          onToggleDetails={onToggleDetails}
        />
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors z-10"
          aria-label="Remove waypoint"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SortablePlaceInput;
