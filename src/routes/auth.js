const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin } = require('../models');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});

// Used for persistence checks
const authMiddleware = require('../middlewares/auth');
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, { attributes: ['id', 'name', 'email'] });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});

router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await Admin.findByPk(req.admin.id);
    if (!admin) return res.status(404).json({ message: 'Not found' });
    
    admin.name = name || admin.name;
    admin.email = email || admin.email;
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }
    await admin.save();
    
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
