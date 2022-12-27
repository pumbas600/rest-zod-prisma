import * as z from "zod"
import { CompletePatchKeychain, RelatedPatchKeychainModel } from "./index"

export const PatchUserModel = z.object({
})

export type PatchUser = z.infer<typeof PatchUserModel>

export interface CompletePatchUser extends z.infer<typeof PatchUserModel> {
  keychain?: CompletePatchKeychain | null
}

/**
 * RelatedPatchUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPatchUserModel: z.ZodSchema<CompletePatchUser> = z.lazy(() => PatchUserModel.extend({
  keychain: RelatedPatchKeychainModel.nullish().optional(),
}))
