const db = require('../db');


exports.getAllUserGroups = (req, res) => {
    const sql = 'SELECT * FROM user_group';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

exports.createUserGroup = (req, res) => {
    const { userId, groupId } = req.body;
    db.query('INSERT INTO user_group (user_id, group_id) VALUES (?, ?)', [userId, groupId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('User-Group Association created successfully');
    });
};

exports.deleteUserGroup = (req, res) => {
    const { userId, groupId } = req.params;
    const sql = 'DELETE FROM user_group WHERE user_id = ? AND group_id = ?';
    db.query(sql, [userId, groupId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.sendStatus(204); // No Content
    });
};
