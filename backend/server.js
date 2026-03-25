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
// RUTA TEMPORAL PARA CREAR LAS TABLAS
app.get('/crear-tablas', async (req, res) => {
  try {
    const querySQL = `
      CREATE TABLE IF NOT EXISTS habitaciones (
          id SERIAL PRIMARY KEY,
          number VARCHAR(10) NOT NULL,
          piso INT,
          type VARCHAR(50),
          capacity INT,
          price DECIMAL(10, 2),
          status VARCHAR(20) DEFAULT 'disponible'
      );

      CREATE TABLE IF NOT EXISTS huespedes (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100),
          phone VARCHAR(20),
          dni VARCHAR(20) UNIQUE,
          address TEXT,
          room_id INT,
          check_in_date DATE,
          check_out_date DATE,
          notes TEXT
      );

      CREATE TABLE IF NOT EXISTS reportes (
          id SERIAL PRIMARY KEY,
          type VARCHAR(50),
          title VARCHAR(100),
          description TEXT,
          location VARCHAR(100),
          priority VARCHAR(20),
          status VARCHAR(20) DEFAULT 'pendiente',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(querySQL);
    res.send("<h1>✅ ¡Tablas creadas con éxito en Render!</h1>");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error: " + err.message);
  }
});