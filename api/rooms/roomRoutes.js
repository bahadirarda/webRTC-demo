const express = require('express');
const router = express.Router();
const roomController = require('./roomController'); // Room işlevlerini içe aktarın (dosya yolunu düzeltilmiş olarak kullanın)

// Odaları listele
router.get('/', roomController.getAllRooms);

// Yeni oda oluştur
router.post('/', roomController.createRoom);

// Odaya katıl
router.post('/:roomId/join', roomController.joinRoom);

// Odayı görüntüle
router.get('/:roomId', roomController.getRoomById);

module.exports = router;
