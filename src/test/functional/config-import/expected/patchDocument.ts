import * as z from "zod"
import * as imports from "../prisma/zod-utils"

export const PatchDocumentModel = z.object({
  filename: z.string().optional(),
  author: z.string().optional(),
  contents: z.string().optional(),
  size: imports.decimalSchema.optional(),
  created: z.date().optional(),
  updated: z.date().optional(),
})

export type PatchDocument = z.infer<typeof PatchDocumentModel>
