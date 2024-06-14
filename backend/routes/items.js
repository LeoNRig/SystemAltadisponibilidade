const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Item = mongoose.model('Item', ItemSchema);

// Listar todos os itens
router.get('/', async (res) => {
  try {
    const items = await Item.find();
    res.json(items.map(item => ({ id: item._id, name: item.name, description: item.description })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar um novo item
router.post('/', async (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    description: req.body.description
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json({ id: savedItem._id, name: savedItem.name, description: savedItem.description });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Atualizar um item pelo ID
router.put('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (item) {
      res.json({ id: item._id, name: item.name, description: item.description });
    } else {
      res.status(404).json({ error: 'Item não encontrado' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Deletar um item pelo ID
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (item) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Item não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;