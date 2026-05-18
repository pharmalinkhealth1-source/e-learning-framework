import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/write-client'

/**
 * Accepts a PBID survey submission and stores it as a `pbidSurveyResponse`
 * document in Sanity. No authentication is required because access to this
 * endpoint is gated client-side by the optional passcode (see
 * `/api/surveys/pbid/auth`). The full answer map is serialized to JSON so
 * the schema can evolve without losing historical responses.
 */
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const responses = (body as { responses?: unknown })?.responses
  if (!responses || typeof responses !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const sessionId = crypto.randomUUID()

  await writeClient.create({
    _type: 'pbidSurveyResponse',
    submittedAt: new Date().toISOString(),
    sessionId,
    responses: JSON.stringify(responses),
    surveyVersion: '1.0',
  })

  return NextResponse.json({ ok: true })
}
