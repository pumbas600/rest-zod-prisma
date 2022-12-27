import * as z from "zod"
import { CompletePatchPost, RelatedPatchPostModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const PatchUserModel = z.object({
  meta: jsonSchema.optional(),
})

export interface CompletePatchUser extends z.infer<typeof PatchUserModel> {
  posts?: CompletePatchPost | null
}

/**
 * RelatedPatchUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPatchUserModel: z.ZodSchema<CompletePatchUser> = z.lazy(() => PatchUserModel.extend({
  posts: RelatedPatchPostModel.nullish().optional(),
}))
