"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { SerializedEvent } from "@/lib/models/Event";

const STORAGE_KEY = "event-management-cache";

interface EventCacheContextValue {
  seedEvents: (events: SerializedEvent[]) => void;
  getAllCachedEvents: () => SerializedEvent[];
  getCachedEvent: (id: string) => SerializedEvent | null;
  setCachedEvent: (event: SerializedEvent) => void;
  removeCachedEvent: (id: string) => void;
}

const EventCacheContext = createContext<EventCacheContextValue | null>(null);

function readStorage(): SerializedEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SerializedEvent[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(events: SerializedEvent[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // ignore quota errors
  }
}

export function EventCacheProvider({ children }: { children: ReactNode }) {
  const memoryCache = useMemo(() => {
    const map = new Map<string, SerializedEvent>();
    readStorage().forEach((event) => map.set(event.id, event));
    return map;
  }, []);

  const seedEvents = useCallback(
    (events: SerializedEvent[]) => {
      events.forEach((event) => memoryCache.set(event.id, event));
      writeStorage(events);
    },
    [memoryCache]
  );

  const getAllCachedEvents = useCallback(() => {
    if (memoryCache.size > 0) {
      return Array.from(memoryCache.values());
    }
    return readStorage();
  }, [memoryCache]);

  const getCachedEvent = useCallback(
    (id: string) => {
      const fromMemory = memoryCache.get(id);
      if (fromMemory) return fromMemory;

      const fromStorage = readStorage().find((event) => event.id === id);
      if (fromStorage) {
        memoryCache.set(id, fromStorage);
        return fromStorage;
      }
      return null;
    },
    [memoryCache]
  );

  const setCachedEvent = useCallback(
    (event: SerializedEvent) => {
      memoryCache.set(event.id, event);
      const stored = readStorage().filter((item) => item.id !== event.id);
      stored.push(event);
      writeStorage(stored);
    },
    [memoryCache]
  );

  const removeCachedEvent = useCallback(
    (id: string) => {
      memoryCache.delete(id);
      writeStorage(readStorage().filter((event) => event.id !== id));
    },
    [memoryCache]
  );

  const value = useMemo(
    () => ({
      seedEvents,
      getAllCachedEvents,
      getCachedEvent,
      setCachedEvent,
      removeCachedEvent,
    }),
    [seedEvents, getAllCachedEvents, getCachedEvent, setCachedEvent, removeCachedEvent]
  );

  return (
    <EventCacheContext.Provider value={value}>{children}</EventCacheContext.Provider>
  );
}

export function useEventCache() {
  const context = useContext(EventCacheContext);
  if (!context) {
    throw new Error("useEventCache must be used within EventCacheProvider");
  }
  return context;
}
