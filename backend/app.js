const express = require('express');
const mongoose = require('mongoose');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const itemRoutes = require('./routes/items');

const app = express();
app.use(express.json());
app.use(cors());


const swaggerDocumento = YAML.load('./swagger/swagger.yaml');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocumento));

mongoose.connect('mongodb://mongodb:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.get('/', (req, res) => {
  res.send('Bem-vindo ao sistema de alta disponibilidade!');
});

app.use('/item', itemRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});