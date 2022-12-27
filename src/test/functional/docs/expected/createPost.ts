import * as z from "zod"

export const CreatePostModel = z.object({
  /**
   * A brief title that describes the contents of the post
   */
  title: z.string().max(255, { message: "The title must be shorter than 256 characters" }),
  /**
   * The actual contents of the post.
   */
  contents: z.string().max(10240),
})

export type CreatePost = z.infer<typeof CreatePostModel>
