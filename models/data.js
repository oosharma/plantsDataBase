// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const DataSchema = new Schema(
  {
    id: Number,
    message: String,
    bloom_time: String,
    plant_type: String,
    appropriate_location: String
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = Data = mongoose.model("Data", DataSchema);
