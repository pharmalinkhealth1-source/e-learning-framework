import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/write-client'

const HEALTH_WORKER_TYPES = [
  'community_pharmacist',
  'hospital_pharmacist',
  'regulatory_pharmacist',
  'industry_pharmacist',
  'informatics_pharmacist',
  'pharmacy_manager',
  'other',
] as const

function isValidEmail(email: string): boolean {
  return email.includes('@') && email.includes('.')
}

function isAtLeast18(dob: string): boolean {
  const birth = new Date(dob)
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 18
  }
  return age >= 18
}

function generateUsername(phoneNumber: string): string {
  return phoneNumber.replace(/^\+/, '').replace(/^0+/, '')
}

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const {
    firstName, lastName, dob, gender, province,
    healthWorkerType, pharmacy, email, phoneNumber, country, language,
  } = body

  const errors: Record<string, string> = {}

  if (!firstName) errors.firstName = 'Required'
  if (!lastName) errors.lastName = 'Required'
  if (!dob) {
    errors.dob = 'Required'
  } else if (!isAtLeast18(dob)) {
    errors.dob = 'Must be 18 or older'
  }
  if (!gender) errors.gender = 'Required'
  if (!province) errors.province = 'Required'
  if (!healthWorkerType || !HEALTH_WORKER_TYPES.includes(healthWorkerType)) {
    errors.healthWorkerType = 'Invalid health worker type'
  }
  if (!pharmacy) errors.pharmacy = 'Required'
  if (!email) {
    errors.email = 'Required'
  } else if (!isValidEmail(email)) {
    errors.email = 'Invalid format'
  }
  if (!phoneNumber) errors.phoneNumber = 'Required'
  if (!country) errors.country = 'Required'
  if (!language) errors.language = 'Required'

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 })
  }

  const username = generateUsername(phoneNumber)

  try {
    const clerk = await clerkClient()

    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'learner',
        country,
        lms_registered: true,
        completedLessons: [],
      },
    })

    await clerk.users.updateUser(userId, { username })

    try {
      const user = await clerk.users.getUser(userId)
      const primaryEmailId = user.primaryEmailAddressId
      if (primaryEmailId) {
        await clerk.emails.createEmail({
          fromEmailName: 'welcome',
          subject: 'Welcome to PharmaLink Learning',
          body: `Hi ${firstName}, your account is ready. Visit /elearning/my-learning to start learning.`,
          emailAddressId: primaryEmailId,
        })
      }
    } catch {
      // Email send failure is non-fatal
    }

    const courses = await client.fetch<Array<{ _id: string }>>(
      `*[_type == "course" && ($country in country || "global" in country)] { _id }`,
      { country }
    )

    for (const course of courses) {
      await writeClient.createIfNotExists({
        _type: 'enrollment',
        _id: `enrol_${userId}_${course._id}`,
        userId,
        courseId: course._id,
        enrolledAt: new Date().toISOString(),
        country,
        source: 'auto',
      })
    }

    return NextResponse.json({ success: true, redirect: '/elearning/my-learning' })
  } catch (error: unknown) {
    const err = error as { status?: number; errors?: Array<{ code?: string }> }
    if (err?.status === 422 && err?.errors?.[0]?.code === 'form_identifier_exists') {
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 })
    }
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
