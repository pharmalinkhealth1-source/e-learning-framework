export {}

declare global {
  interface CustomSessionClaims {
    metadata?: {
      onboarded?: boolean
      role?: 'learner' | 'program_manager' | 'partner_donor' | 'system_admin'
      country?: string
      completedLessons?: string[]
      lms_registered?: boolean
    }
  }
}
