declare module "better-sqlite3-session-store" {
  import session from "express-session";
  import Database from "better-sqlite3";

  type BetterSqlite3StoreOptions = {
    client: Database.Database;
    expired?: {
      clear?: boolean;
      intervalMs?: number;
    };
  };

  type BetterSqlite3StoreConstructor = new (
    options: BetterSqlite3StoreOptions,
  ) => session.Store;

  export default function betterSqlite3Store(
    sessionModule: typeof session,
  ): BetterSqlite3StoreConstructor;
}
