import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface RecentlyViewedItem {
  id: string;
  title: string;
  type: "right" | "procedure";
  categoryId?: string;
  viewedAt: number;
}

interface RecentlyViewedContextType {
  recentItems: RecentlyViewedItem[];
  addRecentItem: (item: Omit<RecentlyViewedItem, "viewedAt">) => void;
  clearRecent: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType>({
  recentItems: [],
  addRecentItem: () => {},
  clearRecent: () => {},
});

const STORAGE_KEY = "nyaya_recently_viewed";
const MAX_ITEMS = 5;

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentItems, setRecentItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        try {
          setRecentItems(JSON.parse(val));
        } catch {}
      }
    });
  }, []);

  const addRecentItem = useCallback((item: Omit<RecentlyViewedItem, "viewedAt">) => {
    setRecentItems((prev) => {
      const next = [
        { ...item, viewedAt: Date.now() },
        ...prev.filter((i) => i.id !== item.id),
      ].slice(0, MAX_ITEMS);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecentItems([]);
    AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ recentItems, addRecentItem, clearRecent }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  return useContext(RecentlyViewedContext);
}
