import * as z from "zod"

export const PatchDocumentModel = z.object({
  filename: z.string().optional(),
  author: z.string().optional(),
  contents: z.string().optional(),
  created: z.date().optional(),
  updated: z.date().optional(),
})

export type PatchDocument = z.infer<typeof PatchDocumentModel>
