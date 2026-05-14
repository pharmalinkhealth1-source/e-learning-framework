import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/write-client'
import { groq } from 'next-sanity'

interface ExpiringCert {
  _id: string
  userId: string
  courseId: string
  tier: string
  expiresAt: string
}

async function getExpiringCertificates(daysAhead = 30): Promise<ExpiringCert[]> {
  const now = new Date().toISOString()
  const cutoff = new Date(Date.now() + daysAhead * 86400000).toISOString()
  return client.fetch(
    groq`*[_type == "certificate" && expiresAt < $cutoff && expiresAt > $now] {
      _id, userId, courseId, tier, expiresAt
    }`,
    { now, cutoff }
  )
}

async function getInactiveLearnerIds(daysSince = 7): Promise<string[]> {
  const cutoff = new Date(Date.now() - daysSince * 86400000).toISOString()
  return client.fetch<string[]>(
    groq`*[_type == "lessonProgress" && completedAt < $cutoff && defined(userId)].userId`,
    { cutoff }
  )
}

function isoWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

export async function POST() {
  const { sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as { role?: string })?.role
  if (role !== 'system_admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // --- Expiry warnings ---
  const expiring = await getExpiringCertificates(30)
  let expirySent = 0
  let expirySkipped = 0

  await Promise.all(
    expiring.map(async cert => {
      const notifId = `notif_${cert.userId}_certexpiring_${cert.courseId}`
      const exists = await client.fetch<{ _id: string } | null>(`*[_id == $id][0]`, { id: notifId })
      if (exists) {
        expirySkipped++
        return
      }
      const expiryDate = new Date(cert.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      await writeClient.create({
        _type: 'notification',
        _id: notifId,
        userId: cert.userId,
        type: 'certificate_expiring',
        message: `Your certificate expires on ${expiryDate}. Complete a refresher to keep it active.`,
        courseId: cert.courseId,
        read: false,
        createdAt: new Date().toISOString(),
      })
      expirySent++
    })
  )

  // --- Inactivity nudges ---
  const inactiveUserIds = await getInactiveLearnerIds(7)
  const weekKey = isoWeek(new Date())
  let inactivitySent = 0
  let inactivitySkipped = 0

  await Promise.all(
    [...new Set(inactiveUserIds)].map(async userId => {
      const notifId = `notif_${userId}_inactive_${weekKey}`
      const exists = await client.fetch<{ _id: string } | null>(`*[_id == $id][0]`, { id: notifId })
      if (exists) {
        inactivitySkipped++
        return
      }
      await writeClient.create({
        _type: 'notification',
        _id: notifId,
        userId: userId,
        type: 'inactivity_nudge',
        message: 'We miss you — continue your learning journey on PharmaLink.',
        read: false,
        createdAt: new Date().toISOString(),
      })
      inactivitySent++
    })
  )

  return NextResponse.json({
    expiry: { sent: expirySent, skipped: expirySkipped },
    inactivity: { sent: inactivitySent, skipped: inactivitySkipped },
  })
}
