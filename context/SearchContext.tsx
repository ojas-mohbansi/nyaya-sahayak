import React, { createContext, useContext, useMemo, useState } from "react";

import { rightsCategories } from "@/data/rights";
import { procedures } from "@/data/procedures";

export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  type: "right" | "procedure";
  categoryId?: string;
}

interface SearchContextType {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
}

const SearchContext = createContext<SearchContextType>({
  query: "",
  setQuery: () => {},
  results: [],
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");

  const allItems = useMemo(() => {
    const items: SearchResult[] = [];
    for (const cat of rightsCategories) {
      for (const item of cat.items) {
        items.push({
          id: item.id,
          title: item.title,
          summary: item.summary,
          type: "right",
          categoryId: cat.id,
        });
      }
    }
    for (const proc of procedures) {
      items.push({
        id: proc.id,
        title: proc.title,
        summary: proc.description,
        type: "procedure",
      });
    }
    return items;
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q),
    );
  }, [query, allItems]);

  return (
    <SearchContext.Provider value={{ query, setQuery, results }}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
