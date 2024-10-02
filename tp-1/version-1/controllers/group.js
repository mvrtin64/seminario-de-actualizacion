const db = require('../db');

exports.getAllGroups = (req, res) => {
    db.query('CALL GetAllGroups()', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]);
    });
};

exports.createGroup = (req, res) => {
    const { group_name } = req.body;
    db.query('CALL CreateGroup(?)', [group_name], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('Group created successfully');
    });
};

exports.getGroupById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM `group` WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]);
    });
};

exports.updateGroup = (req, res) => {
    const { id } = req.params;
    const { group_name } = req.body;
    db.query('UPDATE `group` SET name = ? WHERE id = ?', [group_name, id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('Group updated successfully');
    });
};

exports.deleteGroup = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM `group` WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('Group deleted successfully');
    });
};

exports.getGroupNames = (req, res) => {
    db.query('SELECT name FROM `group`', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};