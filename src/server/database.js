import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';
const dbFileName = isTestEnv ? 'cookie-clicker.test.db' : 'cookie-clicker.db';
const dbPath = path.resolve(__dirname, `../../data/${dbFileName}`);

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS game_state (
    user_id INTEGER PRIMARY KEY,
    cookies REAL DEFAULT 0,
    click_value INTEGER DEFAULT 1,
    cursor_count INTEGER DEFAULT 0,
    grandma_count INTEGER DEFAULT 0,
    farm_count INTEGER DEFAULT 0,
    mine_count INTEGER DEFAULT 0,
    factory_count INTEGER DEFAULT 0,
    bank_count INTEGER DEFAULT 0,
    temple_count INTEGER DEFAULT 0,
    click_multiplier REAL DEFAULT 1.0,
    production_multiplier REAL DEFAULT 1.0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

const ensureColumn = (columnName, sqlDefinition) => {
  const columns = db.prepare('PRAGMA table_info(game_state)').all();
  const exists = columns.some((col) => col.name === columnName);
  if (!exists) {
    db.exec(`ALTER TABLE game_state ADD COLUMN ${columnName} ${sqlDefinition}`);
  }
};

ensureColumn('cursor_count', 'INTEGER DEFAULT 0');
ensureColumn('grandma_count', 'INTEGER DEFAULT 0');
ensureColumn('farm_count', 'INTEGER DEFAULT 0');
ensureColumn('mine_count', 'INTEGER DEFAULT 0');
ensureColumn('factory_count', 'INTEGER DEFAULT 0');
ensureColumn('bank_count', 'INTEGER DEFAULT 0');
ensureColumn('temple_count', 'INTEGER DEFAULT 0');
ensureColumn('production_multiplier', 'REAL DEFAULT 1.0');

export default db;
