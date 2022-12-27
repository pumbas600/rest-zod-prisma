import * as z from "zod"

export const CreateUserModel = z.object({
  name: z.string(),
  email: z.string(),
})
