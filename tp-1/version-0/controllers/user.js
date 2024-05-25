const db = require('../db');

exports.getAllUsers = (req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

exports.createUser = (req, res) => {
    const { username, email, password } = req.body;
    db.query('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [username, email, password], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('User created successfully');
    });
};

exports.getUserById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM user WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]);
    });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    db.query('UPDATE user SET username = ?, email = ?, password = ? WHERE id = ?', [username, email, password, id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('User updated successfully');
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM user WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('User deleted successfully');
    });
};

exports.getUserNames = (req, res) => {
    db.query('SELECT name FROM user', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};
