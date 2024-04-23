const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mtnmind',
  database: 'mydb'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conectado a la base de datos MySQL');
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