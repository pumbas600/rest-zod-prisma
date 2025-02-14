import { DMMF } from '@prisma/generator-helper'
import type { CodeBlockWriter } from 'ts-morph'
import { Config } from './config'
import { Variant } from './variants'

export const writeArray = (writer: CodeBlockWriter, array: string[], newLine = true) =>
	array.forEach((line) => writer.write(line).conditionalNewLine(newLine))

export const getModelType = (modelName: string) => {
	return `z.infer<typeof ${modelName}>`
}

export const getFilename = (variant: Variant, model: DMMF.Model) => {
	return lowercaseFirstLetter(variant.name + model.name)
}

export const lowercaseFirstLetter = (string: string) => {
	return string.slice(0, 1).toLowerCase() + string.slice(1)
}

export const useModelNames = (
	{ modelCase, modelSuffix, relationModel }: Config,
	variant: Variant
) => {
	const formatModelName = (name: string, prefix = '') => {
		if (modelCase === 'camelCase') {
			name = name.slice(0, 1).toLowerCase() + name.slice(1)
		}
		return `${prefix}${name}${modelSuffix}`
	}

	return {
		modelName: (name: string) =>
			formatModelName(variant.name + name, relationModel === 'default' ? '_' : ''),
		relatedModelName: (name: string | DMMF.SchemaEnum | DMMF.OutputType | DMMF.SchemaArg) =>
			formatModelName(
				relationModel === 'default'
					? variant.name + name.toString()
					: `Related${variant.name + name.toString()}`
			),
	}
}

export const needsRelatedModel = (model: DMMF.Model, config: Config) =>
	model.fields.some((field) => field.kind === 'object') && config.relationModel !== false

export const chunk = <T extends any[]>(input: T, size: number): T[] => {
	return input.reduce((arr, item, idx) => {
		return idx % size === 0
			? [...arr, [item]]
			: [...arr.slice(0, -1), [...arr.slice(-1)[0], item]]
	}, [])
}

export const dotSlash = (input: string) => {
	const converted = input
		.replace(/^\\\\\?\\/, '')
		.replace(/\\/g, '/')
		.replace(/\/\/+/g, '/')

	if (converted.includes(`/node_modules/`)) return converted.split(`/node_modules/`).slice(-1)[0]

	if (converted.startsWith(`../`)) return converted

	return './' + converted
}
