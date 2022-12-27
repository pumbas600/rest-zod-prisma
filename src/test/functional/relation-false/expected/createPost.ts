import * as z from "zod"

export const CreatePostModel = z.object({
  title: z.string(),
  contents: z.string(),
  userId: z.string(),
})

export type CreatePost = z.infer<typeof CreatePostModel>
