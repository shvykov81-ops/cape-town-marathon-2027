import { PrismaClient, TrainerProfileStatus } from "@prisma/client";

const prisma = new PrismaClient();

function generateSlug(firstName: string, lastName: string, existingSlugs: Set<string>): string {
  const base = `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  let slug = base || "coach";
  let counter = 1;
  while (existingSlugs.has(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  existingSlugs.add(slug);
  return slug;
}

async function main() {
  console.log("🌱 Seeding trainer self-service migration...\n");

  const existingTrainers = await prisma.trainer.findMany({ select: { slug: true } });
  const existingSlugs = new Set(existingTrainers.map((t) => t.slug).filter(Boolean));

  // Find trainers with empty or default slugs (not starting with coach- or name-like)
  const allTrainers = await prisma.trainer.findMany();
  const trainersToFix = allTrainers.filter((t) => {
    // If slug looks auto-generated or is very short, regenerate it
    const looksAuto = t.slug.startsWith("coach-") && t.slug.length <= 14;
    const looksEmpty = !t.slug || t.slug === "-" || t.slug.length < 2;
    return looksAuto || looksEmpty;
  });

  console.log(`📋 Found ${trainersToFix.length} trainers needing slug fix`);

  for (const trainer of trainersToFix) {
    const slug = generateSlug(trainer.firstName, trainer.lastName, existingSlugs);

    await prisma.trainer.update({
      where: { id: trainer.id },
      data: {
        slug,
        status: TrainerProfileStatus.PUBLISHED,
        displayName: `${trainer.firstName} ${trainer.lastName}`,
        publishedAt: new Date(),
      },
    });

    await prisma.trainerProfileChange.create({
      data: {
        trainerId: trainer.id,
        changedBy: "system",
        changeType: "UPDATE",
        fieldName: "slug",
        oldValue: trainer.slug,
        newValue: slug,
      },
    });

    console.log(`  ✓ ${trainer.firstName} ${trainer.lastName} → slug: ${slug}`);
  }

  // Link unlinked trainers to admin users
  const adminUsers = await prisma.user.findMany({
    where: { role: "admin" },
    select: { id: true, email: true },
  });

  const unlinkedTrainers = await prisma.trainer.findMany({
    where: { userId: null },
  });

  console.log(`\n🔗 Found ${unlinkedTrainers.length} unlinked trainers, ${adminUsers.length} admins`);

  if (adminUsers.length === 0) {
    console.log("  ⚠️ No admin users found. Skipping link step.");
  } else {
    for (let i = 0; i < unlinkedTrainers.length; i++) {
      const trainer = unlinkedTrainers[i];
      const admin = adminUsers[i % adminUsers.length];

      await prisma.trainer.update({
        where: { id: trainer.id },
        data: { userId: admin.id },
      });

      console.log(`  ✓ ${trainer.firstName} ${trainer.lastName} → linked to ${admin.email}`);
    }
  }

  const totalTrainers = await prisma.trainer.count();
  const publishedTrainers = await prisma.trainer.count({
    where: { status: TrainerProfileStatus.PUBLISHED },
  });

  console.log(`\n📊 Summary:`);
  console.log(`  Total trainers: ${totalTrainers}`);
  console.log(`  Published: ${publishedTrainers}`);
  console.log(`\n✅ Seed complete!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
