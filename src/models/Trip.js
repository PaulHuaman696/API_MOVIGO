// models/Trip.js
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  usuarioPasajero: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  usuarioConductor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  origen: {
    lat: Number,
    lng: Number,
    direccion: String,
  },
  destino: {
    lat: Number,
    lng: Number,
    direccion: String,
  },
  estado: { type: String, enum: ['pendiente', 'en_curso', 'finalizado', 'cancelado'], default: 'pendiente' },
  costoEstimado: Number,
  costoFinal: Number,
  fechaSolicitud: { type: Date, default: Date.now },
  fechaInicio: Date,
  fechaFin: Date,
});

module.exports = mongoose.model('Trip', tripSchema);
