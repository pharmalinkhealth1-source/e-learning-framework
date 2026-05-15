import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

/**
 * GET /api/messages/users?q=searchterm
 * Searches author docs by name to start a new DM with.
 */
export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').trim()
    if (!q) return NextResponse.json({ users: [] })

    const users = await client.fetch<any[]>(
      `*[_type == "author" && name match $q + "*" && clerkId != $userId && defined(clerkId)][0...10] {
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
