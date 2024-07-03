const db = require('../db');
const jwt = require('jsonwebtoken');

exports.getAllUsers = (req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

exports.createUser = (req, res) => {
    const { username, email, password } = req.body;
    console.log('Received user creation request:', req.body);

    db.query(
        'INSERT INTO user (name, email, password) VALUES (?, ?, ?)',
        [username, email, password],
        (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'User already exists' });
                }
                return res.status(500).json({ message: 'Error creating user' });
            }
            console.log('User created successfully:', results);
            res.status(201).json({ message: 'User created successfully' });
        }
    );
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error retrieving user' });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        
        const token = jwt.sign({ id: user.id }, process.env.MY_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }); // 1 hour expiry

        res.status(200).json({ message: 'Login successful' });
    });
};

exports.logoutUser = (req, res) => {
    res.clearCookie('token'); 
    return res.status(200).json({ message: 'Logout successful' });
};