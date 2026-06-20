import { PrismaClient, TrainerProfileStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@runtravel.com" },
    update: {},
    create: {
      email: "admin@runtravel.com",
      name: "Admin User",
      password: adminPassword,
      role: "admin",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create test trainer users and profiles
  const trainers = [
    {
      email: "coach.alex@example.com",
      name: "Alex Johnson",
      firstName: "Alex",
      lastName: "Johnson",
      displayName: "Coach Alex",
      slug: "coach-alex-johnson",
      headline: "Elite Marathon Coach & Olympian",
      bio: "Former Olympic marathon runner with 15+ years of coaching experience. Specialized in high-altitude training and race-day strategy. Coached 50+ athletes to Boston Marathon qualification.",
      credentials: "Olympic Marathon Runner 2012\nUSATF Level 3 Certified Coach\nExercise Physiology PhD\nNASM Performance Enhancement Specialist",
      photoUrl: "/images/trainer-alex.jpg",
      photos: ["/images/trainer-alex-1.jpg", "/images/trainer-alex-2.jpg"],
      specialties: ["marathon", "high-altitude", "race-strategy"],
      languages: ["en", "ru"],
      experienceYears: 15,
      maxClientsPerMonth: 8,
      rating: 4.9,
      reviewCount: 47,
      profileViews: 1250,
      status: TrainerProfileStatus.PUBLISHED,
      instagramUrl: "https://instagram.com/coachalex",
      stravaUrl: "https://strava.com/athletes/coachalex",
      websiteUrl: "https://coachalex.com",
    },
    {
      email: "coach.maria@example.com",
      name: "Maria Petrova",
      firstName: "Maria",
      lastName: "Petrova",
      displayName: "Coach Maria",
      slug: "coach-maria-petrova",
      headline: "Endurance Specialist & Nutritionist",
      bio: "Russian national team coach with expertise in endurance training and sports nutrition. Focus on holistic athlete development including mental preparation and recovery protocols.",
      credentials: "Russian National Team Coach\nISSN Sports Nutrition Specialist\nMindfulness-Based Stress Reduction Certified\n10x Ironman Finisher",
      photoUrl: "/images/trainer-maria.jpg",
      photos: ["/images/trainer-maria-1.jpg"],
      specialties: ["endurance", "nutrition", "mental-training", "recovery"],
      languages: ["ru", "en"],
      experienceYears: 12,
      maxClientsPerMonth: 6,
      rating: 4.8,
      reviewCount: 34,
      profileViews: 890,
      status: TrainerProfileStatus.PUBLISHED,
      instagramUrl: "https://instagram.com/coachmaria",
      stravaUrl: "https://strava.com/athletes/coachmaria",
    },
    {
      email: "coach.james@example.com",
      name: "James Okafor",
      firstName: "James",
      lastName: "Okafor",
      displayName: "Coach James",
      slug: "coach-james-okafor",
      headline: "African Running Tradition Expert",
      bio: "Kenyan-born coach bringing authentic East African training methods to international athletes. Expert in high-volume training, hill work, and developing mental toughness for marathon distance.",
      credentials: "Kenyan Athletics Federation Coach\nFormer St. Patrick's High School Coach (Iten)\n20+ Years Elite Coaching\nLondon Marathon Winner Coach 2019",
      photoUrl: "/images/trainer-james.jpg",
      photos: ["/images/trainer-james-1.jpg", "/images/trainer-james-2.jpg", "/images/trainer-james-3.jpg"],
      specialties: ["marathon", "hill-training", "mental-toughness", "beginners"],
      languages: ["en", "sw"],
      experienceYears: 20,
      maxClientsPerMonth: 10,
      rating: 5.0,
      reviewCount: 62,
      profileViews: 2100,
      status: TrainerProfileStatus.PUBLISHED,
      instagramUrl: "https://instagram.com/coachjames",
      stravaUrl: "https://strava.com/athletes/coachjames",
      websiteUrl: "https://coachjames.run",
    },
    {
      email: "coach.sarah@example.com",
      name: "Sarah Chen",
      firstName: "Sarah",
      lastName: "Chen",
      displayName: "Coach Sarah",
      slug: "coach-sarah-chen",
      headline: "Trail & Ultra Running Specialist",
      bio: "UTMB finisher and trail running expert. Specialized in technical terrain training, elevation gain strategies, and ultra-distance mental preparation. Perfect for Comrades and Two Oceans aspirants.",
      credentials: "UTMB Finisher 2023\nITRA Certified Trail Coach\nWilderness First Responder\nComrades Marathon Silver Medalist",
      photoUrl: "/images/trainer-sarah.jpg",
      photos: ["/images/trainer-sarah-1.jpg"],
      specialties: ["trail", "ultra", "elevation", "technical-terrain"],
      languages: ["en", "zh"],
      experienceYears: 8,
      maxClientsPerMonth: 5,
      rating: 4.7,
      reviewCount: 28,
      profileViews: 650,
      status: TrainerProfileStatus.PUBLISHED,
      instagramUrl: "https://instagram.com/coachsarah",
      stravaUrl: "https://strava.com/athletes/coachsarah",
    },
    {
      email: "coach.dmitri@example.com",
      name: "Dmitri Volkov",
      firstName: "Dmitri",
      lastName: "Volkov",
      displayName: "Coach Dmitri",
      slug: "coach-dmitri-volkov",
      headline: "Speed & Interval Training Master",
      bio: "Former Russian 5000m champion specializing in speed development and interval training. Expert in VO2 max improvement, lactate threshold training, and periodization for peak marathon performance.",
      credentials: "Russian 5000m Champion 2008\nIAAF Level 4 Coach\nExercise Science MSc\nCertified Periodization Specialist",
      photoUrl: "/images/trainer-dmitri.jpg",
      photos: ["/images/trainer-dmitri-1.jpg", "/images/trainer-dmitri-2.jpg"],
      specialties: ["speed", "intervals", "vo2max", "periodization"],
      languages: ["ru", "en"],
      experienceYears: 14,
      maxClientsPerMonth: 7,
      rating: 4.6,
      reviewCount: 41,
      profileViews: 780,
      status: TrainerProfileStatus.PUBLISHED,
      instagramUrl: "https://instagram.com/coachdmitri",
      stravaUrl: "https://strava.com/athletes/coachdmitri",
      websiteUrl: "https://coachdmitri.ru",
    },
  ];

  for (const trainerData of trainers) {
    const password = await bcrypt.hash("trainer123", 12);

    const user = await prisma.user.upsert({
      where: { email: trainerData.email },
      update: {},
      create: {
        email: trainerData.email,
        name: trainerData.name,
        password,
        role: "trainer",
        emailVerified: new Date(),
      },
    });

    await prisma.trainer.upsert({
      where: { slug: trainerData.slug },
      update: {},
      create: {
        userId: user.id,
        firstName: trainerData.firstName,
        lastName: trainerData.lastName,
        displayName: trainerData.displayName,
        slug: trainerData.slug,
        headline: trainerData.headline,
        bio: trainerData.bio,
        credentials: trainerData.credentials,
        photoUrl: trainerData.photoUrl,
        photos: trainerData.photos,
        specialties: trainerData.specialties,
        languages: trainerData.languages,
        experienceYears: trainerData.experienceYears,
        maxClientsPerMonth: trainerData.maxClientsPerMonth,
        rating: trainerData.rating,
        reviewCount: trainerData.reviewCount,
        profileViews: trainerData.profileViews,
        status: trainerData.status,
        instagramUrl: trainerData.instagramUrl,
        stravaUrl: trainerData.stravaUrl,
        websiteUrl: trainerData.websiteUrl || null,
        publishedAt: new Date(),
      },
    });

    console.log(`✅ Trainer created: ${trainerData.displayName} (${trainerData.status})`);
  }

  // Create a PENDING trainer application for testing
  const pendingUserPassword = await bcrypt.hash("pending123", 12);
  const pendingUser = await prisma.user.upsert({
    where: { email: "pending.coach@example.com" },
    update: {},
    create: {
      email: "pending.coach@example.com",
      name: "Pending Coach",
      password: pendingUserPassword,
      role: "user",
      emailVerified: new Date(),
    },
  });

  await prisma.trainerApplication.upsert({
    where: { userId: pendingUser.id },
    update: {},
    create: {
      userId: pendingUser.id,
      status: "PENDING",
      note: "I have 5 years of coaching experience and would love to join your platform.",
    },
  });
  console.log("✅ Pending trainer application created");

  // Create a DRAFT trainer profile for testing workflow
  const draftUserPassword = await bcrypt.hash("draft123", 12);
  const draftUser = await prisma.user.upsert({
    where: { email: "draft.coach@example.com" },
    update: {},
    create: {
      email: "draft.coach@example.com",
      name: "Draft Coach",
      password: draftUserPassword,
      role: "trainer",
      emailVerified: new Date(),
    },
  });

  await prisma.trainer.upsert({
    where: { slug: "coach-draft-test" },
    update: {},
    create: {
      userId: draftUser.id,
      firstName: "Draft",
      lastName: "Coach",
      displayName: "Coach Draft",
      slug: "coach-draft-test",
      headline: "Beginner Friendly Coach",
      bio: "I help beginners start their running journey with patience and personalized plans.",
      specialties: ["beginners", "5k", "10k"],
      languages: ["en"],
      experienceYears: 3,
      status: TrainerProfileStatus.DRAFT,
    },
  });
  console.log("✅ DRAFT trainer profile created");

  // Create sample packages
  const packages = [
    {
      name: "Elite Marathon Package",
      type: "premium",
      durationDays: 14,
      priceBase: 4999.00,
      maxParticipants: 20,
      description: "Two-week intensive training camp with elite coaches, luxury accommodation, and full race support.",
      includes: ["Airport transfers", "5-star hotel", "Daily coaching", "Nutrition plan", "Physio sessions", "Race day support"],
    },
    {
      name: "Standard Training Camp",
      type: "standard",
      durationDays: 7,
      priceBase: 2499.00,
      maxParticipants: 30,
      description: "One-week training camp with professional coaches and comfortable accommodation.",
      includes: ["Airport transfers", "4-star hotel", "Daily coaching", "Group runs", "Welcome dinner"],
    },
    {
      name: "Weekend Warrior",
      type: "basic",
      durationDays: 3,
      priceBase: 899.00,
      maxParticipants: 50,
      description: "Short but intense weekend training experience in Cape Town.",
      includes: ["Airport transfers", "Boutique hotel", "2 coaching sessions", "Scenic route tour"],
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { id: pkg.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: pkg.name.toLowerCase().replace(/\s+/g, "-"),
        ...pkg,
        isActive: true,
      },
    });
    console.log(`✅ Package created: ${pkg.name}`);
  }

  console.log("\n🎉 Seeding complete!");
  console.log("\nTest accounts:");
  console.log("  Admin: admin@runtravel.com / admin123");
  console.log("  Trainers: coach.*@example.com / trainer123");
  console.log("  Pending: pending.coach@example.com / pending123");
  console.log("  Draft: draft.coach@example.com / draft123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
