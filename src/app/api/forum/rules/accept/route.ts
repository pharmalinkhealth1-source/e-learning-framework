import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { version } = body;

    if (!version || typeof version !== 'string') {
      return NextResponse.json({ error: 'version is required' }, { status: 400 });
    }

    const clerk = await clerkClient();

    // Fetch existing user to preserve current publicMetadata fields (role, onboarded, etc.)
    const existingUser = await clerk.users.getUser(userId);

    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...existingUser.publicMetadata,          // CRITICAL: preserve role, onboarded, etc.
        forumRulesAcceptedAt: new Date().toISOString(),
        forumRulesAcceptedVersion: version,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forum rules accept error:', error);
    return NextResponse.json({ error: 'Failed to record acceptance' }, { status: 500 });
  }
}
