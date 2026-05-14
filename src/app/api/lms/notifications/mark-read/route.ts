import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/write-client'
import { groq } from 'next-sanity'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { notificationId, all } = await req.json() as { notificationId?: string; all?: boolean }

  if (all) {
    const ids = await client.fetch<string[]>(
      groq`*[_type == "notification" && userId == $userId && read == false]._id`,
      { userId }
    )
    await Promise.all(ids.map(id => writeClient.patch(id).set({ read: true }).commit()))
    return NextResponse.json({ marked: ids.length })
  }

  if (notificationId) {
    const owned = await client.fetch<string[]>(
      groq`*[_type == "notification" && _id == $notificationId && userId == $userId]._id`,
      { notificationId, userId }
    )
    if (!owned.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await writeClient.patch(notificationId).set({ read: true }).commit()
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'notificationId or all required' }, { status: 400 })
}
