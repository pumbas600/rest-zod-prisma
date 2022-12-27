import * as z from "zod"

export const PatchPostModel = z.object({
  title: z.string().optional(),
  contents: z.string().optional(),
  userId: z.string().optional(),
})
