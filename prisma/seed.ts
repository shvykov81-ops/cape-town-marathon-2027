import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.packageOption.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.package.deleteMany();

  console.log('Creating packages...');

  // Create packages
  const baseCamp = await prisma.package.create({
    data: {
      name: 'Base Camp',
      type: 'standard',
      durationDays: 7,
      priceBase: 1499,
      maxParticipants: 20,
      description: 'Basic prep camp with group training and shared accommodation. Perfect for first-time marathon runners.',
      includes: ['Shared accommodation', 'Group training runs', 'Airport transfer', 'Race day support', 'Welcome dinner'],
    },
  });

  const proCamp = await prisma.package.create({
    data: {
      name: 'Pro Camp',
      type: 'premium',
      durationDays: 10,
      priceBase: 2499,
      maxParticipants: 12,
      description: 'Personal coaching with premium hotel stay. Ideal for runners aiming for a PB.',
      includes: ['4-star hotel', 'Personal coach', 'All transfers', 'Nutrition plan', 'Physio session', 'Pace strategy'],
    },
  });

  const eliteCamp = await prisma.package.create({
    data: {
      name: 'Elite Camp',
      type: 'elite',
      durationDays: 14,
      priceBase: 3999,
      maxParticipants: 6,
      description: 'Full concierge with private villa and elite coaching. The ultimate marathon experience.',
      includes: ['Private villa', 'Elite coach', 'Daily physio', 'Race day VIP', 'Excursions', 'Personal chef', 'Recovery spa'],
    },
  });

  console.log('Creating package options...');

  // Create options for Base Camp
  await prisma.packageOption.createMany({
    data: [
      { packageId: baseCamp.id, name: 'Single room upgrade', priceAdd: 300, category: 'accommodation', isActive: true },
      { packageId: baseCamp.id, name: 'Extra week (+7 days)', priceAdd: 800, category: 'duration', isActive: true },
      { packageId: baseCamp.id, name: 'Post-race safari (2 days)', priceAdd: 899, category: 'excursion', isActive: true },
      { packageId: baseCamp.id, name: 'Table Mountain hike guide', priceAdd: 120, category: 'excursion', isActive: true },
      { packageId: baseCamp.id, name: 'Travel insurance', priceAdd: 89, category: 'service', isActive: true },
    ],
  });

  // Create options for Pro Camp
  await prisma.packageOption.createMany({
    data: [
      { packageId: proCamp.id, name: 'Ocean view suite', priceAdd: 500, category: 'accommodation', isActive: true },
      { packageId: proCamp.id, name: 'Extra physio (5 sessions)', priceAdd: 350, category: 'health', isActive: true },
      { packageId: proCamp.id, name: 'Wine tour (1 day)', priceAdd: 299, category: 'excursion', isActive: true },
      { packageId: proCamp.id, name: 'Private helicopter transfer', priceAdd: 450, category: 'transport', isActive: true },
      { packageId: proCamp.id, name: 'Spa day package', priceAdd: 200, category: 'health', isActive: true },
      { packageId: proCamp.id, name: 'Professional race photos', priceAdd: 150, category: 'service', isActive: true },
    ],
  });

  // Create options for Elite Camp
  await prisma.packageOption.createMany({
    data: [
      { packageId: eliteCamp.id, name: 'Helicopter Table Mountain tour', priceAdd: 450, category: 'excursion', isActive: true },
      { packageId: eliteCamp.id, name: 'Personal nutritionist', priceAdd: 600, category: 'health', isActive: true },
      { packageId: eliteCamp.id, name: 'Extra guest (non-runner)', priceAdd: 1200, category: 'accommodation', isActive: true },
      { packageId: eliteCamp.id, name: 'VIP race day tent', priceAdd: 800, category: 'experience', isActive: true },
      { packageId: eliteCamp.id, name: 'Shark cage diving', priceAdd: 350, category: 'excursion', isActive: true },
      { packageId: eliteCamp.id, name: 'Private yacht sunset cruise', priceAdd: 550, category: 'excursion', isActive: true },
      { packageId: eliteCamp.id, name: 'Personal videographer', priceAdd: 400, category: 'service', isActive: true },
    ],
  });

  console.log('\n✅ Seeded successfully!');
  console.log(`   - 3 packages (Base, Pro, Elite)`);
  console.log(`   - 18 package options total`);
  console.log(`\nPackages:`);
  console.log(`   Base Camp: $1,499 (7 days)`);
  console.log(`   Pro Camp: $2,499 (10 days)`);
  console.log(`   Elite Camp: $3,999 (14 days)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
