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

export type AssignmentSubmissionType = 'file' | 'text' | 'url'
export type SubmissionStatus = 'pending' | 'graded' | 'returned'

export interface Assignment {
  _id: string
  title: string
  description?: string
  courseId: string
  dueDate?: string
  submissionType: AssignmentSubmissionType
  maxScore: number
  createdBy: string
  createdAt: string
}

export interface Submission {
  _id: string
  assignmentId: string
  studentId: string
  studentName?: string
  courseId: string
  submittedAt: string
  textContent?: string
  fileUrl?: string
  linkUrl?: string
  status: SubmissionStatus
  grade?: number
  feedback?: string
  gradedBy?: string
  gradedAt?: string
}
