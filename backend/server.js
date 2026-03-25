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

// Conexión a PostgreSQL (Corregida para Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const fs = require('fs');
const csvParser = require('csv-parser');

app.get('/importar-habitaciones', async (req, res) => {
  const resultados = [];
  // Asegúrate de que el nombre del archivo sea exactamente el que tienes en tu carpeta
  fs.createReadStream('../DONAMARY.xlsx - Habitaciones.csv') 
    .pipe(csv())
    .on('data', (data) => resultados.push(data))
    .on('end', async () => {
      try {
        for (const fila of resultados) {
          await pool.query(
            'INSERT INTO habitaciones (number, piso, type, capacity, price, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [fila.number, fila.piso, fila.type, fila.capacity, fila.price, fila.status]
          );
        }
        res.send(`<h1>✅ Se importaron ${resultados.length} habitaciones con éxito.</h1>`);
      } catch (err) {
        res.status(500).send("Error al insertar: " + err.message);
      }
    });
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

// --- COPIA DESDE AQUÍ ---
app.get('/cargar-habitaciones', async (req, res) => {
  const resultados = [];
  
  // 1. Abrimos el archivo Excel (CSV)
  fs.createReadStream('./DONAMARY.xlsx - Habitaciones.csv') 
    .pipe(csvParser()) // <--- AQUÍ ESTÁ EL CAMBIO: Usamos el nombre nuevo
    .on('data', (data) => resultados.push(data))
    .on('end', async () => {
      try {
        // 2. Guardamos cada fila en la base de datos de Render
        for (const fila of resultados) {
          await pool.query(
            'INSERT INTO habitaciones (number, piso, type, capacity, price, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [fila.number, fila.piso, fila.type, fila.capacity, fila.price, fila.status]
          );
        }
        res.send(`<h1>✅ ¡Éxito! Se guardaron ${resultados.length} habitaciones en la base de datos.</h1>`);
      } catch (err) {
        console.error("Error al guardar:", err.message);
        res.status(500).send("Error: " + err.message);
      }
    });
});
// --- HASTA AQUÍ ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
})