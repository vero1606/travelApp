const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  city:            { type: String, required: true },
  country:         { type: String, required: true },
  category:        { type: String },
  bestTimeToTravel:{ type: String },
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
