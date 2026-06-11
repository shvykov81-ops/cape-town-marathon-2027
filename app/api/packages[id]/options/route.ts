import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const options = await prisma.packageOption.findMany({
      where: { 
        packageId: id, 
        isActive: true 
      },
      orderBy: { category: 'asc' },
    });

    return NextResponse.json(options);
  } catch (error) {
    console.error('Failed to fetch options:', error);
    return NextResponse.json({ error: 'Failed to fetch options' }, { status: 500 });
  }
}
