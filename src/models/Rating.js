// models/Rating.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  viaje: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  usuarioCalificador: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  usuarioCalificado: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  puntuacion: { type: Number, min: 1, max: 5, required: true },
  comentario: { type: String },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Rating', ratingSchema);
