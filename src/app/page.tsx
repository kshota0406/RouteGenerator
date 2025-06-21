'use client';

import React, { useState, useEffect } from 'react';
import { Provider } from 'jotai';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { usePlaces } from '@/hooks/usePlaces';
import { generateGoogleMapsUrl, isValidRoute } from '@/lib/mapsUrl';
import { MAX_WAYPOINTS } from '@/lib/store';
import SortablePlaceInput from '@/components/SortablePlaceInput';
import ShareButtons from '@/components/ShareButtons';
import GoogleCredit from '@/components/GoogleCredit';

const AppContent: React.FC = () => {
  const {
    places,
    waypoints,
    updatePlace,
    togglePlaceDetails,
    toggleAllDetails,
    addWaypoint,
    removeWaypoint,
    handleDragEnd,
    resetPlaces,
  } = usePlaces();

  const [areAllDetailsVisible, setAreAllDetailsVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleToggleAllDetails = () => {
    const nextState = toggleAllDetails(areAllDetailsVisible);
    setAreAllDetailsVisible(nextState);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = generateGoogleMapsUrl(places);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const canSubmit = isValidRoute(places);
  const placeIds = places.map(p => p.id);
  const hasRoute = places.some(p => p.place);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-2 py-4">
        <header className="text-center mb-2">
          <h1 className="text-2xl font-extrabold text-gray-800">
            Google Maps Route Generator
          </h1>
        </header>

        <main className="bg-white p-2 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2">
              <button
                onClick={handleToggleAllDetails}
                className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {areAllDetailsVisible ? 'すべて閉じる' : 'すべて展開'}
              </button>
              {hasRoute && (
                <button
                  onClick={resetPlaces}
                  className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                >
                  リセット
                </button>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isClient && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={placeIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {places.map((item, index) => (
                      <React.Fragment key={item.id}>
                        {item.type === 'destination' && waypoints.length < MAX_WAYPOINTS && (
                          <div className="flex justify-center my-2">
                            <button
                              type="button"
                              onClick={addWaypoint}
                              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                              経由地を追加
                            </button>
                          </div>
                        )}

                        <SortablePlaceInput
                          item={item}
                          onChange={(place) => updatePlace(item.id, place)}
                          onRemove={item.type === 'waypoint' ? () => removeWaypoint(item.id) : undefined}
                          isFirst={item.type === 'origin'}
                          isLast={item.type === 'destination'}
                          isDetailsVisible={item.isDetailsVisible}
                          onToggleDetails={() => togglePlaceDetails(item.id)}
                        />
                        
                        {index < places.length - 1 && (
                          <div className="relative text-center h-4 my-1">
                              <div className="border-l-2 border-dotted border-gray-300 h-full w-0 mx-auto"></div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            <div className="pt-4">
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-1/2 flex items-center justify-center px-4 py-2 text-sm text-center font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <span className="leading-tight">
                    Google Mapで
                    <br />
                    経路を見る
                  </span>
                  <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
                
                {hasRoute && (
                  <ShareButtons />
                )}
              </div>
            </div>
          </form>
        </main>

        <footer className="text-center mt-4">
          <GoogleCredit />
        </footer>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => (
  <Provider>
    <AppContent />
  </Provider>
);

export default HomePage;
