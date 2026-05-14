export const fallbackCourse = {
  _id: 'mock-course-001',
  _type: 'course',
  title: 'Introduction to Pharmacy Practice',
  slug: { current: 'intro-pharmacy-practice' },
  description: 'A foundational course for pharmacy professionals.',
  passingScore: 70,
  country: ['global'],
  modules: [],
}

export const fallbackLesson = {
  _id: 'mock-lesson-001',
  _type: 'lesson',
  title: 'Welcome to PharmaLink Learning',
  slug: { current: 'welcome' },
  type: 'text',
  content: [],
}

export const fallbackLessonProgress = {
  _id: 'lp_mockuser_mock-lesson-001',
  _type: 'lessonProgress',
  userId: 'mockuser',
  lessonId: 'mock-lesson-001',
  lessonShortId: 'mock0001',
  courseId: 'mock-course-001',
  completed: false,
  preTestScore: null,
  postTestScore: null,
  timeSpent: 0,
  country: 'global',
}
