import * as SQLite from "expo-sqlite";

import { rightsCategories } from "@/data/rights";
import { procedures } from "@/data/procedures";

const DB_NAME = "nyaya_fts_v1.db";
const SEED_VERSION = "3";
const META_KEY = "seed_version";

let _db: SQLite.SQLiteDatabase | null = null;
let _initPromise: Promise<void> | null = null;

async function openDb(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync(DB_NAME);
  return _db;
}

export async function initSearchDb(): Promise<void> {
  if (_initPromise) return _initPromise;
  _initPromise = _init();
  return _initPromise;
}

async function _init(): Promise<void> {
  const d = await openDb();

  let useFts5 = true;
  try {
    await d.execAsync(`
      CREATE VIRTUAL TABLE IF NOT EXISTS rights_fts USING fts5(
        id UNINDEXED,
        category_id UNINDEXED,
        title,
        summary
      );
      CREATE VIRTUAL TABLE IF NOT EXISTS procedures_fts USING fts5(
        id UNINDEXED,
        title,
        summary
      );
      CREATE TABLE IF NOT EXISTS fts_meta (id TEXT PRIMARY KEY, value TEXT);
    `);
  } catch {
    useFts5 = false;
    await d.execAsync(`
      CREATE TABLE IF NOT EXISTS rights_fts (
        id TEXT, category_id TEXT, title TEXT, summary TEXT
      );
      CREATE TABLE IF NOT EXISTS procedures_fts (
        id TEXT, title TEXT, summary TEXT
      );
      CREATE TABLE IF NOT EXISTS fts_meta (id TEXT PRIMARY KEY, value TEXT);
    `);
  }

  const meta = await d.getFirstAsync<{ value: string }>("SELECT value FROM fts_meta WHERE id = ?", [
    META_KEY,
  ]);
  if (meta?.value === SEED_VERSION) return;

  await d.withTransactionAsync(async () => {
    await d.runAsync("DELETE FROM rights_fts");
    for (const cat of rightsCategories) {
      for (const item of cat.items) {
        await d.runAsync(
          "INSERT INTO rights_fts(id, category_id, title, summary) VALUES (?,?,?,?)",
          [item.id, cat.id, item.title, item.summary],
        );
      }
    }

    await d.runAsync("DELETE FROM procedures_fts");
    for (const proc of procedures) {
      await d.runAsync("INSERT INTO procedures_fts(id, title, summary) VALUES (?,?,?)", [
        proc.id,
        proc.title,
        proc.description,
      ]);
    }

    await d.runAsync("INSERT OR REPLACE INTO fts_meta(id, value) VALUES (?,?)", [
      META_KEY,
      SEED_VERSION,
    ]);
  });

  (d as any)._useFts5 = useFts5;
}

export interface FTSResult {
  id: string;
  title: string;
  summary: string;
  type: "right" | "procedure";
  categoryId?: string;
}

export async function ftsSearch(query: string): Promise<FTSResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const d = await openDb();
  const useFts5 = (d as any)._useFts5 !== false;

  try {
    if (useFts5) {
      const terms = q
        .replace(/["'*?()]/g, "")
        .split(/\s+/)
        .filter(Boolean)
        .map((t) => t + "*")
        .join(" OR ");

      const rights = await d.getAllAsync<{
        id: string;
        category_id: string;
        title: string;
        summary: string;
      }>(
        "SELECT id, category_id, title, summary FROM rights_fts WHERE rights_fts MATCH ? ORDER BY rank",
        [terms],
      );

      const procs = await d.getAllAsync<{
        id: string;
        title: string;
        summary: string;
      }>(
        "SELECT id, title, summary FROM procedures_fts WHERE procedures_fts MATCH ? ORDER BY rank",
        [terms],
      );

      return [
        ...rights.map((r) => ({
          id: r.id,
          title: r.title,
          summary: r.summary,
          type: "right" as const,
          categoryId: r.category_id,
        })),
        ...procs.map((p) => ({
          id: p.id,
          title: p.title,
          summary: p.summary,
          type: "procedure" as const,
        })),
      ];
    }
  } catch {}

  const like = `%${q}%`;
  const rights = await d.getAllAsync<{
    id: string;
    category_id: string;
    title: string;
    summary: string;
  }>(
    "SELECT id, category_id, title, summary FROM rights_fts WHERE title LIKE ? OR summary LIKE ?",
    [like, like],
  );
  const procs = await d.getAllAsync<{
    id: string;
    title: string;
    summary: string;
  }>("SELECT id, title, summary FROM procedures_fts WHERE title LIKE ? OR summary LIKE ?", [
    like,
    like,
  ]);

  return [
    ...rights.map((r) => ({
      id: r.id,
      title: r.title,
      summary: r.summary,
      type: "right" as const,
      categoryId: r.category_id,
    })),
    ...procs.map((p) => ({
      id: p.id,
      title: p.title,
      summary: p.summary,
      type: "procedure" as const,
    })),
  ];
}
