import { describe, it, expect, beforeEach } from 'vitest';
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
            cursor_count: 10,
            grandma_count: 3,
            farm_count: 2,
            mine_count: 1,
            click_multiplier: 2,
            production_multiplier: 2
        };

        dbManager.saveGameState(userId, newState);
        const loaded = dbManager.getGameState(userId);

        expect(loaded.cookies).toBe(1234);
        expect(loaded.click_value).toBe(5);
        expect(loaded.cursor_count).toBe(10);
        expect(loaded.grandma_count).toBe(3);
        expect(loaded.farm_count).toBe(2);
        expect(loaded.mine_count).toBe(1);
        expect(loaded.click_multiplier).toBe(2);
        expect(loaded.production_multiplier).toBe(2);
    });
});
