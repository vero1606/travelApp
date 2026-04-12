const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI) //connection to the MongoDB
  .then(() => console.log('MongoDB connected')) //MongoDB holds countries information
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('API running'));//a message to indicate server is running

const destinationRoutes = require('../routes/destinations');//connects the server and frontend to display info
app.use('/api/destinations', destinationRoutes);
const PORT = 8000; //server is running on PORT 8000
app.listen(PORT, () => console.log(`Server on port ${PORT}`));