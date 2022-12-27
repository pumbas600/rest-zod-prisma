import * as z from "zod"

export const PatchUserModel = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
})
