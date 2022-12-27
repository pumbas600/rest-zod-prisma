import * as z from "zod"
import { CompletePatchUser, patchUserSchema } from "./index"

export const _patchPostSchema = z.object({
  title: z.string().optional(),
  contents: z.string().optional(),
  userId: z.string().optional(),
})

export interface CompletePatchPost extends z.infer<typeof _patchPostSchema> {
  author?: CompletePatchUser
}

/**
 * patchPostSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const patchPostSchema: z.ZodSchema<CompletePatchPost> = z.lazy(() => _patchPostSchema.extend({
  author: patchUserSchema.optional(),
}))
