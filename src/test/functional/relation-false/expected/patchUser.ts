import * as z from "zod"

export const PatchUserModel = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
})

export type PatchUser = z.infer<typeof PatchUserModel>
