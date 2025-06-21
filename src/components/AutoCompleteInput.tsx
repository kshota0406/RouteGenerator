'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface AutoCompleteInputProps {
  onSelect: (prediction: google.maps.places.AutocompletePrediction) => void;
  onClear: () => void;
  initialValue?: string;
  placeholder: string;
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({ onSelect, onClear, initialValue = '', placeholder }) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Google Maps APIの読み込み
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
    });
  }, []);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const debounceSearch = useCallback((searchTerm: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      if (searchTerm.trim().length < 2 || !autocompleteServiceRef.current) {
        setIsSearching(false);
        setShowSuggestions(false);
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      setShowSuggestions(true);
      
      const request: google.maps.places.AutocompletionRequest = {
        input: searchTerm,
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'jp' },
      };
      
      autocompleteServiceRef.current.getPlacePredictions(request, (predictions, status) => {
        setIsSearching(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      });
    }, 300);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue === '') {
      onClear();
      setShowSuggestions(false);
    } else {
      debounceSearch(newValue);
    }
  };

  const handleSelectSuggestion = (prediction: google.maps.places.AutocompletePrediction) => {
    setInputValue(prediction.structured_formatting.main_text);
    setShowSuggestions(false);
    onSelect(prediction);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
        onBlur={() => { setTimeout(() => setShowSuggestions(false), 200); }}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
      {showSuggestions && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto text-gray-900">
          {isSearching ? (
            <li className="px-4 py-2 text-gray-500">検索中...</li>
          ) : suggestions.length > 0 ? (
            suggestions.map((p) => (
              <li
                key={p.place_id}
                onMouseDown={() => handleSelectSuggestion(p)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                <p className="font-semibold">{p.structured_formatting.main_text}</p>
                <p className="text-sm text-gray-600">{p.structured_formatting.secondary_text}</p>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">一致する結果がありません</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInput; 