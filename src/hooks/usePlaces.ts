import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import { placesAtom, initialPlaces, DraggablePlace, MAX_WAYPOINTS } from '@/lib/store';
import { Place } from '@/lib/mapsUrl';
import { decodeRouteFromUrl, routeDataToPlaces, encodeRouteToUrl } from '@/lib/routeSharing';

export const usePlaces = () => {
  const [places, setPlaces] = useAtom(placesAtom);

  // URLから経路を復元する
  const restoreRouteFromUrl = useCallback(() => {
    const routeData = decodeRouteFromUrl();
    if (routeData) {
      const restoredPlaces = routeDataToPlaces(routeData);
      setPlaces(restoredPlaces);
      return true;
    }
    return false;
  }, [setPlaces]);

  // 現在の経路をURLに保存する
  const saveRouteToUrl = useCallback(() => {
    const routeUrl = encodeRouteToUrl(places);
    window.history.replaceState({}, '', routeUrl);
  }, [places]);

  // コンポーネントマウント時にURLから経路を復元
  useEffect(() => {
    if (typeof window !== 'undefined') {
      restoreRouteFromUrl();
    }
  }, [restoreRouteFromUrl]);

  // 経路が変更されたらURLを更新
  useEffect(() => {
    if (places.some(p => p.place)) {
      saveRouteToUrl();
    }
  }, [places, saveRouteToUrl]);

  const updatePlace = useCallback((id: string, newPlace: Place | null) => {
    setPlaces(currentPlaces =>
      currentPlaces.map(p =>
        p.id === id ? { ...p, place: newPlace, isDetailsVisible: !!newPlace } : p
      )
    );
  }, [setPlaces]);
  
  const resetPlaces = useCallback(() => {
    setPlaces(initialPlaces);
    // URLからクエリパラメータを削除
    window.history.replaceState({}, '', window.location.pathname);
  }, [setPlaces]);

  const togglePlaceDetails = useCallback((id: string) => {
    setPlaces(currentPlaces =>
      currentPlaces.map(p =>
        p.id === id ? { ...p, isDetailsVisible: !p.isDetailsVisible } : p
      )
    );
  }, [setPlaces]);

  const toggleAllDetails = useCallback((areAllDetailsVisible: boolean) => {
    const nextVisibility = !areAllDetailsVisible;
    setPlaces(currentPlaces => 
      currentPlaces.map(p => ({ ...p, isDetailsVisible: nextVisibility }))
    );
    return nextVisibility;
  }, [setPlaces]);

  const addWaypoint = useCallback(() => {
    const waypoints = places.filter(p => p.type === 'waypoint');
    if (waypoints.length >= MAX_WAYPOINTS) return;

    const newWaypoint: DraggablePlace = {
      id: `waypoint-${Date.now()}`,
      place: null,
      type: 'waypoint',
      placeholder: '経由地を入力',
      isDetailsVisible: true,
    };
    setPlaces(currentPlaces => {
      const destinationIndex = currentPlaces.findIndex(p => p.type === 'destination');
      return [
        ...currentPlaces.slice(0, destinationIndex),
        newWaypoint,
        ...currentPlaces.slice(destinationIndex)
      ];
    });
  }, [places, setPlaces]);

  const removeWaypoint = useCallback((id: string) => {
    setPlaces(currentPlaces => currentPlaces.filter(p => p.id !== id));
  }, [setPlaces]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPlaces((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, [setPlaces]);
  
  const waypoints = places.filter(p => p.type === 'waypoint');

  return {
    places,
    waypoints,
    updatePlace,
    togglePlaceDetails,
    toggleAllDetails,
    addWaypoint,
    removeWaypoint,
    handleDragEnd,
    restoreRouteFromUrl,
    saveRouteToUrl,
    resetPlaces,
  };
}; 