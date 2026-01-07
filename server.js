
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
app.use(express.json());
app.use(express.static('.'));
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profile_views (
        id SERIAL PRIMARY KEY,
        visitor_ip VARCHAR(45) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabela de visualizações criada/verificada');
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
  }
}

app.get('/api/views', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM profile_views');
    const count = parseInt(result.rows[0].count);
    res.json({ views: count });
  } catch (error) {
    console.error('Erro ao buscar visualizações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/views', async (req, res) => {
  try {
    const visitorIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

    await pool.query(
      'INSERT INTO profile_views (visitor_ip) VALUES ($1) ON CONFLICT (visitor_ip) DO NOTHING',
      [visitorIP]
    );

    const result = await pool.query('SELECT COUNT(*) FROM profile_views');
    const count = parseInt(result.rows[0].count);
    
    res.json({ views: count });
  } catch (error) {
    console.error('Erro ao registrar visualização:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

async function startServer() {
  await initializeDatabase();
  app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

startServer();
