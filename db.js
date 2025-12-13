// db.js
const { MongoClient } = require('mongodb');

// Create client using required method
const client = new MongoClient("mongodb://127.0.0.1:27017");

// Connect ONCE when server starts
client.connect()
  .then(() => console.log("✔ Connected to MongoDB"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// Choose the database
const db = client.db('myDB');

// Export the DB so other files can use it
module.exports = db;
