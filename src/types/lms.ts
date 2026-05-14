export type LmsRole = 'learner' | 'program_manager' | 'partner_donor' | 'system_admin'
export type CertificateTier = 'participation' | 'accomplishment'

export interface DashboardFilters {
  country?: string
  gender?: string
  ageGroup?: string
  learnerType?: string
}

export interface QuizSubmission {
  courseId: string
  lessonId: string
  answers: number[]
  quizRole: 'pre-test' | 'post-test' | 'self-assessment'
}

export interface DashboardMetrics {
  csatAvg: number
  npsScore: number
  knowledgeGain: number
  dau: number
  conversionRate: number
  retentionRate: number
  newUsersByCountry: Record<string, number>
  knowledgeBaseGrowth: number
}
