import { atom } from 'jotai';
import { Place } from './mapsUrl';

export const MAX_WAYPOINTS = 10;

export interface DraggablePlace {
  id: string; // dnd-kitで識別するためのユニークID
  place: Place | null;
  type: 'origin' | 'waypoint' | 'destination';
  placeholder: string;
  isDetailsVisible: boolean; // 詳細表示の状態
}

const initialPlaces: DraggablePlace[] = [
  {
    id: 'origin-0', // 静的なIDに変更
    place: null,
    type: 'origin',
    placeholder: '出発地を検索',
    isDetailsVisible: false,
  },
  {
    id: 'destination-1', // 静的なIDに変更
    place: null,
    type: 'destination',
    placeholder: '目的地を検索',
    isDetailsVisible: false,
  },
];

// すべての地点を単一の配列で管理
export const placesAtom = atom<DraggablePlace[]>(initialPlaces);

export const generatedUrlAtom = atom<string | null>(null); 