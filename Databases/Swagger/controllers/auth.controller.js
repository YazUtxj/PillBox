import bcrypt from 'bcrypt';
import { User, Containers } from '../models/User.js';
import axios from 'axios';

/**
 * @swagger
 * tags:
 * - name: Autenticacion
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticacion]
 *     description: Crea un nuevo usuario con contenedores por defecto y valores iniciales para datos DHT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastname
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Diego
 *               lastname:
 *                 type: string
 *                 example: Miguel
 *               email:
 *                 type: string
 *                 format: email
 *                 example: diego.miguelito@gmail.com
 *               phone:
 *                 type: string
 *                 example: "7761396262"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secretito123
 *     responses:
 *       200:
 *         description: Registro exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registro exitoso
 *                 userId:
 *                   type: string
 *                   example: 64d28fca453cfd0012345678
 *       500:
 *         description: Error al registrar el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al registrar el usuario
 *                 error:
 *                   type: string
 *                   example: El correo electrónico ya está en uso
 */
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

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión de un usuario existente
 *     tags: [Autenticacion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@ejemplo.com
 *               password:
 *                 type: string
 *                 example: contraseña123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inicio de sesión exitoso
 *                 userId:
 *                   type: string
 *                   example: 60c72b2f5f9e2c001cfb97d0
 *       400:
 *         description: Usuario no encontrado o contraseña incorrecta
 *       500:
 *         description: Error interno del servidor al intentar iniciar sesión
 */
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
    const esp32Ip = "http://192.168.43.125";
    
    setTimeout(async () => {
      try {
        await axios.post(`${esp32Ip}/update-user`, { userId: user._id });
        console.log("ID de usuario enviado a la ESP32");
      } catch (espError) {
        console.error("Error al actualizar el ID en la ESP32 (login):", espError.message);
      }
    }, 0);
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Obtiene los datos de un usuario específico por su ID
 *     tags: [Autenticacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a buscar
 *     responses:
 *       200:
 *         description: Datos del usuario encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 containers:
 *                   type: array
 *                   items:
 *                     type: object
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
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

/**
 * @swagger
 * /check-email/{email}:
 *   get:
 *     summary: Verifica si un correo electrónico ya está registrado
 *     tags: [Autenticacion]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Correo electrónico a verificar
 *     responses:
 *       200:
 *         description: Resultado de la verificación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Error al verificar el correo electrónico
 */
export const checkEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar el correo electrónico' });
  }
};

/**
 * @swagger
 * /update-user/{id}:
 *   put:
 *     summary: Actualiza los datos de un usuario
 *     tags: [Autenticacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan
 *               lastname:
 *                 type: string
 *                 example: Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan.perez@example.com
 *               phone:
 *                 type: string
 *                 example: "5551234567"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno al actualizar el usuario
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, lastname, email, phone, password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    user.name = name || user.name;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();
    res.json({ message: 'Usuario actualizado exitosamente', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
};

/**
 * @swagger
 * /delete-user/{id}:
 *   delete:
 *     summary: Elimina un usuario y sus contenedores
 *     tags: [Autenticacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno al eliminar el usuario
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await Containers.deleteMany({ owner: user._id });

    await user.remove();
    res.json({ message: 'Usuario y contenedores eliminados exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};
