const express = require('express');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const roomRoutes = require('./api/rooms/roomRoutes');

dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const secretKey = process.env.SECRET_KEY; 
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false
}));

// Oturum kontrolü için middleware
function authMiddleware(req, res, next) {
    if (!req.session || !req.session.user) {
        // Kullanıcı oturum açmamışsa, giriş sayfasına yönlendir
        return res.redirect('/login');
    }
    // Kullanıcı oturum açmışsa, sonraki işlemlere devam et
    next();
}

// Auth rotaları
app.use('/', authRoutes);

// Oturum kontrolü uygulanan rotalar
app.use('/index', authMiddleware);
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use('/room/:id', authMiddleware);
app.get('/room/:id', (req, res) => {
    const roomId = req.params.id;
    res.sendFile(path.join(__dirname, 'views', 'room.html'));
});

app.use('/api/rooms', roomRoutes);

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost/webRTC', {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB bağlantı hatası:'));
db.once('open', () => {
    console.log('MongoDB bağlandı');
});

// Ana sayfa için oturum kontrolü
app.get('/', authMiddleware, (req, res) => {
    // Kullanıcı oturumu açmışsa, ana sayfayı görüntüle
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Sunucuyu dinlemeye başlayın
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor`);
});
