import * as z from "zod"
import { CompletePatchSpreadsheet, RelatedPatchSpreadsheetModel } from "./index"

export const PatchPresentationModel = z.object({
  filename: z.string().optional(),
  author: z.string().optional(),
  contents: z.string().array().optional(),
  created: z.date().optional(),
  updated: z.date().optional(),
})

export interface CompletePatchPresentation extends z.infer<typeof PatchPresentationModel> {
  spreadsheets?: CompletePatchSpreadsheet[]
}

/**
 * RelatedPatchPresentationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPatchPresentationModel: z.ZodSchema<CompletePatchPresentation> = z.lazy(() => PatchPresentationModel.extend({
  spreadsheets: RelatedPatchSpreadsheetModel.array().optional(),
}))
