require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // wajib 0.0.0.0 biar bisa diakses dari luar VPS

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server berjalan dengan baik 🚀',
    time: new Date().toISOString(),
  });
});

// Endpoint health check, berguna untuk monitoring / load balancer
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, HOST, () => {
  console.log(`Server berjalan di http://${HOST}:${PORT}`);
});
