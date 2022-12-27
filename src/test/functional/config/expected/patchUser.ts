import * as z from "zod"
import { CompletePatchPost, patchPostSchema } from "./index"

export const _patchUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
})

export type PatchUser = z.infer<typeof _patchUserSchema>

export interface CompletePatchUser extends z.infer<typeof _patchUserSchema> {
  posts?: CompletePatchPost[]
}

/**
 * patchUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const patchUserSchema: z.ZodSchema<CompletePatchUser> = z.lazy(() => _patchUserSchema.extend({
  posts: patchPostSchema.array().optional(),
}))
