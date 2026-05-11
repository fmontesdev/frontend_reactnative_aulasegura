import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useRouter, usePathname, useLocalSearchParams } from 'expo-router';
import { Platform } from 'react-native';
import { normalizeFilterValue } from '../utils/filterDisplayUtils';

interface FilterContextType {
  filters: string[];
  addFilter: (filter: string) => void;
  removeFilter: (index: number) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType>({
  filters: [],
  addFilter: () => {},
  removeFilter: () => {},
  clearFilters: () => {},
});

const isWeb = Platform.OS === 'web' && typeof window !== 'undefined';

function parseFilters(raw?: string | null) {
  return raw ? String(raw).split(',').filter(Boolean) : [];
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useLocalSearchParams();
  // Inicializado con pathname para que la primera ejecución no cuente como navegación
  const prevPathname = useRef(pathname);

  const [filters, setFilters] = useState<string[]>([]);
  const skipURLWrite = useRef(false);

  // URL -> estado
  // Al navegar a otra pantalla limpia los filtros; en carga inicial los restaura desde la URL
  useEffect(() => {
    const navigated = prevPathname.current !== pathname;
    prevPathname.current = pathname;

    const syncFiltersFromURL = () => {
      const routeFilters = Array.isArray(searchParams.filters)
        ? searchParams.filters[0]
        : searchParams.filters as string | undefined;
      const raw = isWeb
        ? new URLSearchParams(window.location.search).get('filters')
        : routeFilters;
      const initial = parseFilters(raw);

      skipURLWrite.current = true;
      setFilters(initial);
    };

    if (isWeb && navigated) {
      const timeoutId = setTimeout(syncFiltersFromURL, 0);
      return () => clearTimeout(timeoutId);
    }

    if (navigated || searchParams.filters) {
      syncFiltersFromURL();
    }
  }, [pathname, searchParams.filters]);

  // Estado -> URL
  // Mantiene los query params sincronizados cuando el usuario agrega o quita chips
  // Usa replaceState para no crear entradas en el historial
  useEffect(() => {
    if (skipURLWrite.current) { skipURLWrite.current = false; return; }

    if (isWeb) {
      const url = new URL(window.location.href);
      url.searchParams.delete('filters');
      if (filters.length > 0) {
        // Añadimos filters manualmente para evitar que URLSearchParams codifique
        // las comas como %2C, manteniendo la URL legible (?filters=eso,bio)
        const separator = url.search ? '&' : '?';
        window.history.replaceState({}, '', url.toString() + separator + 'filters=' + filters.join(','));
      } else {
        window.history.replaceState({}, '', url.toString());
      }
    } else {
      router.setParams({ filters: filters.length > 0 ? filters.join(',') : undefined });
    }
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Función para agregar un filtro (chip)
  const addFilter = (filter: string) => {
    const trimmed = normalizeFilterValue(filter);
    if (trimmed && !filters.includes(trimmed)) setFilters(prev => [...prev, trimmed]);
  };

  // Función para eliminar un filtro por índice
  const removeFilter = (index: number) =>
    setFilters(prev => prev.filter((_, i) => i !== index));

  // Función para limpiar todos los filtros
  const clearFilters = () => setFilters([]);

  return (
    <FilterContext.Provider value={{ filters, addFilter, removeFilter, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  return useContext(FilterContext);
}
