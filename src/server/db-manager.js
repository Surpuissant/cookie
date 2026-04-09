import db from './database.js';

export const getUserByUsername = (username) => {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
};

export const verifyUser = (username, password) => {
    return db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
};

export const createUser = (username, password) => {
    const info = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, password);
    const userId = info.lastInsertRowid;
    db.prepare('INSERT INTO game_state (user_id) VALUES (?)').run(userId);
    return userId;
};

export const getGameState = (userId) => {
    return db.prepare('SELECT * FROM game_state WHERE user_id = ?').get(userId);
};

export const saveGameState = (userId, state) => {
    const { 
        cookies, 
        click_value, 
        auto_clickers, 
        vitesse_level, 
        click_multiplier = 1.0, 
        auto_multiplier = 1.0 
    } = state;
    return db.prepare(`
        UPDATE game_state 
        SET cookies = ?, click_value = ?, auto_clickers = ?, vitesse_level = ?, click_multiplier = ?, auto_multiplier = ? 
        WHERE user_id = ?
    `).run(cookies, click_value, auto_clickers, vitesse_level, click_multiplier, auto_multiplier, userId);
};

