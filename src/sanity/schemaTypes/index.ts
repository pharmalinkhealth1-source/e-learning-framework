import { type SchemaTypeDefinition } from 'sanity'
import { forumPost } from './forumPost'
import { directoryItem } from './directoryItem'
import { jobOpening } from './jobOpening'
import { dataInsight } from './dataInsight'
import { author } from './author'
import { comment } from './comment'
import { memberSpotlight } from './memberSpotlight'
import blogPost from './blogPost'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [forumPost, directoryItem, jobOpening, dataInsight, author, comment, memberSpotlight, blogPost],
}

