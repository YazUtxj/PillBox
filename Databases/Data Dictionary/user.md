# Colección: Users

La colección `Users` contiene los datos de los usuarios del sistema, como su nombre, correo electrónico, teléfono, y otros datos relevantes. 

## Campos

| Campo       | Tipo de Dato  | Descripción                                             | Restricciones               |
|-------------|---------------|---------------------------------------------------------|-----------------------------|
| `_id`       | `ObjectId`    | Identificador único de MongoDB.                         | Generado automáticamente     |
| `name`      | `String`      | Nombre del usuario.                                     | Requerido                   |
| `lastname`  | `String`      | Apellido del usuario.                                   | Requerido                   |
| `email`     | `String`      | Correo electrónico único del usuario.                   | Requerido, Único             |
| `phone`     | `String`      | Número de teléfono del usuario.                         | Requerido                   |
| `password`  | `String`      | Contraseña encriptada del usuario.                      | Requerido                   |
| `containers`| `Array<ObjectId>`| Lista de contenedores asociados al usuario.           | Referencia a `Containers`   |

## Relaciones

- Un **usuario** puede tener múltiples **contenedores** asociados. Esta relación está representada por el campo `containers`, que contiene una lista de `ObjectId` que se refieren a la colección `Containers`.
