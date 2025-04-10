import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/auth.routes.js';

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = "mongodb+srv://db-xkis:1234@cluster0.h3sxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log("Error al conectar a MongoDB", err));

app.use('/', userRoutes);

app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));