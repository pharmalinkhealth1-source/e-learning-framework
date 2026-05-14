import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import { put } from '@vercel/blob'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/write-client'
import React from 'react'

const pdfStyles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#0066cc',
    paddingBottom: 20,
  },
  brand: {
    fontSize: 24,
    color: '#0066cc',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 2,
  },
  tierTitle: {
    fontSize: 28,
    color: '#1a1a1a',
    fontFamily: 'Helvetica-Bold',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
  body: {
    marginTop: 20,
    textAlign: 'center',
  },
  certText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    lineHeight: 1.6,
  },
  learnerName: {
    fontSize: 22,
    color: '#1a1a1a',
    fontFamily: 'Helvetica-Bold',
    marginTop: 8,
    marginBottom: 8,
  },
  courseName: {
    fontSize: 16,
    color: '#1a1a1a',
    fontFamily: 'Helvetica-Bold',
    marginTop: 4,
    marginBottom: 20,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#d0d0d0',
    marginTop: 40,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  footerText: {
    fontSize: 10,
    color: '#888',
  },
})

interface CertPDFProps {
  learnerName: string
  courseName: string
  tier: 'accomplishment' | 'participation'
  issuedAt: string
  expiresAt: string
  certId: string
}

function CertificatePDF({ learnerName, courseName, tier, issuedAt, expiresAt, certId }: CertPDFProps) {
  const tierLabel = tier === 'accomplishment'
    ? 'Certificate of Accomplishment'
    : 'Certificate of Participation'

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: pdfStyles.page },
      React.createElement(
        View,
        { style: pdfStyles.header },
        React.createElement(Text, { style: pdfStyles.brand }, 'PHARMALINK')
      ),
      React.createElement(Text, { style: pdfStyles.tierTitle }, tierLabel),
      React.createElement(
        View,
        { style: pdfStyles.body },
        React.createElement(Text, { style: pdfStyles.certText }, 'This certifies that'),
        React.createElement(Text, { style: pdfStyles.learnerName }, learnerName),
        React.createElement(Text, { style: pdfStyles.certText }, 'has successfully completed'),
        React.createElement(Text, { style: pdfStyles.courseName }, courseName)
      ),
      React.createElement(View, { style: pdfStyles.divider }),
      React.createElement(
        View,
        { style: pdfStyles.footer },
        React.createElement(Text, { style: pdfStyles.footerText }, `Issued: ${fmt(issuedAt)}`),
        React.createElement(Text, { style: pdfStyles.footerText }, `Expires: ${fmt(expiresAt)}`),
        React.createElement(Text, { style: pdfStyles.footerText }, `ID: ${certId}`)
      )
    )
  )
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { courseId } = await req.json() as { courseId: string }
  if (!courseId) return NextResponse.json({ error: 'courseId required' }, { status: 400 })

  const certId = `cert_${userId}_${courseId}`

  // Idempotency check
  const existing = await client.fetch<{ tier: string; blobUrl: string } | null>(
    `*[_type == "certificate" && _id == $id][0] { tier, blobUrl }`,
    { id: certId }
  )
  if (existing) return NextResponse.json({ blobUrl: existing.blobUrl, tier: existing.tier })

  // Survey gate
  const survey = await client.fetch<{ _id: string } | null>(
    `*[_type == "surveyResponse" && courseId == $courseId && clerkUserId == $userId][0] { _id }`,
    { courseId, userId }
  )
  if (!survey) return NextResponse.json({ error: 'Survey not submitted' }, { status: 400 })

  // Fetch post-test score and course info in parallel
  const [progressDoc, course, clerkUser] = await Promise.all([
    client.fetch<{ postTestScore: number } | null>(
      `*[_type == "lessonProgress" && clerkUserId == $userId && courseId == $courseId && defined(postTestScore)][0] { postTestScore }`,
      { userId, courseId }
    ),
    client.fetch<{ title: string; passingScore: number } | null>(
      `*[_type == "course" && _id == $courseId][0] { title, passingScore }`,
      { courseId }
    ),
    clerkClient().then(c => c.users.getUser(userId)),
  ])

  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

  const postTestScore = progressDoc?.postTestScore ?? null
  const tier: 'accomplishment' | 'participation' =
    postTestScore != null && postTestScore >= (course.passingScore ?? 70)
      ? 'accomplishment'
      : 'participation'

  const learnerName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'Learner'

  const issuedAt = new Date()
  const expiresAt = new Date(issuedAt.getTime() + 365 * 24 * 60 * 60 * 1000)

  const pdfBuffer = await renderToBuffer(
    React.createElement(CertificatePDF, {
      learnerName,
      courseName: course.title,
      tier,
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      certId,
    }) as React.ReactElement<import('@react-pdf/renderer').DocumentProps>
  )

  const { url } = await put(
    `certificates/${certId}.pdf`,
    pdfBuffer,
    { access: 'private', contentType: 'application/pdf' }
  )

  await writeClient.create({
    _type: 'certificate',
    _id: certId,
    clerkUserId: userId,
    courseId,
    tier,
    score: postTestScore ?? 0,
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    blobUrl: url,
  })

  // Notification (idempotent)
  const notifId = `notif_${userId}_certready_${courseId}`
  const existingNotif = await client.fetch<{ _id: string } | null>(`*[_id == $id][0]`, { id: notifId })
  if (!existingNotif) {
    await writeClient.create({
      _type: 'notification',
      _id: notifId,
      clerkUserId: userId,
      type: 'certificate_ready',
      message: `Your certificate for ${course.title} is ready to download.`,
      courseId,
      read: false,
      createdAt: new Date().toISOString(),
    })
  }

  return NextResponse.json({ blobUrl: url, tier })
}
