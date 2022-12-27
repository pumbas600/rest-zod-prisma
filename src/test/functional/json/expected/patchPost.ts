import * as z from "zod"
import { CompletePatchUser, RelatedPatchUserModel } from "./index"

export const PatchPostModel = z.object({
  authorId: z.number().int().optional(),
})

export type PatchPost = z.infer<typeof PatchPostModel>

export interface CompletePatchPost extends z.infer<typeof PatchPostModel> {
  author?: CompletePatchUser
}

/**
 * RelatedPatchPostModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPatchPostModel: z.ZodSchema<CompletePatchPost> = z.lazy(() => PatchPostModel.extend({
  author: RelatedPatchUserModel.optional(),
}))
