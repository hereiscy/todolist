const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Replace with your MySQL username
    password: '',  // Replace with your MySQL password
    database: 'todo_app'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

// Routes
app.get('/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/tasks', (req, res) => {
    const task = req.body.task;
    const sql = 'INSERT INTO tasks (task) VALUES (?)';
    db.query(sql, [task], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, task, completed: false });
    });
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.query(sql, [id], err => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const sql = 'UPDATE tasks SET completed = ? WHERE id = ?';
    db.query(sql, [completed, id], err => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
