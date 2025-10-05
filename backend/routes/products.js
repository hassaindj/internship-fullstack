const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  try { const products = await Product.findAll(); res.json(products); }
  catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.post('/',
  authenticateToken,
  body('name').notEmpty(),
  body('price').isFloat({ gt: 0 }),
  body('category').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { name, price, category, description } = req.body;
      const prod = await Product.create({ name, price, category, description });
      res.status(201).json(prod);
    } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
  }
);

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const prod = await Product.findByPk(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    const { name, price, category, description } = req.body;
    await prod.update({ name, price, category, description });
    res.json(prod);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const prod = await Product.findByPk(req.params.id);
    if (!prod) return res.status(404).json({ message: 'Product not found' });
    await prod.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
