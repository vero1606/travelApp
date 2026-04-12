// server/seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Destination = require('./models/Destination');

// CSV parser formats the data output
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

  return lines.slice(1).map(line => {
    // Handle quoted fields with commas inside them
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === ',' && !inQuotes) { fields.push(current.trim()); current = ''; }
      else { current += ch; }
    }
    fields.push(current.trim());

    return {
      city:             fields[0],
      country:          fields[1],
      category:         fields[2],
      bestTimeToTravel: fields[3],
    };
  });
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Connected to MongoDB');

    // Clear existing data
    await Destination.deleteMany({});
    console.log(' Cleared existing destinations');

    // Parse and insert
    const data = parseCSV(path.join(__dirname, 'travel_destinations.csv'));
    await Destination.insertMany(data);
    console.log(`Seeded ${data.length} destinations`);

    mongoose.connection.close();
  } catch (err) {
    console.error(' Seed error:', err);
    process.exit(1);
  }
}

seed();
