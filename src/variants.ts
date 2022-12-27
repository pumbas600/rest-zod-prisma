import { DMMF } from '@prisma/generator-helper'

export interface Variant {
	name: string
	exportType: boolean
	isIgnored(field: DMMF.Field): boolean
	isOptional(field: DMMF.Field): boolean
}

export const Variants: Record<string, Variant> = {
	Default: {
		name: '',
		exportType: false,
		isIgnored: () => false,
		isOptional: () => false,
	},
	Create: {
		name: 'Create',
		exportType: true,
		isIgnored: (field) => field.isId && field.hasDefaultValue,
		isOptional: (field) => field.hasDefaultValue,
	},
	Patch: {
		name: 'Patch',
		exportType: true,
		isIgnored: (field) => field.isId,
		isOptional: () => true,
	},
} as const
