import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import JSZip from 'jszip'
import { client } from '@/sanity/lib/client'

export async function POST(req: NextRequest) {
  const { sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as { role?: string })?.role
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const lessonId = req.nextUrl.searchParams.get('lessonId')
  if (!lessonId) return NextResponse.json({ error: 'lessonId required' }, { status: 400 })

  const formData = await req.formData()
  const file = formData.get('file')
  if (!(file instanceof Blob)) return NextResponse.json({ error: 'file required' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(arrayBuffer)

  // Find imsmanifest.xml to determine SCORM version and entry point
  const manifest = zip.file('imsmanifest.xml')
  if (!manifest) return NextResponse.json({ error: 'Not a valid SCORM package (no imsmanifest.xml)' }, { status: 422 })

  const manifestText = await manifest.async('text')
  const scormVersion = manifestText.includes('CAM 1.3') || manifestText.includes('2004') ? '2004' : '1.2'

  // Extract entry URL from manifest (href of first <resource> with SCO type)
  const scoMatch = manifestText.match(/adlcp:scormtype="sco"[^>]*href="([^"]+)"/i)
    || manifestText.match(/href="([^"]+\.html?)"/i)
  const entryFile = scoMatch ? scoMatch[1] : 'index.html'

  // Upload each file in the ZIP to Vercel Blob
  const prefix = `scorm/${lessonId}`
  const uploads: Promise<void>[] = []

  zip.forEach((relativePath, zipEntry) => {
    if (!zipEntry.dir) {
      uploads.push(
        zipEntry.async('arraybuffer').then(buf =>
          put(`${prefix}/${relativePath}`, buf, { access: 'public', addRandomSuffix: false })
        ).then(() => undefined)
      )
    }
  })

  await Promise.all(uploads)

  const entryUrl = `${process.env.BLOB_BASE_URL ?? ''}/${prefix}/${entryFile}`

  await client
    .patch(lessonId)
    .set({ scormEntryUrl: entryUrl, scormVersion })
    .commit()

  return NextResponse.json({ ok: true, entryUrl, scormVersion })
}
