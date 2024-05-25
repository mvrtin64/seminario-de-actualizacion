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
