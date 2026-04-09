import { 
    calculateClickCost, 
    calculateAutoClickerCost, 
    calculateSpeedCost, 
    calculateCPS,
    calculateClickValue,
    canAfford
} from './shared/game-logic.js';

let gameState = {
    cookies: 0,
    click_value: 1,
    auto_clickers: 0,
    vitesse_level: 1,
    click_multiplier: 1.0,
    auto_multiplier: 1.0
};

const UI = {
    cookieCount: document.getElementById('cookie-count'),
    cpsDisplay: document.getElementById('cps-display'),
    mainCookie: document.getElementById('main-cookie'),
    clickLevel: document.getElementById('click-level'),
    clickCost: document.getElementById('click-cost'),
    autoCount: document.getElementById('auto-count'),
    autoCost: document.getElementById('auto-cost'),
    speedLevel: document.getElementById('speed-level'),
    speedCost: document.getElementById('speed-cost'),
    buyClick: document.getElementById('buy-click'),
    buyAuto: document.getElementById('buy-auto'),
    buySpeed: document.getElementById('buy-speed'),
    buyClickMult: document.getElementById('buy-click-mult'),
    buyAutoMult: document.getElementById('buy-auto-mult'),
    clickMultCost: document.getElementById('click-mult-cost'),
    autoMultCost: document.getElementById('auto-mult-cost'),
    cursorContainer: document.getElementById('cursor-container')
};

// Costs logic
const getClickCost = () => calculateClickCost(gameState.click_value);
const getAutoCost = () => calculateAutoClickerCost(gameState.auto_clickers);
const getSpeedCost = () => calculateSpeedCost(gameState.vitesse_level);
const getClickMultCost = () => 500 * Math.pow(5, (gameState.click_multiplier - 1));
const getAutoMultCost = () => 1000 * Math.pow(5, (gameState.auto_multiplier - 1));

const getCPS = () => calculateCPS(gameState.auto_clickers, gameState.vitesse_level, gameState.auto_multiplier);
const getClickVal = () => calculateClickValue(gameState.click_value, gameState.click_multiplier);

const updateCursors = () => {
    UI.cursorContainer.innerHTML = '';
    const count = gameState.auto_clickers;
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
    UI.cookieCount.innerText = Math.floor(gameState.cookies).toLocaleString();
    UI.cpsDisplay.innerText = `par seconde : ${cps.toFixed(1)}`;
    
    // Update Multipliers info
    UI.clickMultCost.innerText = getClickMultCost();
    UI.autoMultCost.innerText = getAutoMultCost();

    // Update Click info
    const clickCost = getClickCost();
    UI.clickLevel.innerText = gameState.click_value;
    UI.clickCost.innerText = clickCost;
    
    // Update Auto info
    const autoCost = getAutoCost();
    const prodPerAuto = gameState.vitesse_level * 0.2 * gameState.auto_multiplier;
    const totalAutoProd = gameState.auto_clickers * prodPerAuto;
    
    document.getElementById('upgrade-auto').querySelector('.upgrade-info').innerHTML = `
        <h4>Curseur</h4>
        <p>"Clique automatiquement pour vous."</p>
        <p>• chaque unité produit ${prodPerAuto.toFixed(1)}/s</p>
        <p>• ${gameState.auto_clickers} unités produisant ${totalAutoProd.toFixed(1)}/s</p>
        <p>Coût : ${autoCost} 🍪</p>
    `;

    // Update Speed info
    const speedCost = getSpeedCost();
    document.getElementById('upgrade-speed').querySelector('.upgrade-info').innerHTML = `
        <h4>Réveil Matin (Lvl ${gameState.vitesse_level})</h4>
        <p>"Motive vos curseurs à cliquer plus vite."</p>
        <p>Coût : ${speedCost} 🍪</p>
    `;
    
    UI.buyClick.disabled = !canAfford(gameState.cookies, clickCost);
    UI.buyAuto.disabled = !canAfford(gameState.cookies, autoCost);
    UI.buySpeed.disabled = !canAfford(gameState.cookies, speedCost);
    UI.buyClickMult.disabled = !canAfford(gameState.cookies, getClickMultCost());
    UI.buyAutoMult.disabled = !canAfford(gameState.cookies, getAutoMultCost());
    
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
        updateUI();
        saveGame();
    }
});

UI.buyAuto.addEventListener('click', () => {
    const cost = getAutoCost();
    if (canAfford(gameState.cookies, cost)) {
        gameState.cookies -= cost;
        gameState.auto_clickers += 1;
        updateUI();
        saveGame();
    }
});

UI.buySpeed.addEventListener('click', () => {
    const cost = getSpeedCost();
    if (canAfford(gameState.cookies, cost)) {
        gameState.cookies -= cost;
        gameState.vitesse_level += 1;
        updateUI();
        saveGame();
    }
});

UI.buyClickMult.addEventListener('click', () => {
    const cost = getClickMultCost();
    if (canAfford(gameState.cookies, cost)) {
        gameState.cookies -= cost;
        gameState.click_multiplier *= 2;
        updateUI();
        saveGame();
    }
});

UI.buyAutoMult.addEventListener('click', () => {
    const cost = getAutoMultCost();
    if (canAfford(gameState.cookies, cost)) {
        gameState.cookies -= cost;
        gameState.auto_multiplier *= 2;
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
        if (data) gameState = { ...gameState, ...data };
        updateUI();
    });

