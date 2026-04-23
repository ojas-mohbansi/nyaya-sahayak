import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface BookmarkContextType {
  bookmarks: string[];
  procedureBookmarks: string[];
  toggleBookmark: (id: string) => void;
  toggleProcedureBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  isProcedureBookmarked: (id: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType>({
  bookmarks: [],
  procedureBookmarks: [],
  toggleBookmark: () => {},
  toggleProcedureBookmark: () => {},
  isBookmarked: () => false,
  isProcedureBookmarked: () => false,
});

const STORAGE_KEY = "nyaya_bookmarks";
const PROC_STORAGE_KEY = "nyaya_proc_bookmarks";

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [procedureBookmarks, setProcedureBookmarks] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.multiGet([STORAGE_KEY, PROC_STORAGE_KEY]).then((pairs) => {
      for (const [key, val] of pairs) {
        if (val) {
          try {
            const parsed = JSON.parse(val);
            if (key === STORAGE_KEY) setBookmarks(parsed);
            else setProcedureBookmarks(parsed);
          } catch {}
        }
      }
    });
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleProcedureBookmark = useCallback((id: string) => {
    setProcedureBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      AsyncStorage.setItem(PROC_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback((id: string) => bookmarks.includes(id), [bookmarks]);

  const isProcedureBookmarked = useCallback(
    (id: string) => procedureBookmarks.includes(id),
    [procedureBookmarks],
  );

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        procedureBookmarks,
        toggleBookmark,
        toggleProcedureBookmark,
        isBookmarked,
        isProcedureBookmarked,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarkContext);
}
