import * as z from "zod"
import { CompleteCreateKeychain, RelatedCreateKeychainModel } from "./index"

export const CreateUserModel = z.object({
})

export type CreateUser = z.infer<typeof CreateUserModel>

export interface CompleteCreateUser extends z.infer<typeof CreateUserModel> {
  keychain?: CompleteCreateKeychain | null
}

/**
 * RelatedCreateUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCreateUserModel: z.ZodSchema<CompleteCreateUser> = z.lazy(() => CreateUserModel.extend({
  keychain: RelatedCreateKeychainModel.nullish(),
}))
