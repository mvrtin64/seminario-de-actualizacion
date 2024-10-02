const db = require('../db');

exports.getAllUsers = (req, res) => {
    db.query('CALL GetAllUsers()', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]); // results[0] contains the result set
    });
};

exports.createUser = (req, res) => {
    const { username, email, password } = req.body;
    db.query('CALL CreateUser(?, ?, ?)', [username, email, password], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('User created successfully');
    });
};

exports.getUserById = (req, res) => {
    const { id } = req.params;
    db.query('CALL GetUserById(?)', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0][0]); // results[0][0] contains the user
    });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    db.query('CALL UpdateUser(?, ?, ?, ?)', [id, username, email, password], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('User updated successfully');
    });
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    db.query('CALL DeleteUser(?)', [id], (err, results) => {
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
