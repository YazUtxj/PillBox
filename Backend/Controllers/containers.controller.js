import axios from 'axios';
import mongoose from 'mongoose';
import { Containers, User, DHTData } from '../models/User.js';

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
        const esp32Ip = "http://10.10.24.19";
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
