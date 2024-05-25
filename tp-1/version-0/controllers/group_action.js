const db = require('../db');

exports.createGroupAction = (req, res) => {
    const { groupId, actionId } = req.body;
    db.query('INSERT INTO group_action (group_id, action_id) VALUES (?, ?)', [groupId, actionId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send('Group-Action Association created successfully');
    });
};

exports.deleteGroupAction = (req, res) => {
    const { groupId, actionId } = req.params;
    console.log(`Deleting Group-Action Association with groupId=${groupId} and actionId=${actionId}`);
    db.query('DELETE FROM group_action WHERE group_id = ? AND action_id = ?', [groupId, actionId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send('Group-Action Association deleted successfully');
    });
};
