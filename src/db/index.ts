import mongoose from 'mongoose';

const dbUri = process.env.NODE_ENV === 'production' ? process.env.DB_URI_PROD : process.env.DB_URI_DEV;

const connectDB = async () => {
    if (!dbUri) {
        console.error('La URI de la base de datos no está definida.');
        process.exit(1);
    }
    try {
        await mongoose.connect(dbUri);
        console.log('Conexión a la base de datos exitosa');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};

export default connectDB;
