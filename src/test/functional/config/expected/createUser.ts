import * as z from "zod"
import { CompleteCreatePost, createPostSchema } from "./index"

export const _createUserSchema = z.object({
  name: z.string(),
  email: z.string(),
})

export interface CompleteCreateUser extends z.infer<typeof _createUserSchema> {
  posts: CompleteCreatePost[]
}

/**
 * createUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const createUserSchema: z.ZodSchema<CompleteCreateUser> = z.lazy(() => _createUserSchema.extend({
  posts: createPostSchema.array(),
}))
