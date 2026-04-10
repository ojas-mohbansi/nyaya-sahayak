import { rightsCategories } from "@/data/rights";
import { procedures } from "@/data/procedures";

export interface FTSResult {
  id: string;
  title: string;
  summary: string;
  type: "right" | "procedure";
  categoryId?: string;
}

export async function initSearchDb(): Promise<void> {}

export async function ftsSearch(query: string): Promise<FTSResult[]> {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const results: FTSResult[] = [];

  for (const cat of rightsCategories) {
    for (const item of cat.items) {
      if (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q)
      ) {
        results.push({
          id: item.id,
          title: item.title,
          summary: item.summary,
          type: "right",
          categoryId: cat.id,
        });
      }
    }
  }

  for (const proc of procedures) {
    if (
      proc.title.toLowerCase().includes(q) ||
      proc.description.toLowerCase().includes(q)
    ) {
      results.push({
        id: proc.id,
        title: proc.title,
        summary: proc.description,
        type: "procedure",
      });
    }
  }

  return results;
}
