import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { 
    verifyUser, 
    createUser, 
    getGameState, 
    saveGameState 
} from './db-manager.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';
const SESSION_SECRET = process.env.SESSION_SECRET || 'cookie-secret-dev';

const colors = {
    reset: '\x1b[0m',
    gray: '\x1b[90m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

const getStatusColor = (status) => {
    if (status >= 500) return colors.red;
    if (status >= 400) return colors.yellow;
    if (status >= 300) return colors.cyan;
    return colors.green;
};

const STATIC_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.css', '.js', '.map', '.svg'];

const shouldLogRequest = (req, statusCode, elapsedMs) => {
    const pathname = req.path || '';
    const isApiOrPage =
        pathname === '/' ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/register') ||
        pathname.startsWith('/logout');

    const isStatic = STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext));
    const isSlow = elapsedMs >= 150;
    const isError = statusCode >= 400;

    if (isError || isSlow || isApiOrPage) {
        return true;
    }

    // Evite le spam de logs des assets (ex: /images/Particles/*.png en 304)
    return !isStatic;
};

app.use((req, res, next) => {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000;
        if (!shouldLogRequest(req, res.statusCode, elapsedMs)) {
            return;
        }
        const statusColor = getStatusColor(res.statusCode);
        const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
        console.log(
            `${colors.gray}[${now}]${colors.reset} ` +
            `${colors.cyan}${req.method}${colors.reset} ${req.originalUrl} ` +
            `${statusColor}${res.statusCode}${colors.reset} ` +
            `${colors.gray}${elapsedMs.toFixed(1)}ms${colors.reset}`
        );
    });
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '../../views'));

app.use(express.static(path.resolve(__dirname, '../../public'), {
    etag: true,
    lastModified: true,
    maxAge: isDev ? 0 : '7d',
    setHeaders: (res, filePath) => {
        // Cache agressif pour les assets versionnés/stables
        if (/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js)$/i.test(filePath)) {
            if (isDev) {
                res.setHeader('Cache-Control', 'no-cache');
            } else {
                res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
            }
        }
    }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Routes
app.get('/', (req, res) => {
    if (req.session.userId) {
        return res.render('index', { user: req.session.username });
    }
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = verifyUser(username, password);
    if (user) {
        req.session.userId = user.id;
        req.session.username = user.username;
        if (isDev) {
            console.log(`${colors.green}[auth] login success${colors.reset} user=${user.username}`);
        }
        res.redirect('/');
    } else {
        if (isDev) {
            console.log(`${colors.yellow}[auth] login failed${colors.reset} user=${username}`);
        }
        res.render('login', { error: 'Identifiants invalides' });
    }
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    try {
        const userId = createUser(username, password);
        req.session.userId = userId;
        req.session.username = username;
        if (isDev) {
            console.log(`${colors.green}[auth] register success${colors.reset} user=${username}`);
        }
        res.redirect('/');
    } catch {
        if (isDev) {
            console.log(`${colors.yellow}[auth] register failed${colors.reset} user=${username}`);
        }
        res.render('register', { error: 'Utilisateur déjà existant' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// API Routes for game state
app.get('/api/game-state', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Non authentifié' });
    const state = getGameState(req.session.userId);
    res.json(state);
});

app.post('/api/save', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Non authentifié' });
    saveGameState(req.session.userId, req.body);
    res.json({ success: true });
});

app.use((err, req, res, next) => {
    console.error(`${colors.red}[error]${colors.reset}`, err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
  console.log(`${colors.green}Server running${colors.reset} on http://localhost:${PORT}`);
  if (isDev) {
      console.log(`${colors.gray}[dev] nodemon reload actif (server + views + public)${colors.reset}`);
  }
});
