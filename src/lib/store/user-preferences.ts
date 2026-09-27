'use client';

import { useSyncExternalStore, useCallback, useMemo } from 'react';

const FAVORITES_STORAGE_KEY = 're_intelligence_favorites';
const COMPARE_STORAGE_KEY = 're_intelligence_compare';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('re_preferences_change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('re_preferences_change', callback);
  };
}

function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('re_preferences_change'));
  }
}

export function useFavorites() {
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return '[]';
    return localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]';
  }, []);

  const getServerSnapshot = () => '[]';

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const favorites = useMemo<string[]>(() => {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }, [raw]);

  const toggleFavorite = useCallback((propertyId: string) => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      const current: string[] = stored ? JSON.parse(stored) : [];
      const next = current.includes(propertyId)
        ? current.filter((id) => id !== propertyId)
        : [...current, propertyId];
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      notifyChange();
    } catch {
      // Ignored
    }
  }, []);

  const isFavorite = useCallback(
    (propertyId: string) => favorites.includes(propertyId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, isLoaded: true };
}

export function useComparison() {
  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined') return '[]';
    return localStorage.getItem(COMPARE_STORAGE_KEY) || '[]';
  }, []);

  const getServerSnapshot = () => '[]';

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const compareList = useMemo<string[]>(() => {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }, [raw]);

  const toggleCompare = useCallback((propertyId: string) => {
    try {
      const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
      const current: string[] = stored ? JSON.parse(stored) : [];
      let next: string[];
      if (current.includes(propertyId)) {
        next = current.filter((id) => id !== propertyId);
      } else {
        if (current.length >= 4) {
          alert('You can compare up to 4 properties at a time.');
          return;
        }
        next = [...current, propertyId];
      }
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(next));
      notifyChange();
    } catch {
      // Ignored
    }
  }, []);

  const removeFromCompare = useCallback((propertyId: string) => {
    try {
      const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
      const current: string[] = stored ? JSON.parse(stored) : [];
      const next = current.filter((id) => id !== propertyId);
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(next));
      notifyChange();
    } catch {
      // Ignored
    }
  }, []);

  const clearComparison = useCallback(() => {
    try {
      localStorage.removeItem(COMPARE_STORAGE_KEY);
      notifyChange();
    } catch {
      // Ignored
    }
  }, []);

  const isInCompare = useCallback(
    (propertyId: string) => compareList.includes(propertyId),
    [compareList]
  );

  return {
    compareList,
    toggleCompare,
    removeFromCompare,
    clearComparison,
    isInCompare,
    isLoaded: true
  };
}
