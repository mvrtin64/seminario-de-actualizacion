const express = require('express');
const mysql = require('mysql');
const db = require('./db');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const actionRoutes = require('./routes/action');
const userGroupRoutes = require('./routes/user_group');
const groupActionRoutes = require('./routes/group_action');
const associationsRoutes = require('./routes/associationsTable');


app.use('/users', userRoutes);
app.use('/groups', groupRoutes);
app.use('/actions', actionRoutes);
app.use('/user_groups', userGroupRoutes);
app.use('/group_actions', groupActionRoutes);
app.use('/associations', associationsRoutes);

// endpoint tests
app.get('/test', (req, res) => {
    res.send('Test endpoint working!');
});

app.get('/db-test', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(`Database test successful: ${results[0].solution}`);
    });
});

app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM user';
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result);
    });
  });

app.listen(2000, () => {
    console.log('Server running on port 2000');
});
