import { DMMF } from '@prisma/generator-helper'

export interface Variant {
	name: string
	isIgnored(field: DMMF.Field): boolean
	isOptional(field: DMMF.Field): boolean
}

export const Variants: Record<string, Variant> = {
	Default: {
		name: 'Default',
		isIgnored: () => false,
		isOptional: () => false,
	},
	Create: {
		name: 'Create',
		isIgnored: (field) => field.isId && field.hasDefaultValue,
		isOptional: (field) => field.hasDefaultValue,
	},
	Patch: {
		name: 'Patch',
		isIgnored: (field) => field.isId,
		isOptional: () => true,
	},
} as const
