// Consultas para manejar los registros de datos DHT (temperatura y humedad) y las tomas de medicamentos asociadas a los usuarios.

//? Obtener todos los registros DHT de un usuario
db.dhtdatas.find({ user_id: ObjectId("ID_USUARIO") }).sort({ date_register: -1 })

//? Promedio de Temperatura y Humedad
db.dhtdatas.aggregate([
    { $match: { user_id: ObjectId("ID_USUARIO") } },
    {
      $group: {
        _id: "$user_id",
        avgTemp: { $avg: "$temp" },
        avgHumidity: { $avg: "$humidity" }
      }
    }
])

//? Último Registro 
db.dhtdatas.find({ user_id: ObjectId("ID_USUARIO") }).sort({ date_register: -1 }).limit(1)

//? Obtener todos los registros de Toma de Medicamentos de un Usuario
db.recorddatas.aggregate([
    {
      $lookup: {
        from: "containers",
        localField: "specific_container",
        foreignField: "_id",
        as: "container_info"
      }
    },
    { $unwind: "$container_info" },
    { $match: { "container_info.owner": ObjectId("ID_USUARIO") } }
])
  