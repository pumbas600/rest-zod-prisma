import * as z from "zod"

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

export type CreateSpreadsheet = z.infer<typeof CreateSpreadsheetModel>
