import * as z from "zod"

export const PatchPostModel = z.object({
  /**
   * A brief title that describes the contents of the post
   */
  title: z.string().max(255, { message: "The title must be shorter than 256 characters" }).optional(),
  /**
   * The actual contents of the post.
   */
  contents: z.string().max(10240).optional(),
})

export type PatchPost = z.infer<typeof PatchPostModel>
