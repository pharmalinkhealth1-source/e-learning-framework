import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";

const VALID_ROLES = ['learner', 'pharmacy', 'job_seeker', 'employer', 'partner', 'admin'];
const ADMIN_INVITE_CODE = process.env.ADMIN_INVITE_CODE;

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { role, inviteCode, ...profileFields } = body;

    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    if (role === 'admin') {
      if (!ADMIN_INVITE_CODE || inviteCode !== ADMIN_INVITE_CODE) {
        return NextResponse.json({ error: "Invalid invite code." }, { status: 403 });
      }
    }

    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
        onboarded: true,
        ...profileFields,
      },
    });

    // Mirror role to Sanity author doc so role-based queries work
    await writeClient
      .patch(`author-${userId}`)
      .set({ role: role === 'admin' ? 'system_admin' : role })
      .commit()
      .catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Failed to update metadata" }, { status: 500 });
  }
}
