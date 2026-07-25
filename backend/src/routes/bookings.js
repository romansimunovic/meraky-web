import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { createCalendarEvent, deleteCalendarEvent } from '../lib/googleCalendar.js';

const router = Router();

router.post('/', async (req, res) => {
  const { serviceId, dateTime, fullName, phone, email, notes } = req.body;

  if (!serviceId || !dateTime || !fullName || !phone) {
    return res.status(400).json({ error: 'Molimo popunite sva obavezna polja.' });
  }

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { category: true },
    });

    if (!service || !service.active) {
      return res.status(404).json({ error: 'Odabrana usluga ne postoji.' });
    }

    let client = await prisma.client.findUnique({ where: { phone } });

    if (!client) {
      client = await prisma.client.create({
        data: { fullName, phone, email, notes },
      });
    } else {
      client = await prisma.client.update({
        where: { id: client.id },
        data: { fullName, email, notes },
      });
    }

    const googleEventId = await createCalendarEvent({
      summary: `${service.name} - ${fullName}`,
      description: `Klijentica: ${fullName}\nTelefon: ${phone}\nE-mail: ${email || 'Nema'}\nNapomena: ${notes || 'Nema'}`,
      startTime: dateTime,
      durationMin: service.durationMin,
    });

    const booking = await prisma.booking.create({
      data: {
        serviceId,
        clientId: client.id,
        dateTime: new Date(dateTime),
        googleEventId,
      },
      include: { service: true, client: true },
    });

    res.status(201).json({ message: 'Rezervacija uspješno kreirana!', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška prilikom izrade rezervacije.' });
  }
});

router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { service: true, client: true },
      orderBy: { dateTime: 'asc' },
    });

    res.json(bookings);
  } catch {
    res.status(500).json({ error: 'Greška pri dohvaćanju rezervacija.' });
  }
});

router.put('/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { dateTime, status, adminNote } = req.body;

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(dateTime ? { dateTime: new Date(dateTime) } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(adminNote !== undefined ? { adminNote } : {}),
      },
      include: { service: true, client: true },
    });

    res.json(booking);
  } catch {
    res.status(500).json({ error: 'Greška pri ažuriranju rezervacije.' });
  }
});

router.delete('/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      return res.status(404).json({ error: 'Rezervacija nije pronađena.' });
    }

    if (booking.googleEventId) {
      await deleteCalendarEvent(booking.googleEventId);
    }

    await prisma.booking.delete({ where: { id } });

    res.json({ message: 'Rezervacija je obrisana.' });
  } catch {
    res.status(500).json({ error: 'Greška pri brisanju rezervacije.' });
  }
});

export default router;