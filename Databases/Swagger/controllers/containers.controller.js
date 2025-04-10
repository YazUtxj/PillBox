import axios from 'axios';
import mongoose from 'mongoose';
import { Containers, User, DHTData } from '../models/User.js';


/**
 * @swagger
 * tags:
 * - name: Contenedores
 */

/**
 * @swagger
 * /edit-container:
 *   post:
 *     summary: Edita la información de un contenedor existente
 *     tags: [Contenedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               containerId:
 *                 type: string
 *                 description: ID del contenedor a editar
 *               name_container:
 *                 type: string
 *                 description: Nuevo nombre del contenedor
 *               init_time:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha y hora de inicio
 *               hours:
 *                 type: number
 *                 description: Número de horas
 *               days:
 *                 type: number
 *                 description: Número de días
 *     responses:
 *       200:
 *         description: Contenedor actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 container:
 *                   type: object
 *                 esp32Updated:
 *                   type: boolean
 *       400:
 *         description: ID de contenedor inválido
 *       404:
 *         description: Contenedor no encontrado
 *       500:
 *         description: Error al editar el contenedor
 */
export const editContainers = async (req, res) => {
    const { containerId, name_container, init_time, hours, days } = req.body;
    try {
        if (!mongoose.Types.ObjectId.isValid(containerId)) { return res.status(400).json({ message: "ID de contenedor inválido" }); }
        const updatedContainer = await Containers.findByIdAndUpdate(
            containerId,
            { $set: { name_container, init_time, hours, days } },
            { new: true }
        );
        if (!updatedContainer) { return res.status(404).json({ message: "Contenedor no encontrado" }); }
        const esp32Ip = "http://192.168.237.240";
        const userId = updatedContainer.owner;
        setTimeout(async () => {
            try {
                await axios.post(`${esp32Ip}/update-user`, { 
                    userId: userId,
                    containerData: {
                        containerId,
                        hours,
                        days
                    }
                }, {
                    timeout: 5000
                });
                console.log("Datos actualizados enviados a la ESP32");
            } catch (espError) {
                console.error("Error al comunicarse con la ESP32:", espError.message);
            }
        }, 0);
        res.json({ 
            message: "Contenedor actualizado", 
            container: updatedContainer,
            esp32Updated: true
        });
    } catch (error) {
        console.error("Error en editContainers:", error);
        res.status(500).json({ 
            message: "Error al editar el contenedor", 
            error: error.message 
        });
    }
};

/**
 * @swagger
 * /create-graphdata:
 *   post:
 *     summary: Crea un nuevo registro DHT para un usuario
 *     tags: [Contenedores]
 *     description: Este endpoint registra datos de temperatura y humedad vinculados a un usuario existente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - temp
 *               - humidity
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: ID del usuario al que se asocian los datos
 *               temp:
 *                 type: number
 *                 description: Valor de temperatura
 *               humidity:
 *                 type: number
 *                 description: Valor de humedad
 *     responses:
 *       201:
 *         description: Registro DHT creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Datos inválidos o incompletos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor al guardar los datos
 */
export const createDHTData = async (req, res) => {
    try {
        const { user_id, temp, humidity } = req.body;

        if (!user_id || temp === undefined || humidity === undefined) {
            return res.status(400).json({ 
                message: 'Datos incompletos',
                details: {
                    required_fields: ['user_id', 'temp', 'humidity'],
                    received: Object.keys(req.body)
                }
            });
        }

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ 
                message: 'ID de usuario no válido',
                received_id: user_id
            });
        }

        const userExists = await User.exists({ _id: user_id });
        if (!userExists) {
            return res.status(404).json({ 
                message: 'El usuario especificado no existe',
                user_id: user_id
            });
        }

        if (isNaN(temp) || isNaN(humidity)) {
            return res.status(400).json({ 
                message: 'Los valores de temperatura y humedad deben ser números',
                received: {
                    temp: typeof temp,
                    humidity: typeof humidity
                }
            });
        }

        const newDHTData = new DHTData({
            user_id,
            temp: parseFloat(temp),
            humidity: parseFloat(humidity),
            date_register: new Date()
        });

        const savedData = await newDHTData.save();
        res.status(201).json({
            message: 'Registro DHT creado exitosamente',
            data: savedData
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al crear el registro DHT',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

/**
 * @swagger
 * /get-graphdata/{id}:
 *   get:
 *     summary: Obtener registros DHT de un usuario
 *     tags: [Contenedores]
 *     description: Retorna todos los registros de temperatura y humedad asociados a un usuario, ordenados de más reciente a más antiguo.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Registros encontrados o mensaje indicando que no existen registros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 totalRecords:
 *                   type: number
 *                 records:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       temperature:
 *                         type: number
 *                       humidity:
 *                         type: number
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       formattedDate:
 *                         type: string
 *       400:
 *         description: ID de usuario no válido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor al obtener los registros
 */
export const getGraphData = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ 
                message: 'ID de usuario no válido',
                received_id: req.params.id
            });
        }

        const userExists = await User.exists({ _id: req.params.id });
        if (!userExists) {
            return res.status(404).json({ 
                message: 'El usuario especificado no existe',
                user_id: req.params.id
            });
        }

        const allDHTData = await DHTData.find({ 
            $or: [
                { user_id: req.params.id },
                { user_id: new mongoose.Types.ObjectId(req.params.id) }
            ]
        }).sort({ date_register: -1 });

        if (!allDHTData || allDHTData.length === 0) {
            return res.status(200).json({ 
                message: 'El usuario no tiene registros DHT aún',
                user_id: req.params.id,
                suggestions: [
                    'Verifique que los dispositivos estén enviando datos',
                    'Confirme que el usuario tiene dispositivos asociados'
                ],
                totalRecords: 0,
                records: []
            });
        }

        res.status(200).json({
            message: `Se encontraron ${allDHTData.length} registros`,
            user_id: req.params.id,
            totalRecords: allDHTData.length,
            records: allDHTData.map(record => ({
                id: record._id,
                temperature: record.temp,
                humidity: record.humidity,
                date: record.date_register.toISOString(),
                formattedDate: record.date_register.toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })
            }))
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener los registros DHT',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

/**
 * @swagger
 * /get-containers/{owner}:
 *   get:
 *     summary: Obtener todos los contenedores de un usuario
 *     tags: [Contenedores]
 *     description: Retorna una lista con todos los contenedores registrados por un usuario específico.
 *     parameters:
 *       - in: path
 *         name: owner
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario propietario de los contenedores
 *     responses:
 *       200:
 *         description: Lista de contenedores del usuario (puede estar vacía si no tiene ninguno)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name_container:
 *                     type: string
 *                   init_time:
 *                     type: string
 *                     format: date-time
 *                   hours:
 *                     type: number
 *                   days:
 *                     type: number
 *                   owner:
 *                     type: string
 *       400:
 *         description: ID de usuario inválido
 *       500:
 *         description: Error en la consulta al obtener los contenedores
 */
export const allUserContainers = async (req, res) => {
    try {
        const { owner } = req.params;
        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ message: "ID de usuario inválido" });
        }
        const data = await Containers.find({ owner: new mongoose.Types.ObjectId(owner) });
        res.json(data.length > 0 ? data : []);
    } catch (error) {
        res.status(500).json({ message: 'Error en la consulta', error: error.message });
    }
};
