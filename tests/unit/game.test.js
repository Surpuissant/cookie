import { describe, it, expect } from 'vitest';
import { 
    calculateClickCost, 
    calculateAutoClickerCost, 
    calculateBuildingCost, 
    calculateCPS,
    canAfford
} from '../../public/js/shared/game-logic.js';

describe('Game Logic', () => {
    describe('Click Costs', () => {
        it('should return 15 for level 1', () => {
            expect(calculateClickCost(1)).toBe(15);
        });
        it('should return 27 for level 2', () => {
            expect(calculateClickCost(2)).toBe(27);
        });
        it('should increase exponentially', () => {
            expect(calculateClickCost(5)).toBe(Math.floor(15 * Math.pow(1.8, 4)));
        });
    });

    describe('Auto-clicker Costs', () => {
        it('should return 50 for 0 units', () => {
            expect(calculateAutoClickerCost(0)).toBe(50);
        });
        it('should return 62 for 1 unit', () => {
            expect(calculateAutoClickerCost(1)).toBe(62);
        });
    });

    describe('Building Costs', () => {
        it('should keep base cost for first building', () => {
            expect(calculateBuildingCost(100, 0)).toBe(100);
        });
        it('should scale with 1.15 ratio', () => {
            expect(calculateBuildingCost(100, 1)).toBe(114);
            expect(calculateBuildingCost(100, 2)).toBe(132);
        });
    });

    describe('CPS Calculation', () => {
        it('should return 0 if no buildings', () => {
            expect(calculateCPS({
                cursor_count: 0,
                grandma_count: 0,
                farm_count: 0,
                mine_count: 0
            })).toBe(0);
        });
        it('should sum all building productions', () => {
            expect(calculateCPS({
                cursor_count: 10,
                grandma_count: 1,
                farm_count: 0,
                mine_count: 0
            })).toBe(6);
        });
        it('should include production multiplier', () => {
            expect(calculateCPS({
                cursor_count: 2,
                grandma_count: 1,
                farm_count: 1,
                mine_count: 0
            }, 2)).toBe(21.6);
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
