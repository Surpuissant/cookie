import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as dbManager from '../../src/server/db-manager.js';
import db from '../../src/server/database.js';

// Clean up database before each test
beforeEach(() => {
    db.prepare('DELETE FROM game_state').run();
    db.prepare('DELETE FROM users').run();
});

describe('Database Manager', () => {
    it('should create a new user and initial game state', () => {
        const userId = dbManager.createUser('testuser', 'password');
        expect(userId).toBeDefined();

        const user = dbManager.verifyUser('testuser', 'password');
        expect(user.username).toBe('testuser');

        const state = dbManager.getGameState(userId);
        expect(state.cookies).toBe(0);
        expect(state.click_value).toBe(1);
    });

    it('should verify correct credentials', () => {
        dbManager.createUser('valid', 'pass');
        const user = dbManager.verifyUser('valid', 'pass');
        expect(user).not.toBeNull();
    });

    it('should retrieve a user by username', () => {
        dbManager.createUser('searchable', 'pass');
        const user = dbManager.getUserByUsername('searchable');
        expect(user).toBeDefined();
        expect(user.username).toBe('searchable');
    });

    it('should not verify incorrect credentials', () => {
        dbManager.createUser('user', 'pass');
        const user = dbManager.verifyUser('user', 'wrong');
        expect(user).toBeUndefined();
    });

    it('should save and load game state', () => {
        const userId = dbManager.createUser('gamer', 'pass');
        const newState = {
            cookies: 1234,
            click_value: 5,
            auto_clickers: 10,
            vitesse_level: 2
        };

        dbManager.saveGameState(userId, newState);
        const loaded = dbManager.getGameState(userId);

        expect(loaded.cookies).toBe(1234);
        expect(loaded.click_value).toBe(5);
        expect(loaded.auto_clickers).toBe(10);
        expect(loaded.vitesse_level).toBe(2);
    });
});
