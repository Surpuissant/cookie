import { 
    calculateClickCost, 
    calculateBuildingCost, 
    calculateCPS,
    calculateClickValue,
    canAfford
} from './shared/game-logic.js';

let gameState = {
    cookies: 0,
    click_value: 1,
    cursor_count: 0,
    grandma_count: 0,
    farm_count: 0,
    mine_count: 0,
    click_multiplier: 1.0,
    production_multiplier: 1.0
};

const BUILDINGS = [
    {
        key: 'cursor_count',
        emoji: '🖱️',
        label: 'Curseur',
        description: '"Clique automatiquement toutes les 10 secondes."',
        baseCps: 0.4,
        baseCost: 15
    },
    {
        key: 'grandma_count',
        emoji: '👵',
        label: 'Grand-mère',
        description: '"Une gentille grand-mère pour cuire plus de cookies"',
        baseCps: 2,
        baseCost: 100
    },
    {
        key: 'farm_count',
        emoji: '🌾',
        label: 'Ferme',
        description: '"Fait pousser des plants de cookies à partir de graines de cookies."',
        baseCps: 8,
        baseCost: 1100
    },
    {
        key: 'mine_count',
        emoji: '⛏️',
        label: 'Mine',
        description: '"Mine de la pâte à cookies et des pépites de chocolat."',
        baseCps: 47,
        baseCost: 12000
    }
];

const UI = {
    cookieCount: document.getElementById('cookie-count'),
    cpsDisplay: document.getElementById('cps-display'),
    mobileCookieCount: document.getElementById('mobile-cookie-count'),
    mobileCpsDisplay: document.getElementById('mobile-cps-display'),
    mainCookie: document.getElementById('main-cookie'),
    clickLevel: document.getElementById('click-level'),
    clickCost: document.getElementById('click-cost'),
    buyClick: document.getElementById('buy-click'),
    buyClickMult: document.getElementById('buy-click-mult'),
    buyProdMult: document.getElementById('buy-prod-mult'),
    clickableUpgradeCards: document.querySelectorAll('.icon-upgrade-card'),
    clickMultCost: document.getElementById('click-mult-cost'),
    prodMultCost: document.getElementById('prod-mult-cost'),
    cursorContainer: document.getElementById('cursor-container'),
    totalBuildings: document.getElementById('total-buildings'),
    totalUpgrades: document.getElementById('total-upgrades'),
    buildingsFill: document.getElementById('buildings-fill'),
    upgradesFill: document.getElementById('upgrades-fill'),
    prestigeBadge: document.getElementById('prestige-badge'),
    buildingVisualCards: BUILDINGS.map((building) => ({
        key: building.key,
        card: document.getElementById(`visual-${building.key}`)
    })),
    buildingCards: BUILDINGS.map((building) => ({
        ...building,
        info: document.getElementById(`building-${building.key}`),
        buyButton: document.getElementById(`buy-${building.key}`)
    }))
};

const animatePurchase = (element) => {
    if (!element) return;
    element.classList.remove('purchased');
    void element.offsetWidth;
    element.classList.add('purchased');
};

// Costs logic
const getClickCost = () => calculateClickCost(gameState.click_value);
const getClickMultCost = () => 500 * Math.pow(5, (gameState.click_multiplier - 1));
const getProdMultCost = () => 1000 * Math.pow(5, (gameState.production_multiplier - 1));
const getBuildingCost = (building) => calculateBuildingCost(building.baseCost, gameState[building.key]);
const getCPS = () => calculateCPS(gameState, gameState.production_multiplier);
const getClickVal = () => calculateClickValue(gameState.click_value, gameState.click_multiplier);
const formatCount = (n) => Math.floor(n).toLocaleString();

const getTotalBuildings = () => BUILDINGS.reduce((sum, building) => sum + gameState[building.key], 0);

const getTotalUpgrades = () => {
    const clickBoosts = gameState.click_value - 1;
    const clickMultBoosts = Math.log2(gameState.click_multiplier);
    const prodMultBoosts = Math.log2(gameState.production_multiplier);
    return clickBoosts + clickMultBoosts + prodMultBoosts;
};

const getPrestigeLabel = (totalBuildings, totalUpgrades) => {
    const score = totalBuildings + totalUpgrades * 2;
    if (score >= 150) return '🍪 Légende Sucrée';
    if (score >= 80) return '👑 Baron du Cookie';
    if (score >= 30) return '⚙️ Artisan';
    if (score >= 10) return '🌱 Apprenti';
    return '🥄 Débutant';
};

const updateCursors = () => {
    UI.cursorContainer.innerHTML = '';
    const count = gameState.cursor_count;
    const radius = 180;
    
    for (let i = 0; i < count; i++) {
        const cursor = document.createElement('div');
        cursor.className = 'orbiting-cursor';
        
        const angle = (i / count) * 2 * Math.PI;
        const x = Math.cos(angle) * radius + 225 - 16; 
        const y = Math.sin(angle) * radius + 225 - 16;
        
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
        
        const rotation = (angle * 180 / Math.PI) - 90;
        const rotStr = `rotate(${rotation}deg)`;
        cursor.style.transform = rotStr;
        cursor.style.setProperty('--orig-rot', rotStr);
        
        UI.cursorContainer.appendChild(cursor);
    }
};

const spawnFloatingNumber = (x, y, value) => {
    const el = document.createElement('div');
    el.className = 'floating-number';
    el.innerText = `+${Math.floor(value)}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    const ox = (Math.random() * 40 - 20);
    el.style.marginLeft = `${ox}px`;
    document.querySelector('.cookie-panel').appendChild(el);
    setTimeout(() => el.remove(), 1000);
};

const spawnParticle = (x, y) => {
    const particle = document.createElement('div');
    particle.className = 'cookie-particle';
    const cookieNum = Math.floor(Math.random() * 8) + 1;
    particle.style.backgroundImage = `url('/images/Particles/cookie${cookieNum}.png')`;
    const angle = Math.random() * Math.PI * 2;
    const dist = 100 + Math.random() * 150;
    particle.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    particle.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    particle.style.setProperty('--tr', (Math.random() * 360 - 180) + 'deg');
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    document.querySelector('.cookie-panel').appendChild(particle);
    setTimeout(() => particle.remove(), 800);
};

const spawnBackgroundCookie = () => {
    const particle = document.createElement('div');
    particle.className = 'cookie-rain-particle';
    const cookieNum = Math.floor(Math.random() * 8) + 1;
    particle.style.backgroundImage = `url('/images/Particles/cookie${cookieNum}.png')`;
    particle.style.left = Math.random() * 100 + '%';
    document.querySelector('.cookie-panel').appendChild(particle);
    setTimeout(() => particle.remove(), 2000);
};

const updateUI = () => {
    const cps = getCPS();
    UI.cookieCount.innerText = formatCount(gameState.cookies);
    UI.cpsDisplay.innerText = `par seconde : ${cps.toFixed(1)}`;
    UI.mobileCookieCount.innerText = formatCount(gameState.cookies);
    UI.mobileCpsDisplay.innerText = `par seconde : ${cps.toFixed(1)}`;
    
    // Update multipliers info
    UI.clickMultCost.innerText = getClickMultCost();
    UI.prodMultCost.innerText = getProdMultCost();

    // Update click info
    const clickCost = getClickCost();
    UI.clickLevel.innerText = gameState.click_value;
    UI.clickCost.innerText = clickCost;

    UI.buildingCards.forEach((building) => {
        const count = gameState[building.key];
        const cost = getBuildingCost(building);
        const totalProduction = count * building.baseCps * gameState.production_multiplier;
        building.info.innerHTML = `
            <h4>${building.emoji} ${building.label}</h4>
            <p>${building.description}</p>
            <p>• chaque ${building.label.toLowerCase()} produit ${building.baseCps} cookies par seconde</p>
            <p>• vous en avez ${count} pour ${totalProduction.toFixed(1)} cps</p>
            <p>Coût : ${formatCount(cost)} 🍪</p>
        `;
        building.buyButton.disabled = !canAfford(gameState.cookies, cost);
    });

    const totalBuildings = getTotalBuildings();
    const totalUpgrades = getTotalUpgrades();
    UI.totalBuildings.innerText = formatCount(totalBuildings);
    UI.totalUpgrades.innerText = formatCount(totalUpgrades);
    UI.buildingsFill.style.width = `${Math.min(100, (totalBuildings / 200) * 100)}%`;
    UI.upgradesFill.style.width = `${Math.min(100, (totalUpgrades / 80) * 100)}%`;
    UI.prestigeBadge.innerText = getPrestigeLabel(totalBuildings, totalUpgrades);
    UI.buildingVisualCards.forEach((visual) => {
        const count = gameState[visual.key];
        visual.card.querySelector('.building-count').innerText = formatCount(count);
        visual.card.classList.toggle('owned', count > 0);
    });
    
    UI.buyClick.disabled = !canAfford(gameState.cookies, clickCost);
    UI.buyClickMult.disabled = !canAfford(gameState.cookies, getClickMultCost());
    UI.buyProdMult.disabled = !canAfford(gameState.cookies, getProdMultCost());
    UI.clickableUpgradeCards.forEach((card) => {
        const buyTarget = card.dataset.buyTarget;
        const button = document.getElementById(buyTarget);
        card.classList.toggle('disabled-card', button.disabled);
    });
    
    updateCursors();
};

const clickCookie = (e) => {
    const val = getClickVal();
    gameState.cookies += val;
    updateUI();
    
    UI.mainCookie.classList.remove('clicked');
    void UI.mainCookie.offsetWidth;
    UI.mainCookie.classList.add('clicked');

    const panelRect = document.querySelector('.cookie-panel').getBoundingClientRect();
    const x = e ? (e.clientX - panelRect.left) : 225;
    const y = e ? (e.clientY - panelRect.top) : 225;
    
    spawnFloatingNumber(x, y, val);
    spawnBackgroundCookie();
    
    for (let i = 0; i < 5; i++) {
        spawnParticle(x, y);
    }
};

UI.mainCookie.addEventListener('click', clickCookie);

UI.clickableUpgradeCards.forEach((card) => {
    const triggerBuy = () => {
        const buyTarget = card.dataset.buyTarget;
        const button = document.getElementById(buyTarget);
        if (!button.disabled) {
            button.click();
        }
    };

    card.addEventListener('click', triggerBuy);
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerBuy();
        }
    });
});

const saveGame = async () => {
    try {
        await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameState)
        });
    } catch (err) {
        console.error('Failed to save game', err);
    }
};

// Interaction Listeners
UI.buyClick.addEventListener('click', () => {
    const cost = getClickCost();
    if (canAfford(gameState.cookies, cost)) {
        gameState.cookies -= cost;
        gameState.click_value += 1;
        animatePurchase(document.getElementById('upgrade-click'));
        updateUI();
        saveGame();
    }
});

UI.buildingCards.forEach((building) => {
    building.buyButton.addEventListener('click', () => {
        const cost = getBuildingCost(building);
        if (canAfford(gameState.cookies, cost)) {
            gameState.cookies -= cost;
            gameState[building.key] += 1;
            animatePurchase(building.buyButton.closest('.upgrade-item'));
            updateUI();
            saveGame();
        }
    });
});

UI.buyClickMult.addEventListener('click', () => {
    const cost = getClickMultCost();
    if (canAfford(gameState.cookies, cost)) {
        gameState.cookies -= cost;
        gameState.click_multiplier *= 2;
        animatePurchase(document.getElementById('upgrade-click-mult'));
        updateUI();
        saveGame();
    }
});

UI.buyProdMult.addEventListener('click', () => {
    const cost = getProdMultCost();
    if (canAfford(gameState.cookies, cost)) {
        gameState.cookies -= cost;
        gameState.production_multiplier *= 2;
        animatePurchase(document.getElementById('upgrade-prod-mult'));
        updateUI();
        saveGame();
    }
});

// Game Loop
let tickCount = 0;
setInterval(() => {
    const cps = getCPS();
    if (cps > 0) {
        gameState.cookies += cps / 10;
        updateUI();
        
        tickCount++;
        if (tickCount >= 10) {
            UI.mainCookie.classList.remove('pulse');
            void UI.mainCookie.offsetWidth;
            UI.mainCookie.classList.add('pulse');
            
            // Visual rain for auto-clicks
            spawnBackgroundCookie();
            
            // Animate cursors
            document.querySelectorAll('.orbiting-cursor').forEach(c => {
                c.classList.remove('clicking');
                void c.offsetWidth;
                c.classList.add('clicking');
            });
            
            tickCount = 0;
        }
    }
}, 100);

// Initial Load
fetch('/api/game-state')
    .then(res => res.json())
    .then(data => {
        if (data) {
            gameState = {
                ...gameState,
                ...data
            };
        }
        updateUI();
    });

