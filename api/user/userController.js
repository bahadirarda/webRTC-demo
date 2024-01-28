const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');


exports.signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Parolayı hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı oluştur ve veritabanına kaydet
    const user = new User({ username, password: hashedPassword, email });
    await user.save();

    // Başarılı kayıt yanıtı
    res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kullanıcı kaydı başarısız oldu.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kullanıcıyı veritabanından bul
    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre.' });
      return;
    }

    // Parolayı kontrol et
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre.' });
      return;
    }

    // JWT oluştur ve yanıtla
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Oturum açma başarısız oldu.' });
  }
};
