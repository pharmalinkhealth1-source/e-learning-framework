import { type SchemaTypeDefinition } from 'sanity'
import { forumPost } from './forumPost'
import { directoryItem } from './directoryItem'
import { jobOpening } from './jobOpening'
import { dataInsight } from './dataInsight'
import { author } from './author'
import { comment } from './comment'
import { course } from './course'
import { courseModule } from './courseModule'
import { lesson } from './lesson'
import { quiz } from './quiz'
import { lessonProgress } from './lessonProgress'
import { surveyResponse } from './surveyResponse'
import { certificate } from './certificate'
import { enrollment } from './enrollment'
import { notification } from './notification'
import { memberSpotlight } from './memberSpotlight'
import blogPost from './blogPost'
import { assignment } from './assignment'
import { submission } from './submission'
import { conversation } from './conversation'
import { directMessage } from './directMessage'
import { forumRules } from './forumRules'
import { pbidSurveyResponse } from './pbidSurveyResponse'
import { pbidSurveyConfig } from './pbidSurveyConfig'
import { siteSettings } from './siteSettings'
import { legalPage } from './legalPage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    forumPost, directoryItem, jobOpening, dataInsight, author, comment,
    course, courseModule, lesson, quiz,
    lessonProgress, surveyResponse, certificate, enrollment, notification,
    memberSpotlight, blogPost,
    assignment, submission,
    conversation, directMessage,
    forumRules,
    pbidSurveyResponse, pbidSurveyConfig,
    siteSettings,
    legalPage,
  ],
}
