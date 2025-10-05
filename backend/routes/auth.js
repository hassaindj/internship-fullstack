const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
require('dotenv').config();

router.post('/register',
  body('username').isLength({ min: 3 }),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, password } = req.body;
    try {
      const exists = await User.findOne({ where: { username }});
      if (exists) return res.status(400).json({ message: 'Username already exists' });
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ username, passwordHash });
      res.status(201).json({ message: 'User registered', user: { id: user.id, username: user.username }});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post('/login',
  body('username').exists(),
  body('password').exists(),
  async (req, res) => {
    const { username, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const user = await User.findOne({ where: { username }});
      if (!user) return res.status(400).json({ message: 'Invalid username or password' });
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) return res.status(400).json({ message: 'Invalid username or password' });
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '8h' });
      res.json({ token, user: { id: user.id, username: user.username } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
