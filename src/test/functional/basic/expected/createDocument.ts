import * as z from "zod"

export const CreateDocumentModel = z.object({
  filename: z.string(),
  author: z.string(),
  contents: z.string(),
  created: z.date().optional(),
  updated: z.date().optional(),
})

export type CreateDocument = z.infer<typeof CreateDocumentModel>
