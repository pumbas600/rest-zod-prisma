import * as z from "zod"
import { CompleteCreateUser, createUserSchema } from "./index"

export const _createPostSchema = z.object({
  title: z.string(),
  contents: z.string(),
  userId: z.string(),
})

export type CreatePost = z.infer<typeof _createPostSchema>

export interface CompleteCreatePost extends z.infer<typeof _createPostSchema> {
  author: CompleteCreateUser
}

/**
 * createPostSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const createPostSchema: z.ZodSchema<CompleteCreatePost> = z.lazy(() => _createPostSchema.extend({
  author: createUserSchema,
}))
