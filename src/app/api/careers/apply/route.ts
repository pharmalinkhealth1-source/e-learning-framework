import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { auth } from '@clerk/nextjs/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = 'info@pharmalinkhealth.com';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { jobTitle, fullName, email, phone, links, note } = body;

  if (!jobTitle || !fullName || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: 'PharmaLink Careers <careers@pharmalinkhealth.com>',
    to: TO,
    replyTo: email,
    subject: `New Application: ${jobTitle} — ${fullName}`,
    html: `
      <h2>New Job Application</h2>
      <p><strong>Position:</strong> ${jobTitle}</p>
      <hr />
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>LinkedIn / Portfolio:</strong> ${links ? `<a href="${links}">${links}</a>` : 'Not provided'}</p>
      <hr />
      <h3>Why PharmaLink?</h3>
      <p>${note || 'No message provided.'}</p>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Failed to send application' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
