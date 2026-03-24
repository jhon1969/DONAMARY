import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Ruta principal de prueba
app.get('/', (req, res) => {
  res.json({ message: "Backend de DONAMARY funcionando ✅" });
});

// Ruta para recibir el formulario (aquí irá la lógica del router)
app.post('/api/form', async (req, res) => {
  try {
    const data = req.body;
    console.log("Datos recibidos:", data);

    // Aquí irá después la lógica para decidir si es Habitación, Huésped o Reporte

    res.status(200).json({ 
      success: true, 
      message: "Datos recibidos correctamente",
      data 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});