// Consultas relacionadas con el registro, inicio de sesión y verificación de usuarios.


//? Verificar si un email ya está registrado
db.users.findOne({ email: "usuario@ejemplo.com" })

//? Buscar un usuario por correo para login
db.users.findOne({ email: "usuario@ejemplo.com" })

//? Obtener todos los usuarios
db.users.find({}, { password: 0 })

//? Verificar si un Email existe 
db.users.find({ email: "correo@ejemplo.com" }).count()

//? Obtener un usuario por ID
db.users.findOne({ _id: ObjectId("ID_USUARIO") }, { password: 0 }).populate("containers")
