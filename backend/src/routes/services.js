import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: {
        services: {
          where: { active: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    res.json(categories);
  } catch {
    res.status(500).json({ error: 'Greška pri dohvaćanju cjenika.' });
  }
});

router.post('/', authenticateAdmin, async (req, res) => {
  const { categoryId, name, duration, durationMin, price, description, order } = req.body;

  try {
    const service = await prisma.service.create({
      data: {
        categoryId,
        name,
        duration,
        durationMin: parseInt(durationMin) || 30,
        price: parseFloat(price),
        description: description || null,
        order: parseInt(order) || 0,
      },
    });

    res.status(201).json(service);
  } catch {
    res.status(500).json({ error: 'Greška pri dodavanju usluge.' });
  }
});

router.put('/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { categoryId, name, duration, durationMin, price, active, description, order } = req.body;

  try {
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(categoryId !== undefined ? { categoryId } : {}),
        ...(name !== undefined ? { name } : {}),
        ...(duration !== undefined ? { duration } : {}),
        ...(durationMin !== undefined ? { durationMin: parseInt(durationMin) } : {}),
        ...(price !== undefined ? { price: parseFloat(price) } : {}),
        ...(active !== undefined ? { active: !!active } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(order !== undefined ? { order: parseInt(order) } : {}),
      },
    });

    res.json(service);
  } catch {
    res.status(500).json({ error: 'Greška pri ažuriranju usluge.' });
  }
});

router.delete('/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.service.update({
      where: { id },
      data: { active: false },
    });

    res.json({ message: 'Usluga je deaktivirana.' });
  } catch {
    res.status(500).json({ error: 'Greška pri uklanjanju usluge.' });
  }
});

router.post('/categories', authenticateAdmin, async (req, res) => {
  const { name, subtitle, icon, order } = req.body;

  try {
    const category = await prisma.serviceCategory.create({
      data: {
        name,
        subtitle: subtitle || null,
        icon: icon || null,
        order: parseInt(order) || 0,
      },
    });

    res.status(201).json(category);
  } catch {
    res.status(500).json({ error: 'Greška pri dodavanju kategorije.' });
  }
});

router.put('/categories/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, subtitle, icon, order, active } = req.body;

  try {
    const category = await prisma.serviceCategory.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(subtitle !== undefined ? { subtitle } : {}),
        ...(icon !== undefined ? { icon } : {}),
        ...(order !== undefined ? { order: parseInt(order) } : {}),
        ...(active !== undefined ? { active: !!active } : {}),
      },
    });

    res.json(category);
  } catch {
    res.status(500).json({ error: 'Greška pri ažuriranju kategorije.' });
  }
});

export default router;