import * as z from "zod"
import { CompleteCreatePresentation, RelatedCreatePresentationModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const CreateSpreadsheetModel = z.object({
  filename: z.string(),
  author: z.string(),
  contents: jsonSchema,
  created: z.date().optional(),
  updated: z.date().optional(),
})

export interface CompleteCreateSpreadsheet extends z.infer<typeof CreateSpreadsheetModel> {
  presentations: CompleteCreatePresentation[]
}

/**
 * RelatedCreateSpreadsheetModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCreateSpreadsheetModel: z.ZodSchema<CompleteCreateSpreadsheet> = z.lazy(() => CreateSpreadsheetModel.extend({
  presentations: RelatedCreatePresentationModel.array(),
}))
