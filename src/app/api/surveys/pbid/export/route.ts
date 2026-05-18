import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

/**
 * CSV export of all PBID survey responses. Protected by a Bearer token
 * matching `PBID_EXPORT_SECRET`. When the env var is unset the endpoint is
 * unprotected (intentional for local development). Responses are flattened
 * into one column per known question id so the output is analysis-ready.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.PBID_EXPORT_SECRET
  if (secret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const responses = await client.fetch<
    Array<{ submittedAt: string; sessionId: string; responses: string; surveyVersion: string }>
  >(
    `*[_type == "pbidSurveyResponse"] | order(submittedAt desc) { submittedAt, sessionId, responses, surveyVersion }`
  )

  const FIELDS = [
    'q100', 'q101', 'q101-2', 'q102', 'q102-2', 'q103', 'q103-2', 'q104', 'q105', 'q105-2',
    'q200', 'q201', 'q201-1', 'q201-2-radio', 'q202', 'q203-1', 'q203-2-radio', 'q204',
    'q300', 'q301', 'q302', 'q303', 'q304', 'q305', 'q306', 'q307', 'q308', 'q309',
    'q310', 'q311', 'q312', 'q313', 'q314', 'q315',
  ]

  const headers = ['submittedAt', 'sessionId', 'surveyVersion', ...FIELDS]

  const rows = responses.map((r) => {
    let data: Record<string, unknown> = {}
    try {
      data = JSON.parse(r.responses || '{}')
    } catch {
      data = {}
    }
    return [
      r.submittedAt,
      r.sessionId,
      r.surveyVersion,
      ...FIELDS.map((f) => {
        const val = data[f]
        if (Array.isArray(val)) return `"${val.join('; ').replace(/"/g, '""')}"`
        return val ? `"${String(val).replace(/"/g, '""')}"` : ''
      }),
    ].join(',')
  })

  const csv = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="pbid-survey-responses-${
        new Date().toISOString().split('T')[0]
      }.csv"`,
    },
  })
}
