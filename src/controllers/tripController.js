const Trip = require('../models/Trip');

exports.createTrip = async (req, res) => {
  try {
    const trip = new Trip(req.body);
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('usuarioConductor', 'name email')
      .populate('usuarioPasajero', 'name email')
      // .populate('vehiculo')
      // .populate('calificaciones');
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('usuarioConductor', 'name email')
      .populate('usuarioPasajero', 'name email')
      // .populate('vehiculo')
      // .populate('calificaciones');
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json({ message: 'Trip deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
