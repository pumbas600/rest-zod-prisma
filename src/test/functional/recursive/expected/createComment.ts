import * as z from "zod"

export const CreateCommentModel = z.object({
  author: z.string(),
  contents: z.string(),
  parentId: z.string(),
})

export type CreateComment = z.infer<typeof CreateCommentModel>

export interface CompleteCreateComment extends z.infer<typeof CreateCommentModel> {
  parent: CompleteCreateComment
  children: CompleteCreateComment[]
}

/**
 * RelatedCreateCommentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCreateCommentModel: z.ZodSchema<CompleteCreateComment> = z.lazy(() => CreateCommentModel.extend({
  parent: RelatedCreateCommentModel,
  children: RelatedCreateCommentModel.array(),
}))
