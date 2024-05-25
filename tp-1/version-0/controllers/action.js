const db = require('../db');

exports.getAllActions = (req, res) => {
    db.query('SELECT * FROM `action`', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

exports.createAction = (req, res) => {
    const { action_name } = req.body;
    db.query('INSERT INTO `action` (name) VALUES (?)', [action_name], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('Action created successfully');
    });
};

exports.getActionById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM `action` WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]);
    });
};

exports.updateAction = (req, res) => {
    const { id } = req.params;
    const { action_name } = req.body;
    db.query('UPDATE `action` SET name = ? WHERE id = ?', [action_name, id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('Action updated successfully');
    });
};

exports.deleteAction = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM `action` WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('Action deleted successfully');
    });
};

exports.getActionNames = (req, res) => {
    db.query('SELECT name FROM action', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};