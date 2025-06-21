import { DraggablePlace } from './store';
import { Place } from './mapsUrl';

export interface RouteData {
  origin: Place | null;
  destination: Place | null;
  waypoints: Place[];
}

/**
 * UTF-8対応のBase64エンコード
 */
function utf8ToBase64(str: string): string {
  try {
    // まずUTF-8でエンコード
    const utf8Bytes = new TextEncoder().encode(str);
    // バイト配列をBase64に変換
    const base64 = btoa(String.fromCharCode(...utf8Bytes));
    return base64;
  } catch (error) {
    console.error('UTF-8 to Base64 encoding failed:', error);
    // フォールバック: 文字列を直接エンコード（非推奨だが動作する）
    return btoa(unescape(encodeURIComponent(str)));
  }
}

/**
 * UTF-8対応のBase64デコード
 */
function base64ToUtf8(base64: string): string {
  try {
    // Base64をバイト配列に変換
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    // UTF-8でデコード
    return new TextDecoder().decode(bytes);
  } catch (error) {
    console.error('Base64 to UTF-8 decoding failed:', error);
    // フォールバック: 直接デコード
    return decodeURIComponent(escape(atob(base64)));
  }
}

interface CompressedPlace {
  n: string;
  id: string;
  lat: number;
  lng: number;
}

interface CompressedRouteData {
  o: CompressedPlace | null;
  d: CompressedPlace | null;
  w: CompressedPlace[];
}

/**
 * 経路データを圧縮する
 */
function compressRouteData(routeData: RouteData): CompressedRouteData {
  return {
    o: routeData.origin ? {
      n: routeData.origin.name,
      id: routeData.origin.placeId,
      lat: routeData.origin.lat,
      lng: routeData.origin.lng,
    } : null,
    d: routeData.destination ? {
      n: routeData.destination.name,
      id: routeData.destination.placeId,
      lat: routeData.destination.lat,
      lng: routeData.destination.lng,
    } : null,
    w: routeData.waypoints.map(wp => ({
      n: wp.name,
      id: wp.placeId,
      lat: wp.lat,
      lng: wp.lng,
    }))
  };
}

/**
 * 圧縮された経路データを展開する
 */
function decompressRouteData(compressed: CompressedRouteData): RouteData {
  return {
    origin: compressed.o ? {
      name: compressed.o.n,
      placeId: compressed.o.id,
      lat: compressed.o.lat,
      lng: compressed.o.lng,
    } : null,
    destination: compressed.d ? {
      name: compressed.d.n,
      placeId: compressed.d.id,
      lat: compressed.d.lat,
      lng: compressed.d.lng,
    } : null,
    waypoints: compressed.w.map((wp: CompressedPlace) => ({
      name: wp.n,
      placeId: wp.id,
      lat: wp.lat,
      lng: wp.lng,
    }))
  };
}

/**
 * 経路データをURLクエリパラメータにエンコードする
 */
export function encodeRouteToUrl(places: DraggablePlace[]): string {
  const routeData: RouteData = {
    origin: places[0]?.place || null,
    destination: places[places.length - 1]?.place || null,
    waypoints: places.slice(1, -1).map(p => p.place).filter((p): p is Place => p !== null)
  };

  const compressedData = compressRouteData(routeData);
  const jsonString = JSON.stringify(compressedData);
  
  // UTF-8対応のBase64エンコーディング
  const encodedData = utf8ToBase64(jsonString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
    
  return `${window.location.origin}?route=${encodedData}`;
}

/**
 * URLクエリパラメータから経路データをデコードする
 */
export function decodeRouteFromUrl(): RouteData | null {
  const urlParams = new URLSearchParams(window.location.search);
  const routeParam = urlParams.get('route');
  
  if (!routeParam) return null;
  
  try {
    // URLセーフなBase64デコード
    const paddedParam = routeParam
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const padding = 4 - (paddedParam.length % 4);
    const padded = padding === 4 ? paddedParam : paddedParam + '='.repeat(padding);
    
    const decodedData = base64ToUtf8(padded);
    const compressedData: CompressedRouteData = JSON.parse(decodedData);
    return decompressRouteData(compressedData);
  } catch (error) {
    console.error('Failed to decode route data:', error);
    return null;
  }
}

/**
 * 経路データをDraggablePlaceの配列に変換する
 */
export function routeDataToPlaces(routeData: RouteData): DraggablePlace[] {
  const places: DraggablePlace[] = [];
  
  // 出発地
  if (routeData.origin) {
    places.push({
      id: 'origin-0',
      place: routeData.origin,
      type: 'origin',
      placeholder: '出発地を検索',
      isDetailsVisible: false,
    });
  }
  
  // 中継地点
  routeData.waypoints.forEach((waypoint, index) => {
    places.push({
      id: `waypoint-${index + 1}`,
      place: waypoint,
      type: 'waypoint',
      placeholder: '中継地点を検索',
      isDetailsVisible: false,
    });
  });
  
  // 目的地
  if (routeData.destination) {
    places.push({
      id: `destination-${places.length}`,
      place: routeData.destination,
      type: 'destination',
      placeholder: '目的地を検索',
      isDetailsVisible: false,
    });
  }
  
  return places;
}

/**
 * 現在のURLをクリップボードにコピーする
 */
export async function copyRouteUrl(): Promise<boolean> {
  try {
    const currentUrl = window.location.href;
    await navigator.clipboard.writeText(currentUrl);
    return true;
  } catch (error) {
    console.error('Failed to copy URL:', error);
    return false;
  }
}

/**
 * 経路URLをシェアする（Web Share APIを使用）
 */
export async function shareRouteUrl(): Promise<boolean> {
  if (!navigator.share) {
    // Web Share APIがサポートされていない場合はクリップボードにコピー
    return copyRouteUrl();
  }
  
  try {
    await navigator.share({
      title: 'Google Maps ルート',
      text: '作成したルートをシェアします',
      url: window.location.href,
    });
    return true;
  } catch (error) {
    console.error('Failed to share URL:', error);
    return false;
  }
} 