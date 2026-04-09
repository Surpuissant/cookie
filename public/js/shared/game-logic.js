/**
 * Game logic shared between client and server
 */

export const calculateClickCost = (level) => {
    return Math.floor(15 * Math.pow(1.8, level - 1));
};

export const calculateAutoClickerCost = (count) => {
    return Math.floor(50 * Math.pow(1.25, count));
};

export const calculateSpeedCost = (level) => {
    return Math.floor(500 * Math.pow(2.5, level - 1));
};

export const calculateCPS = (autoClickers, vitesseLevel, multiplier = 1) => {
    if (autoClickers === 0) return 0;
    // Base production: 0.1 per unit per speed level (slower than before)
    return autoClickers * (vitesseLevel * 0.2) * multiplier;
};

export const calculateClickValue = (level, multiplier = 1) => {
    return level * multiplier;
};

export const canAfford = (cookies, cost) => {
    return cookies >= cost;
};

