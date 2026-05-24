import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    const email = user.emailAddresses[0]?.emailAddress || '';
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Learner';
    const avatar = user.firstName ? (user.firstName[0] + (user.lastName ? user.lastName[0] : '')).toUpperCase() : 'L';

    const profile = {
      clerkUserId: user.id,
      email,
      fullName,
      role: dbUser?.role || 'STUDENT',
      avatar,
      totalXp: dbUser?.xp ?? 0,
      streakDays: 0,
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('[PROFILE_API_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

