const Inventory = require("../model/taskModel");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const Jimp = require("jimp");

const CreateInventory = async (req, res) => {
  const { name, date, quantity,  } = req.body;

  try {
    const qrIdentifier = uuidv4();
    const qrCodeData = await QRCode.toDataURL(qrIdentifier);
    const newItem = new Inventory({
      name,
      receivedDate:date,
      receivedQuantity:quantity,
      pandingItems:quantity,
      qrIdentifier,
      qrCode: qrCodeData,
    });
    const savedItem = await newItem.save();
    res.status(201).json({
      success: true,
      message: "Created successfully",
      savedItem,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const FindInventory = async (req, res) => {
  try {
    const allInventory = await Inventory.find();
    res.status(200).json({ message: "FindALl Inventory", allInventory });
    console.log(allInventory, "allInventory");
  } catch (error) {
    console.error("Error fetching inventory:", error);
  }
};

const jsQR = require("jsqr");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

const ScanInventory = async (req, res) => {
  try {
    const filePath = req.file.path;
    
    const image = await loadImage(filePath);
    const canvas = createCanvas(image.width, image.height);
    ctx.drawImage(image, 0, 0, image.width, image.height);

    const imageData = ctx.getImageData(0, 0, image.width, image.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      const inventory = await Inventory.findOne({ qrIdentifier: code.data });
    
      if (inventory) {
        if (inventory.pandingItems > 0) {
          
          inventory.status = "Received";
          inventory.dispatchQuantity += 1; 
          inventory.dispatchDate = new Date(); 
          inventory.pandingItems -= 1; 
    
          await inventory.save(); 
          res.json({ qrCodeData: code.data });
        } else {
          res.status(400).json({ message: " All items have been dispatched, no pending items left." });
        }
      } else {
        res.status(404).json({ message: "QR code not found or invalid." });
      }
    } else {
      res.status(400).json({ message: "QR code not found or invalid." });
    }
    
  } catch (error) {
    console.error("Error scanning QR code:", error);
    res.status(500).json({ message: "Error scanning QR code." });
  }
};


const Deleteinventory =  async (req, res) => {
  try {
    const { id } = req.params;
    await Inventory.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};


const EditInventory = async (req, res) => {
  const { id } = req.params;
  const { name, receivedDate, dispatchDate, status, receivedQuantity, dispatchQuantity, pandingItems, qrIdentifier } = req.body;

  try {
    const inventoryItem = await Inventory.findByIdAndUpdate(
      id,
      {
        name,
        receivedDate,
        dispatchDate,
        status,
        receivedQuantity,
        dispatchQuantity,
        pandingItems,
        qrIdentifier,
      },
      { new: true, runValidators: true }
    );

    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    res.json(inventoryItem);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ message: 'Error updating inventory item.' });
  }
};

const findInventoryById = async (req, res) => {
  try {
      const inventoryItem = await Inventory.findById(req.params.id);
      if (!inventoryItem) {
          return res.status(404).json({ message: 'Inventory item not found' });
      }
      res.json({ inventory: inventoryItem });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

const updateInventoryById = async (req, res) => {
  try {
      const updatedItem = await Inventory.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true, runValidators: true }
      );
      if (!updatedItem) {
          return res.status(404).json({ message: 'Inventory item not found' });
      }
      res.json({ inventory: updatedItem });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { CreateInventory, updateInventoryById, FindInventory, ScanInventory,Deleteinventory,EditInventory,findInventoryById };
