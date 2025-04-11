import bcrypt from 'bcrypt';
import { User, Containers } from '../models/User.js';
import axios from 'axios';

export const registerUser = async (req, res) => {
  const { name, lastname, email, phone, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, lastname, email, phone, password: hashedPassword });

    const defaultContainers = [];
    for (let i = 1; i <= 4; i++) {
      const container = await Containers.create({
        name_container: `Contenedor ${i}`,
        init_time: new Date(),
        hours: 0,
        days: 0,
        owner: newUser._id
      });
      defaultContainers.push(container._id);
    }

    newUser.containers = defaultContainers;
    await newUser.save();

    await DHTData.create({
      user_id: newUser._id,
      temp: 10.0,
      humidity: 10.0
    });

    res.json({ 
      message: 'Registro exitoso', 
      userId: newUser._id 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al registrar el usuario', 
      error: error.message 
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    res.json({ message: 'Inicio de sesión exitoso', userId: user._id });
    
    const esp32Ip = "http://10.10.24.19";
    (async () => {
      try {
        await axios.post(`${esp32Ip}/update-user`, { userId: user._id });
        console.log("ID de usuario enviado a la ESP32");
      } catch (espError) {
        console.error("Error al actualizar el ID en la ESP32 (login):", espError.message);
      }
    })();

  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('containers');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ exists: true });
    }
    return res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar el correo electrónico' });
  }
};
