const db = require('../db');

exports.getAssociations = (req, res) => {
    const sql = `
        SELECT 
            u.id as user_id, u.name as user_name, u.email as user_email,
            g.id as group_id, g.name as group_name,
            a.id as action_id, a.name as action_name
        FROM user u
        LEFT JOIN user_group ug ON u.id = ug.user_id
        LEFT JOIN \`group\` g ON ug.group_id = g.id
        LEFT JOIN group_action ga ON g.id = ga.group_id
        LEFT JOIN action a ON ga.action_id = a.id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};


exports.updateAssociation = (req, res) => {
    const { userId, groupId } = req.params;
    const { userName, userEmail, groupName } = req.body;

    // Find new group id based on groupName
    db.query('SELECT id FROM `group` WHERE name = ?', [groupName], (err, groupResults) => {
        if (err) return res.status(500).send(err);

        if (groupResults.length === 0) {
            return res.status(404).send('Group not found');
        }

        const newGroupId = groupResults[0].id;

        // Update user information
        db.query('UPDATE user SET name = ?, email = ? WHERE id = ?', [userName, userEmail, userId], (err, userResults) => {
            if (err) return res.status(500).send(err);

            // Update association
            db.query('UPDATE user_group SET group_id = ? WHERE user_id = ? AND group_id = ?', [newGroupId, userId, groupId], (err, assocResults) => {
                if (err) return res.status(500).send(err);

                res.send('Association updated successfully');
            });
        });
    });
};
