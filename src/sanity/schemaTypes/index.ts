import { type SchemaTypeDefinition } from 'sanity'

import { forumPost } from './forumPost'
import { directoryItem } from './directoryItem'
import { jobOpening } from './jobOpening'
import { dataInsight } from './dataInsight'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [forumPost, directoryItem, jobOpening, dataInsight],
}
