// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['pasajero', 'conductor', 'admin'], default: 'pasajero' },
  telefono: { type: String },
  fotoPerfil: { type: String },
  estado: { type: String, default: 'activo' },
  fechaRegistro: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
