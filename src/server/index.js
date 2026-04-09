import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
    verifyUser, 
    createUser, 
    getGameState, 
    saveGameState 
} from './db-manager.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '../../views'));

app.use(express.static(path.resolve(__dirname, '../../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'cookie-secret',
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
        res.redirect('/');
    } else {
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
        res.redirect('/');
    } catch {
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


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
