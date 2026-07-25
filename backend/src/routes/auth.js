import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await prisma.adminUser.findUnique({ where: { username } });

    if (!admin) {
      return res.status(401).json({ error: 'Pogrešno korisničko ime ili lozinka.' });
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Pogrešno korisničko ime ili lozinka.' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, username: admin.username });
  } catch {
    res.status(500).json({ error: 'Greška prilikom prijave.' });
  }
});

export default router;