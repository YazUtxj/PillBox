// Consultas que gestionan los contenedores de medicamentos (editar, eliminar, obtener).

//? Obtener todos los contenedores de un usuario
db.containers.find({ owner: ObjectId("ID_USUARIO") })

//? Editar un contenedor en específico 
db.containers.updateOne(
    { _id: ObjectId("ID_DEL_CONTENEDOR") },
    { $set: { name_container: "Nuevo nombre", hours: 6, days: 2 } }
)

//? Vercontenedores con horarios configurados
db.containers.find({ $or: [{ hours: { $gt: 0 } }, { days: { $gt: 0 } }] })

//? Eliminar contenedores de Prueba
db.containers.deleteMany({ name_container: /prueba/i })

//? Validar contenedores sin usuario
db.containers.find({ owner: { $exists: false } })



