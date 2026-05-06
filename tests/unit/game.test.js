import { describe, it, expect } from 'vitest';
import { 
    calculateClickCost, 
    calculateAutoClickerCost, 
    calculateBuildingCost, 
    calculateSpeedCost,
    calculateCPS,
    calculateClickValue,
    canAfford
} from '../../public/js/shared/game-logic.js';
import { BUILDINGS } from '../../public/js/shared/buildings.js';

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
        it('should be non-decreasing as count grows (0..10)', () => {
            let prev = calculateAutoClickerCost(0);
            for (let i = 1; i <= 10; i++) {
                const val = calculateAutoClickerCost(i);
                expect(val).toBeGreaterThanOrEqual(prev);
                prev = val;
            }
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
        it('should handle zero base cost', () => {
            expect(calculateBuildingCost(0, 5)).toBe(0);
        });
        it('should be non-decreasing as count grows (0..10)', () => {
            let prev = calculateBuildingCost(100, 0);
            for (let i = 1; i <= 10; i++) {
                const val = calculateBuildingCost(100, i);
                expect(val).toBeGreaterThanOrEqual(prev);
                prev = val;
            }
        });
        it('should follow spec formula with floor across a range', () => {
            for (let i = 0; i <= 8; i++) {
                const expected = Math.floor(250 * Math.pow(1.15, i));
                expect(calculateBuildingCost(250, i)).toBe(expected);
            }
        });
    });

    describe('Speed Costs', () => {
        it('should return 500 for level 1', () => {
            expect(calculateSpeedCost(1)).toBe(500);
        });
        it('should return 1250 for level 2', () => {
            expect(calculateSpeedCost(2)).toBe(1250);
        });
        it('should handle level 0 (edge case)', () => {
            expect(calculateSpeedCost(0)).toBe(Math.floor(500 * Math.pow(2.5, -1)));
        });
        it('should be non-decreasing with level (1..6)', () => {
            let prev = calculateSpeedCost(1);
            for (let lvl = 2; lvl <= 6; lvl++) {
                const val = calculateSpeedCost(lvl);
                expect(val).toBeGreaterThanOrEqual(prev);
                prev = val;
            }
        });
    });

    describe('CPS Calculation', () => {
        it('should return 0 if no buildings', () => {
            expect(calculateCPS({
                cursor_count: 0,
                grandma_count: 0,
                farm_count: 0,
                mine_count: 0,
                factory_count: 0,
                bank_count: 0,
                temple_count: 0
            })).toBe(0);
        });
        it('should return 0 if buildings object is null or undefined', () => {
            expect(calculateCPS(null)).toBe(0);
            expect(calculateCPS(undefined)).toBe(0);
        });
        it('should sum all building productions', () => {
            expect(calculateCPS({
                cursor_count: 10,
                grandma_count: 1,
                farm_count: 0,
                mine_count: 0
            })).toBe(6);
        });
        it('should include new buildings in production', () => {
            expect(calculateCPS({
                cursor_count: 0,
                grandma_count: 0,
                farm_count: 0,
                mine_count: 0,
                factory_count: 1,
                bank_count: 1,
                temple_count: 1
            })).toBe(15520);
        });
        it('should include production multiplier', () => {
            expect(calculateCPS({
                cursor_count: 2,
                grandma_count: 1,
                farm_count: 1,
                mine_count: 0
            }, 2)).toBe(21.6);
        });
        it('should ignore unknown building keys gracefully', () => {
            const base = { cursor_count: 1, grandma_count: 1 };
            const withUnknown = { ...base, unknown_count: 999 };
            expect(calculateCPS(base)).toBe(calculateCPS(withUnknown));
        });
        it('should match BUILDINGS spec when all counts are 1', () => {
            const counts = Object.fromEntries(BUILDINGS.map(b => [b.key, 1]));
            const expected = BUILDINGS.reduce((sum, b) => sum + b.baseCps, 0);
            expect(calculateCPS(counts)).toBeCloseTo(expected, 10);
        });
        it('should support fractional multipliers robustly', () => {
            const counts = { cursor_count: 3, grandma_count: 2, farm_count: 1 };
            const base = 3 * 0.4 + 2 * 2 + 1 * 8; // 1.2 + 4 + 8 = 13.2
            expect(calculateCPS(counts, 1.25)).toBeCloseTo(base * 1.25, 10);
        });
    });

    describe('Click Value', () => {
        it('should return 1 for lvl 1 with no multiplier', () => {
            expect(calculateClickValue(1)).toBe(1);
        });
        it('should return 2 for lvl 1 with x2 multiplier', () => {
            expect(calculateClickValue(1, 2)).toBe(2);
        });
        it('should handle large levels', () => {
            expect(calculateClickValue(100, 1)).toBe(100);
        });
        it('should work with fractional multipliers', () => {
            expect(calculateClickValue(3, 1.5)).toBeCloseTo(4.5, 10);
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
        it('should support float comparisons', () => {
            expect(canAfford(2.0, 1.995)).toBe(true);
            expect(canAfford(1.99, 1.995)).toBe(false);
        });
    });
});
