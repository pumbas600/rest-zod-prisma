import * as z from "zod"

export const PatchPresentationModel = z.object({
  filename: z.string().optional(),
  author: z.string().optional(),
  contents: z.string().array().optional(),
  created: z.date().optional(),
  updated: z.date().optional(),
})
