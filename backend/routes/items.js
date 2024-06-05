const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const itemSchema = new mongoose.Schema({
  name: String,
  description: String
});

const Item = mongoose.model('Item', itemSchema);

router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items.map(item => ({ id: item._id, name: item.name, description: item.description })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    description: req.body.description
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json({ id: savedItem._id  , name: savedItem.name, description: savedItem.description });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;