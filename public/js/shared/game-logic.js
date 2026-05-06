/**
 * Game logic shared between client and server
 */

import { BUILDINGS } from './buildings.js';

export const calculateClickCost = (level) => {
    return Math.floor(15 * Math.pow(1.8, level - 1));
};

export const calculateAutoClickerCost = (count) => {
    return Math.floor(50 * Math.pow(1.25, count));
};

export const calculateBuildingCost = (baseCost, count) => {
    return Math.floor(baseCost * Math.pow(1.15, count));
};

export const calculateSpeedCost = (level) => {
    return Math.floor(500 * Math.pow(2.5, level - 1));
};

export const calculateCPS = (buildings, multiplier = 1) => {
    if (!buildings) return 0;

    const baseTotal = BUILDINGS.reduce((sum, building) => {
        const count = buildings[building.key] || 0;
        return sum + count * building.baseCps;
    }, 0);

    return baseTotal * multiplier;
};

export const calculateClickValue = (level, multiplier = 1) => {
    return level * multiplier;
};

export const canAfford = (cookies, cost) => {
    return cookies >= cost;
};

