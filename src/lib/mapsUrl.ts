import { DraggablePlace } from "./store";

export interface Place {
  name: string;
  placeId: string; // Google Place ID
  lat: number;
  lng: number;
  website?: string; // POIのウェブサイトURL（オプション）
  rating?: number; // 星評価（オプション）
  placeName?: string; // 場所の名前（formatted_addressとは別）
  formattedAddress?: string; // formatted_address
  openingHours?: google.maps.places.PlaceOpeningHours;
  businessStatus?: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY';
  userRatingsTotal?: number; // レビュー数
  reviews?: google.maps.places.PlaceReview[];
  photos?: google.maps.places.PlacePhoto[];
  waypoints?: Place[]; // オプショナルに変更
  geometry?: google.maps.places.PlaceGeometry;
  html_attributions?: string[];
  utcOffsetMinutes?: number;
}

export interface RouteData {
  origin: Place | null;
  destination: Place | null;
  waypoints: (Place | null)[];
}

/**
 * Google Maps URLを生成する
 * @param places DraggablePlaceの配列
 * @returns Google Maps URL
 */
export function generateGoogleMapsUrl(places: DraggablePlace[]): string | null {
  if (places.length < 2) return null;

  const originItem = places[0];
  const destinationItem = places[places.length - 1];
  const waypoints = places.slice(1, -1);

  // 出発地と目的地が必須
  if (!originItem?.place || !destinationItem?.place) {
    return null;
  }
  
  const { place: origin } = originItem;
  const { place: destination } = destinationItem;

  const baseUrl = 'https://www.google.com/maps/dir/';
  const params = new URLSearchParams();

  // 基本パラメータ
  params.append('api', '1');
  params.append('origin', `${origin.lat},${origin.lng}`);
  params.append('destination', `${destination.lat},${destination.lng}`);
  params.append('travelmode', 'driving');

  // 中継地点がある場合は追加
  if (waypoints.length > 0) {
    const validWaypoints = waypoints
      .map(item => item.place)
      .filter((place): place is Place => place !== null);
      
    if (validWaypoints.length > 0) {
      const waypointString = validWaypoints
        .map(waypoint => `${waypoint.lat},${waypoint.lng}`)
        .join('|');
      params.append('waypoints', waypointString);
    }
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * ルートデータが有効かチェックする
 * @param places DraggablePlaceの配列
 * @returns 有効な場合はtrue
 */
export function isValidRoute(places: DraggablePlace[]): boolean {
  if (places.length < 2) return false;
  const origin = places[0];
  const destination = places[places.length - 1];
  return !!(origin.place && destination.place);
}

/**
 * 地点の表示名を取得する
 * @param place 地点データ
 * @returns 表示名
 */
export function getPlaceDisplayName(place: Place): string {
  return place.name;
}

/**
 * 地点の座標文字列を取得する
 * @param place 地点データ
 * @returns 座標文字列
 */
export function getPlaceCoordinates(place: Place): string {
  return `${place.lat.toFixed(6)}, ${place.lng.toFixed(6)}`;
} 