require('dotenv').config({ path: './.env' });
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const jwt = require('jsonwebtoken');
const db = require('./db');
const cookieParser = require('cookie-parser');


const app = express();
const PORT = process.env.PORT || 2000;

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', userRoutes);

app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM user';
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result);
    });
  });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
