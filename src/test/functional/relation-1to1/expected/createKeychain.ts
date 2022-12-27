import * as z from "zod"
import { CompleteCreateUser, RelatedCreateUserModel } from "./index"

export const CreateKeychainModel = z.object({
  userID: z.string(),
})

export interface CompleteCreateKeychain extends z.infer<typeof CreateKeychainModel> {
  owner: CompleteCreateUser
}

/**
 * RelatedCreateKeychainModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCreateKeychainModel: z.ZodSchema<CompleteCreateKeychain> = z.lazy(() => CreateKeychainModel.extend({
  owner: RelatedCreateUserModel,
}))
