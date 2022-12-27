import * as z from "zod"
import { CompleteCreatePost, RelatedCreatePostModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const CreateUserModel = z.object({
  meta: jsonSchema,
})

export type CreateUser = z.infer<typeof CreateUserModel>

export interface CompleteCreateUser extends z.infer<typeof CreateUserModel> {
  posts?: CompleteCreatePost | null
}

/**
 * RelatedCreateUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCreateUserModel: z.ZodSchema<CompleteCreateUser> = z.lazy(() => CreateUserModel.extend({
  posts: RelatedCreatePostModel.nullish(),
}))
