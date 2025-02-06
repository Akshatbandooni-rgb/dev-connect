const mongoose = require("mongoose");
// MongoDB connection string
const MONGO_URI =
  "mongodb+srv://akshatbandooni333:mzLQPoWUpD4737fQ@nodejs.wuxex.mongodb.net/DevTinder";
const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
};

module.exports = connectDB;
