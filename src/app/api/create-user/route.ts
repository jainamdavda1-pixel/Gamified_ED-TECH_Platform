import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = user.emailAddresses[0]?.emailAddress || '';
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Learner';

    // Upsert the user into the database
    await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        name,
        email,
      },
      create: {
        clerkId: user.id,
        name,
        email,
        xp: 0,
        coins: 0,
        level: 1,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error in create-user API:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

