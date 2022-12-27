import * as z from "zod"

export const PatchCommentModel = z.object({
  author: z.string().optional(),
  contents: z.string().optional(),
  parentId: z.string().optional(),
})

export type PatchComment = z.infer<typeof PatchCommentModel>

export interface CompletePatchComment extends z.infer<typeof PatchCommentModel> {
  parent?: CompletePatchComment
  children?: CompletePatchComment[]
}

/**
 * RelatedPatchCommentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPatchCommentModel: z.ZodSchema<CompletePatchComment> = z.lazy(() => PatchCommentModel.extend({
  parent: RelatedPatchCommentModel.optional(),
  children: RelatedPatchCommentModel.array().optional(),
}))
