import * as z from "zod"
import { Status } from "../prisma/.client"

export const CreateDocumentModel = z.object({
  filename: z.string(),
  author: z.string(),
  contents: z.string(),
  status: z.nativeEnum(Status),
  created: z.date().optional(),
  updated: z.date().optional(),
})
