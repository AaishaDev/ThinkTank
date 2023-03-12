const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isFavorite :{
    type : Boolean,
    default :false
  }
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
