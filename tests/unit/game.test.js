import { describe, it, expect } from 'vitest';
import { 
    calculateClickCost, 
    calculateAutoClickerCost, 
    calculateSpeedCost, 
    calculateCPS,
    canAfford
} from '../../public/js/shared/game-logic.js';

describe('Game Logic', () => {
    describe('Click Costs', () => {
        it('should return 10 for level 1', () => {
            expect(calculateClickCost(1)).toBe(10);
        });
        it('should return 15 for level 2', () => {
            expect(calculateClickCost(2)).toBe(15);
        });
        it('should increase exponentially', () => {
            expect(calculateClickCost(5)).toBe(Math.floor(10 * Math.pow(1.5, 4)));
        });
    });

    describe('Auto-clicker Costs', () => {
        it('should return 50 for 0 units', () => {
            expect(calculateAutoClickerCost(0)).toBe(50);
        });
        it('should return 65 for 1 unit', () => {
            expect(calculateAutoClickerCost(1)).toBe(65);
        });
    });

    describe('Speed Costs', () => {
        it('should return 100 for level 1', () => {
            expect(calculateSpeedCost(1)).toBe(100);
        });
        it('should double for each level', () => {
            expect(calculateSpeedCost(2)).toBe(200);
            expect(calculateSpeedCost(3)).toBe(400);
        });
    });

    describe('CPS Calculation', () => {
        it('should return 0 if no auto-clickers', () => {
            expect(calculateCPS(0, 10)).toBe(0);
        });
        it('should return auto-clickers * speed', () => {
            expect(calculateCPS(10, 2)).toBe(20);
            expect(calculateCPS(5, 5)).toBe(25);
        });
    });

    describe('canAfford Utility', () => {
        it('should return true if enough cookies', () => {
            expect(canAfford(100, 50)).toBe(true);
            expect(canAfford(50, 50)).toBe(true);
        });
        it('should return false if not enough cookies', () => {
            expect(canAfford(49, 50)).toBe(false);
            expect(canAfford(0, 10)).toBe(false);
        });
    });
});
