import * as z from "zod"
import { CompleteCreateUser, RelatedCreateUserModel } from "./index"

export const CreatePostModel = z.object({
  authorId: z.number().int(),
})

export interface CompleteCreatePost extends z.infer<typeof CreatePostModel> {
  author?: CompleteCreateUser | null
}

/**
 * RelatedCreatePostModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCreatePostModel: z.ZodSchema<CompleteCreatePost> = z.lazy(() => CreatePostModel.extend({
  author: RelatedCreateUserModel.nullish(),
}))
