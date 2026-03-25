const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const fs = require('fs');
const csvParser = require('csv-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Ruta para cargar las habitaciones desde el CSV
app.get('/cargar-habitaciones', async (req, res) => {
  const resultados = [];
  
  // Asegúrate que el archivo se llame exactamente así en tu carpeta
  fs.createReadStream('./DONAMARY.xlsx - Habitaciones.csv') 
    .pipe(csvParser())
    .on('data', (data) => resultados.push(data))
    .on('end', async () => {
      try {
        for (const fila of resultados) {
          await pool.query(
            'INSERT INTO habitaciones (number, piso, type, capacity, price, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [fila.number, fila.piso, fila.type, fila.capacity, fila.price, fila.status]
          );
        }
        res.send(`<h1>✅ ¡Éxito! Se guardaron ${resultados.length} habitaciones.</h1>`);
      } catch (err) {
        res.status(500).send("Error al insertar: " + err.message);
      }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});