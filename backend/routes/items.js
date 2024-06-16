const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const itemSchema = new mongoose.Schema({
  id: { type: Integer, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true }
});

const Item = mongoose.model('Item', itemSchema);

// Criar um novo item
router.post('/item', async (req, res) => {
  const { id, name, description } = req.body;
  const newItem = new Item({ id, name, description });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obter todos os itens
router.get('/item', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Atualizar um item existente
router.put('/item/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedItem = await Item.findOneAndUpdate(
      { id },
      { name, description },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deletar um item existente
router.delete('/item/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await Item.findOneAndDelete({ id });
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;