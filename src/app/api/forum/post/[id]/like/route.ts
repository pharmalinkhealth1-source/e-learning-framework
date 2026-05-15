import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/write-client'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(_req: Request, { params }: RouteContext) {
  const { userId } = await auth()
  if (!userId) return new NextResponse('Unauthorized', { status: 401 })

  const { id } = await params

  const doc = await writeClient.fetch<{ likedBy?: string[] } | null>(
    `*[_type == "forumPost" && _id == $id][0]{ likedBy }`,
    { id }
  )
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const current = doc.likedBy ?? []
  const hasLiked = current.includes(userId)
  const updated = hasLiked ? current.filter((u) => u !== userId) : [...current, userId]

  await writeClient.patch(id).set({ likedBy: updated }).commit()

  return NextResponse.json({ liked: !hasLiked, count: updated.length })
}
