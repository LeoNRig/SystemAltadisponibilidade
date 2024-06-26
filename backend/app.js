const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const swaggerDocumento = YAML.load('./swagger/swagger.yaml');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocumento));

mongoose.connect('mongodb://mongodb:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB', error);
});

const itemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const Item = mongoose.model('Item', itemSchema);

app.get('/item', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

app.post('/item', async (req, res) => {
  try {
    const { id, name, description } = req.body;
    if (!id || !name || !description) {
      return res.status(400).json({ message: 'Requisição inválida' });
    }
    const newItem = new Item({ id, name, description });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Requisição inválida' });
  }
});

app.put('/item/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Requisição inválida' });
    }
    const updatedItem = await Item.findOneAndUpdate({ id: req.params.id }, { name, description }, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Requisição inválida' });
  }
});

app.delete('/item/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findOneAndDelete({ id: req.params.id });
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }
    res.status(200).json({ message: 'Item removido' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Requisição inválida' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});