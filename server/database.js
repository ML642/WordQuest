const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
async function connectDB() {
  try {
    //console.log(require('dotenv').config({ path: __dirname + '/.env' }));

    console.log(process.env.MONGODB_URI)
    await mongoose.connect(process.env.MONGODB_URI , {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
module.exports = connectDB;
