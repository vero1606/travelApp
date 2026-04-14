const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());        

app.get('/', (req, res) => res.send('API running'));

const destinationRoutes = require('../routes/destinations');
app.use('/api/destinations', destinationRoutes);

const authRoutes = require('../routes/auth');
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error('ERROR STACK:', err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));