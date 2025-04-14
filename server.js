const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const AUTH_TOKEN = "my-secret-key-123"; // 🔐 Shared secret

let latestData = { value: 0 };
let command = "OFF";

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔐 Secure POST /data
app.post('/data', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(403).send("Unauthorized");
  }

  latestData = req.body;
  console.log("Data received:", latestData);
  res.send("OK");
});

// ✅ GET sensor data (optional security)
app.get('/data', (req, res) => {
  res.json(latestData);
});

// 🔐 POST /command
app.post('/command', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(403).send("Unauthorized");
  }

  command = req.body.command;
  console.log("Command updated to:", command);
  res.send("Command updated");
});

// ✅ GET /command (optional security)
app.get('/command', (req, res) => {
  res.send(command);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
