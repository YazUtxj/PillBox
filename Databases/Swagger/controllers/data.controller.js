import { RecordData, Containers, User } from "../backend_swagger/models/User.js";
import mongoose from "mongoose";

/**
 * @swagger
 * tags:
 * - name: Data
 */

/**
 * @swagger
 * /get-data/{id}:
 *   get:
 *     summary: Obtener los registros de un usuario filtrados por el contenedor
 *     tags: [Data]
 *     description: Este endpoint devuelve todos los registros asociados a los contenedores de un usuario.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario para obtener sus registros
 *     responses:
 *       200:
 *         description: Lista de registros del usuario, filtrados por contenedor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   specific_container:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name_container:
 *                         type: string
 *                   other_field_1:
 *                     type: string
 *                   other_field_2:
 *                     type: string
 *       404:
 *         description: No se encontraron registros o usuario no encontrado
 *       500:
 *         description: Error al obtener los registros
 */
export const getRecordsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const records = await RecordData.find()
      .populate({
        path: 'specific_container',
        match: { owner: userId },
      });

    const filteredRecords = records.filter(record => record.specific_container !== null);

    if (filteredRecords.length === 0) {
      return res.status(404).json({ message: 'No se encontraron registros para este usuario' });
    }

    res.json(filteredRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /create-data:
 *   post:
 *     summary: Crear un nuevo registro para un contenedor
 *     tags: [Data]
 *     description: Este endpoint permite crear un nuevo registro de actividad o estado asociado a un contenedor específico.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specific_container:
 *                 type: string
 *                 description: El ID del contenedor específico al que se asociará el registro.
 *                 example: "60b8f0b9a0b1c3e1d2e3f4a5"
 *               taken:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Registro creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     specific_container:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name_container:
 *                           type: string
 *                         init_time:
 *                           type: string
 *                         owner:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             lastname:
 *                               type: string
 *                             email:
 *                               type: string
 *       400:
 *         description: Datos inválidos, ID de contenedor incorrecto o falta de campos obligatorios
 *       404:
 *         description: Contenedor no encontrado
 *       500:
 *         description: Error interno del servidor
 */
export const createRecord = async (req, res) => {
  try {
    const { specific_container, taken = false } = req.body;

    if (!specific_container || taken === undefined) {
      return res.status(400).json({
        success: false,
        error: 'El campo specific_container es obligatorio'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(specific_container)) {
      return res.status(400).json({
        success: false,
        error: 'ID de contenedor no válido'
      });
    }

    const container = await Containers.findById(specific_container)
      .populate('owner', '_id name lastname');

    if (!container) {
      return res.status(404).json({
        success: false,
        error: 'Contenedor no encontrado'
      });
    }

    const newRecord = new RecordData({
      specific_container,
      taken,
    });

    await newRecord.save();

    const populatedRecord = await RecordData.findById(newRecord._id)
      .populate({
        path: 'specific_container',
        select: 'name_container init_time',
        populate: {
          path: 'owner',
          select: 'name lastname email'
        }
      });

    res.status(201).json({
      success: true,
      data: {
        ...populatedRecord.toObject(),
        user_id: populatedRecord.specific_container.owner
      },
      message: 'Registro creado exitosamente'
    });

  } catch (error) {
    console.error('Error en createRecord:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};