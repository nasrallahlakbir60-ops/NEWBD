const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const aiRoutes = require('./routes/ai');
const authRoutes = require('./routes/auth');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60*1000, max: 30 });
app.use('/api/', limiter);

app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);

// Serve static client
const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

app.use((req,res)=>{
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next)=>{
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

module.exports = app;
