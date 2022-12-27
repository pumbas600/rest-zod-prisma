import * as z from "zod"
import { CompleteCreateSpreadsheet, RelatedCreateSpreadsheetModel } from "./index"

export const CreatePresentationModel = z.object({
  filename: z.string(),
  author: z.string(),
  contents: z.string().array(),
  created: z.date().optional(),
  updated: z.date().optional(),
})

export type CreatePresentation = z.infer<typeof CreatePresentationModel>

export interface CompleteCreatePresentation extends z.infer<typeof CreatePresentationModel> {
  spreadsheets: CompleteCreateSpreadsheet[]
}

/**
 * RelatedCreatePresentationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCreatePresentationModel: z.ZodSchema<CompleteCreatePresentation> = z.lazy(() => CreatePresentationModel.extend({
  spreadsheets: RelatedCreateSpreadsheetModel.array(),
}))
