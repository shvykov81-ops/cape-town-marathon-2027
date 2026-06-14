import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

<<<<<<< HEAD
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
=======
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
>>>>>>> 5574d98ffde0119c9dfd8245d464655d1a695197
