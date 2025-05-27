const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Aquí guardamos los códigos temporales (en producción usa BD o caché Redis)
const verificationCodes = new Map();

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Aquí podrías agregar lógica para encriptar la contraseña si se actualiza
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const JWT_SECRET = process.env.JWT_SECRET || 'MiClaveSuperSecreta123!@#';

exports.registerUser = async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    // Validar que no exista usuario con ese email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email ya registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nombre,
      email,
      password: hashedPassword,
      telefono,
      rol: 'pasajero', // o según lo que quieras asignar
    });

    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Email o contraseña incorrectos' });

    // Comparar password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Email o contraseña incorrectos' });

    // Crear token JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user._id, nombre: user.nombre, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Enviar código SMS
exports.sendCode = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Número telefónico requerido' });

  // Generar código 6 dígitos
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Enviar SMS
    await client.messages.create({
      body: `Tu código de verificación es: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    // Guardar código para verificar luego (con expiración)
    verificationCodes.set(phone, code);
    setTimeout(() => verificationCodes.delete(phone), 5 * 60 * 1000); // 5 minutos

    res.json({ message: 'Código enviado' });
  } catch (error) {
    console.error('Error enviando SMS:', error);
    res.status(500).json({ error: 'No se pudo enviar el código' });
  }
};

// Verificar código SMS
exports.verifyCode = (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).json({ error: 'Número y código requeridos' });

  const validCode = verificationCodes.get(phone);
  if (validCode === code) {
    verificationCodes.delete(phone); // Código consumido
    res.json({ message: 'Código verificado correctamente' });
  } else {
    res.status(400).json({ error: 'Código incorrecto o expirado' });
  }
};
