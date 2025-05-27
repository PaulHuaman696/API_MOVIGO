// models/Vehicle.js
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  conductor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  placa: { type: String, required: true, unique: true },
  color: { type: String },
  tipo: { type: String, enum: ['auto', 'moto', 'bicicleta'], default: 'auto' },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
  fechaRegistro: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
