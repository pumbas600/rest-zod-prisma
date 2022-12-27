import * as z from "zod"
import * as imports from "../prisma/zod-utils"

export const CreateDocumentModel = z.object({
  filename: z.string(),
  author: z.string(),
  contents: z.string(),
  size: imports.decimalSchema,
  created: z.date().optional(),
  updated: z.date().optional(),
})

export type CreateDocument = z.infer<typeof CreateDocumentModel>
