const express = require('express');
const router = express.Router();
const path = require('path'); // path modülünü içeri aktarın (dosya yollarını işlemek için)
const User = require('../models/user'); // Kullanıcı modelini içe aktarın (yolunu projenize göre ayarlayın)



// Oturum kontrolü için middleware
function authMiddleware(req, res, next) {
    if (!req.session.user) {
        // Kullanıcı oturumu açmamışsa, giriş sayfasına yönlendir
        return res.redirect('/login');
    }
    // Kullanıcı oturumu açmışsa, sonraki işlemlere devam et
    next();
}

// Giriş sayfasını görüntüle
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

// Kayıt sayfasını görüntüle
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/signup.html'));
});

// Index sayfasını görüntüleme rotası ve oturum kontrolü ekleyin
router.get('/index', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Oturum açma işlemi
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });
        if (!user) {
            res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre.' });
        } else {
            // Kullanıcı oturumu açıldığında oturum bilgisini kaydet
            req.session.user = user;
            res.redirect('/index');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Oturum açma başarısız oldu.' });
    }
});

// Kayıt işlemi
router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
  
    try {
      const user = await User.create({ username, password, email });
      res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi.' }); // Başarılı kayıt durumu ve başarılı mesajı JSON olarak gönderiliyor.
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Kullanıcı kaydı başarısız oldu.' }); // Hata durumu ve hata mesajı JSON olarak gönderiliyor.
    }
  });
  
module.exports = router;
