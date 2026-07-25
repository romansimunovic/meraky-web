import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

async function seed() {
  const adminExists = await prisma.adminUser.findUnique({ where: { username: 'admin' } });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('meraky2026!', 10);
    await prisma.adminUser.create({
      data: { username: 'admin', password: hashedPassword },
    });
  }

  const hasCategories = await prisma.serviceCategory.count();

  if (hasCategories === 0) {
    await prisma.serviceCategory.createMany({
      data: [
        { name: 'Rituali i napredna njega lica', subtitle: 'Vrati koži prirodnu blistavost i svježinu kroz personalizirane skincare tretmane', icon: 'face', order: 1 },
        { name: 'Obrve i trepavice', subtitle: 'Precizno oblikovanje i bojanje za uredan i naglašen izgled', icon: 'eye', order: 2 },
        { name: 'Depilacija lica', subtitle: 'Uklanjanje neželjenih dlačica uz izbor šećerne paste ili voska', icon: 'scissors', order: 3 },
        { name: 'Depilacija tijela', subtitle: 'Tretmani za glatku kožu uz prilagodbu različitim zonama tijela', icon: 'flower', order: 4 },
        { name: 'Holističke masaže i terapije', subtitle: 'Resetiraj um i oslobodi tijelo napetosti uz pomno birane tehnike dodira', icon: 'massage', order: 5 },
        { name: 'Pedikura i estetika stopala', subtitle: 'Lakoća svakog koraka uz medicinsku i estetsku njegu vrhunskih brandova', icon: 'foot', order: 6 },
        { name: 'Rituali glatkoće', subtitle: 'Dugotrajna svilenkasta mekoća prilagođena i najosjetljivijoj koži', icon: 'smooth', order: 7 },
      ],
    });
  }

  const categories = await prisma.serviceCategory.findMany();
  const map = Object.fromEntries(categories.map(c => [c.name, c.id]));

  const services = [
    ['Rituali i napredna njega lica', [
      ['Čišćenje lica', '60 min', 60, 30],
      ['Kompletna njega lica', '45 min', 45, 25],
      ['Masaža lica', '15 min', 15, 7],
      ['Ampula', '10 min', 10, 3],
    ]],
    ['Obrve i trepavice', [
      ['Oblikovanje obrva', '', 15, 8],
      ['Korekcija obrva', '', 10, 5],
      ['Bojanje obrva', '', 10, 5],
      ['Bojanje trepavica', '', 10, 5],
    ]],
    ['Depilacija lica', [
      ['Depilacija cijelog lica (šećerna pasta)', '', 20, 10],
      ['Depilacija cijelog lica (vosak)', '', 20, 8],
      ['Depilacija brade (šećerna pasta)', '', 15, 8],
      ['Depilacija nadusnice (šećerna pasta)', '', 10, 7],
      ['Depilacija brade (vosak)', '', 15, 7],
      ['Depilacija nadusnice (vosak)', '', 10, 6],
    ]],
    ['Depilacija tijela', [
      ['Depilacija cijelih nogu (šećerna pasta)', '', 45, 25],
      ['Depilacija cijelih nogu (vosak)', '', 40, 18],
      ['Depilacija leđa (vosak / pasta)', '', 30, 15],
      ['Depilacija potkoljenica (vosak / pasta)', '', 25, 13],
      ['Depilacija natkoljenica (vosak / pasta)', '', 25, 13],
      ['Depilacija ruku Ž (vosak / pasta)', '', 20, 11],
      ['Depilacija stražnjice (vosak / pasta)', '', 20, 10],
      ['Depilacija brazilska (šećerna pasta)', '', 30, 13],
      ['Depilacija bikini zone (šećerna pasta)', '', 20, 8],
      ['Depilacija trbuha (šećerna pasta)', '', 15, 8],
      ['Depilacija pazuha (šećerna pasta)', '', 15, 8],
      ['Depilacija djelomične bikini zone (pasta)', '', 15, 7],
    ]],
    ['Holističke masaže i terapije', [
      ['Klasična masaža – cijelo tijelo', '45 min', 45, 25],
      ['Masaža leđa', '30 min', 30, 18],
      ['Čišćenje leđa', '45 min', 45, 16],
      ['Anticelulitna masaža', '30 min', 30, 15],
      ['Masaža vlasišta, vrata i dekoltea', '20 min', 20, 10],
      ['Masaža stopala', '15 min', 15, 8],
      ['Parafinska kupka za ruke', '20 min', 20, 7],
    ]],
    ['Pedikura i estetika stopala', [
      ['Njega stopala + trajni lak', '60 min', 60, 30],
      ['Njega stopala žene', '45 min', 45, 19],
      ['Trajni lak noge', '30 min', 30, 15],
      ['Ureživanje noktiju stopala', '20 min', 20, 8],
      ['Parafinska kupka stopala', '20 min', 20, 8],
      ['Skraćivanje noktiju stopala', '15 min', 15, 5],
      ['Lakiranje noktiju', '10 min', 10, 3],
    ]],
    ['Rituali glatkoće', [
      ['Bezbolna depilacija cijelih nogu', '30 min', 30, 25],
      ['Depilacija ruku i pazuha', '20 min', 20, 15],
      ['Precizno oblikovanje obrva koncem', '15 min', 15, 10],
    ]],
  ];

  for (const [categoryName, items] of services) {
    const categoryId = map[categoryName];
    if (!categoryId) continue;

    for (const [name, duration, durationMin, price] of items) {
      const exists = await prisma.service.findFirst({ where: { categoryId, name } });
      if (!exists) {
        await prisma.service.create({
          data: { categoryId, name, duration, durationMin, price, active: true },
        });
      }
    }
  }
}

seed().catch(console.error).finally(() => prisma.$disconnect());