import * as z from "zod"
import { Status } from "../prisma/.client"

export const PatchDocumentModel = z.object({
  filename: z.string().optional(),
  author: z.string().optional(),
  contents: z.string().optional(),
  status: z.nativeEnum(Status).optional(),
  created: z.date().optional(),
  updated: z.date().optional(),
})
