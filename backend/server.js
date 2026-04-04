// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db'); // avy amin'ny db.js

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("RECEIVED:", email, password); // debug

  try {
    const result = await pool.query(
      'INSERT INTO login (email, password) VALUES ($1, $2) RETURNING *',
      [email, password]
    );

    console.log("INSERT OK:", result.rows[0]); // hita ao terminal
    res.json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error("INSERT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000 🚀"));