import * as z from "zod"
import { CompletePatchUser, RelatedPatchUserModel } from "./index"

export const PatchKeychainModel = z.object({
})

export interface CompletePatchKeychain extends z.infer<typeof PatchKeychainModel> {
  owner?: CompletePatchUser
}

/**
 * RelatedPatchKeychainModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPatchKeychainModel: z.ZodSchema<CompletePatchKeychain> = z.lazy(() => PatchKeychainModel.extend({
  owner: RelatedPatchUserModel.optional(),
}))
