import { DMMF } from '@prisma/generator-helper'
import { getZodConstructor } from '../types'
import { Variants } from '../variants'

describe('types Package', () => {
	test('getZodConstructor', () => {
		const field: DMMF.Field = {
			hasDefaultValue: false,
			isGenerated: false,
			isId: false,
			isList: true,
			isRequired: false,
			isReadOnly: false,
			isUpdatedAt: false,
			isUnique: false,
			kind: 'scalar',
			name: 'nameList',
			type: 'String',
			documentation: ['@zod.max(64)', '@zod.min(1)'].join('\n'),
		}

		const constructor = getZodConstructor(field, Variants.Default)

		expect(constructor).toBe('z.string().array().max(64).min(1).nullish()')
	})

	test('regression - unknown type', () => {
		const field: DMMF.Field = {
			hasDefaultValue: false,
			isGenerated: false,
			isId: false,
			isList: false,
			isRequired: true,
			isUnique: false,
			isReadOnly: false,
			isUpdatedAt: false,
			kind: 'scalar',
			name: 'aField',
			type: 'SomeUnknownType',
		}

		const constructor = getZodConstructor(field, Variants.Default)

		expect(constructor).toBe('z.unknown()')
	})
})
