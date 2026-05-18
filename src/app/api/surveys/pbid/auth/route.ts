import { NextRequest, NextResponse } from 'next/server'

/**
 * Validates the optional access code for the PBID survey gate. When the
 * `PBID_SURVEY_CODE` env var is unset, access is open and any request
 * succeeds. Comparison is case-insensitive and trims whitespace on both
 * sides to keep the experience forgiving on mobile keyboards.
 */
export async function POST(req: NextRequest) {
  let body: { code?: unknown } = {}
  try {
    body = await req.json()
  } catch {
    // fall through — invalid JSON treated as missing code
  }
  const code = typeof body.code === 'string' ? body.code : ''
  const expected = process.env.PBID_SURVEY_CODE

  if (!expected) {
    return NextResponse.json({ ok: true })
  }

  if (code.trim().toUpperCase() !== expected.trim().toUpperCase()) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
