import * as z from "zod"
import { CompletePatchPresentation, RelatedPatchPresentationModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const PatchSpreadsheetModel = z.object({
  filename: z.string().optional(),
  author: z.string().optional(),
  contents: jsonSchema.optional(),
  created: z.date().optional(),
  updated: z.date().optional(),
})

export type PatchSpreadsheet = z.infer<typeof PatchSpreadsheetModel>

export interface CompletePatchSpreadsheet extends z.infer<typeof PatchSpreadsheetModel> {
  presentations?: CompletePatchPresentation[]
}

/**
 * RelatedPatchSpreadsheetModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPatchSpreadsheetModel: z.ZodSchema<CompletePatchSpreadsheet> = z.lazy(() => PatchSpreadsheetModel.extend({
  presentations: RelatedPatchPresentationModel.array().optional(),
}))
