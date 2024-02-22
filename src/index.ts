import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/index'; // Asegúrate de crear este archivo
import authRoutes from './routers/authRoutes';

// Configura las variables de entorno
dotenv.config();

// Crea una instancia de Express
const app = express();

// Configuraciones básicas de middleware
app.use(cors());
app.use(express.json()); // Para parsing de application/json

// Conecta a la base de datos
connectDB();

//Routes
app.use('/api',authRoutes)


// Puerto de escucha para el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
