import * as z from "zod"

export const CreatePresentationModel = z.object({
  filename: z.string(),
  author: z.string(),
  contents: z.string().array(),
  created: z.date().optional(),
  updated: z.date().optional(),
})
