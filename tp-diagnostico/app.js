const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const contactosRouter = require('./routes/contactos');
const telefonosRouter = require('./routes/telefonos');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());  
app.use('/api/contactos', contactosRouter);
app.use('/api/telefonos', telefonosRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// endpoints
app.get('/api/contactos', (req, res) => {
  const sql = 'SELECT * FROM Contactos';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

app.get('/api/telefonos', (req, res) => {
  const sql = 'SELECT * FROM Telefonos';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

// port
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));