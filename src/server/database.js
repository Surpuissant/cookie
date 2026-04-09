import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../../data/cookie-clicker.db');

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
    auto_clickers INTEGER DEFAULT 0,
    vitesse_level INTEGER DEFAULT 1,
    click_multiplier REAL DEFAULT 1.0,
    auto_multiplier REAL DEFAULT 1.0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

export default db;
