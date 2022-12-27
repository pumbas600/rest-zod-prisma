import * as z from "zod"

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
