const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  receivedDate: {
    type: Date,
    required:true
  },
  dispatchDate: { type: Date,default:null},
  status: { type: String, required: true , default:"Pending" },
  receivedQuantity: { type: Number, required: true },
  dispatchQuantity: { type: Number,default:'00'  },
  pandingItems:{
    type:Number
  },
  qrIdentifier: { type: String, unique: true, required: true },
  qrCode: { type: String, required: true }, 
},{timestamps: true}
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
