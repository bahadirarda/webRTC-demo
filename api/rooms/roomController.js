const Room = require('../../models/room');


// Odaları listele
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Odaları getirme işlemi başarısız oldu.' });
  }
};

// Yeni oda oluştur
exports.createRoom = async (req, res) => {
  const { name, description } = req.body;

  try {
    const room = await Room.create({ name, description });
    res.status(201).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Oda oluşturma işlemi başarısız oldu.' });
  }
};

// Odaya katıl
exports.joinRoom = async (req, res) => {
  const roomId = req.params.roomId; // roomId'yi isteğin parametrelerinden alın

  try {
    // İlgili odayı veritabanından bulun
    const room = await Room.findById(roomId);

    if (!room) {
      res.status(404).json({ error: 'Oda bulunamadı.' });
      return;
    }
    // Başarılı katılma yanıtı
    res.status(200).json({ message: 'Odaya katılma başarılı.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Odaya katılma işlemi başarısız oldu.' });
  }
};

// Odayı görüntüle
exports.getRoomById = async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404).json({ error: 'Oda bulunamadı.' });
    } else {
      res.status(200).json(room);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Oda getirme işlemi başarısız oldu.' });
  }
};
