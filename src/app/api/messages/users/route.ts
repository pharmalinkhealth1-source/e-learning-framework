import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function GET(req: Request) {
  const { userId, sessionClaims } = await auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').trim()
    if (!q) return NextResponse.json({ users: [] })

    const requesterRole = (sessionClaims?.metadata as Record<string, unknown> | undefined)?.role as string | undefined

    // Learners can only find teachers — prevents student-to-student discovery
    const roleFilter = requesterRole === 'learner'
      ? `&& role in ["program_manager", "system_admin"]`
      : ''

    const users = await client.fetch<Array<{ _id: string; name: string; clerkId: string; avatarUrl?: string }>>(
      `*[_type == "author" && name match $q + "*" && clerkId != $userId && defined(clerkId) ${roleFilter}][0...10] {
        _id, name, clerkId, "avatarUrl": image._externalUrl
      }`,
      { q, userId }
    )

    return NextResponse.json({
      users: (users || []).map((u) => ({
        clerkId: u.clerkId,
        name: u.name,
        avatarUrl: u.avatarUrl,
      })),
    })
  } catch (error) {
    console.error('GET users search error:', error)
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 })
  }
}
