const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomName: { type: String, unique: true },
  roomDescription: String,
  creatorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
