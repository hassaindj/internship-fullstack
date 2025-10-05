const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { sequelize, Product } = require('./models');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use(cors());
app.use(express.json());
app.use('/', authRoutes);
app.use('/products', productRoutes);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.sync();
    const count = await Product.count();
    if (count === 0) {
      await Product.create({
        name: 'Sample Product',
        price: 19.99,
        category: 'Sample',
        description: 'This is a sample product.'
      });
      console.log('Seeded sample product');
    }
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
  }
})();
