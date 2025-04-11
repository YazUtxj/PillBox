import { RecordData, Containers, User } from "../models/User.js";
import mongoose from "mongoose";


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