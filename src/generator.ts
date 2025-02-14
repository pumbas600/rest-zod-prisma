import path from 'path'
import { DMMF } from '@prisma/generator-helper'
import {
	ImportDeclarationStructure,
	SourceFile,
	StructureKind,
	VariableDeclarationKind,
} from 'ts-morph'
import { Config, PrismaOptions } from './config'
import {
	dotSlash,
	getFilename,
	getModelType,
	needsRelatedModel,
	useModelNames,
	writeArray,
} from './util'
import { getJSDocs } from './docs'
import { getZodConstructor } from './types'
import { Variant, Variants } from './variants'

export const writeImportsForModel = (
	model: DMMF.Model,
	sourceFile: SourceFile,
	config: Config,
	variant: Variant,
	{ schemaPath, outputPath, clientPath }: PrismaOptions
) => {
	const { relatedModelName } = useModelNames(config, variant)
	const importList: ImportDeclarationStructure[] = [
		{
			kind: StructureKind.ImportDeclaration,
			namespaceImport: 'z',
			moduleSpecifier: 'zod',
		},
	]

	if (config.imports) {
		importList.push({
			kind: StructureKind.ImportDeclaration,
			namespaceImport: 'imports',
			moduleSpecifier: dotSlash(
				path.relative(outputPath, path.resolve(path.dirname(schemaPath), config.imports))
			),
		})
	}

	if (config.useDecimalJs && model.fields.some((f) => f.type === 'Decimal')) {
		importList.push({
			kind: StructureKind.ImportDeclaration,
			namedImports: ['Decimal'],
			moduleSpecifier: 'decimal.js',
		})
	}

	const enumFields = model.fields.filter((f) => f.kind === 'enum')
	const relationFields = model.fields.filter((f) => f.kind === 'object')
	const relativePath = path.relative(outputPath, clientPath)

	if (enumFields.length > 0) {
		importList.push({
			kind: StructureKind.ImportDeclaration,
			isTypeOnly: enumFields.length === 0,
			moduleSpecifier: dotSlash(relativePath),
			namedImports: enumFields.map((f) => f.type),
		})
	}

	if (config.relationModel !== false && relationFields.length > 0) {
		const filteredFields = relationFields.filter((f) => f.type !== model.name)

		if (filteredFields.length > 0) {
			importList.push({
				kind: StructureKind.ImportDeclaration,
				moduleSpecifier: './index',
				namedImports: Array.from(
					new Set(
						filteredFields.flatMap((f) => [
							`Complete${variant.name + f.type}`,
							relatedModelName(f.type),
						])
					)
				),
			})
		}
	}

	sourceFile.addImportDeclarations(importList)
}

export const writeTypeSpecificSchemas = (
	model: DMMF.Model,
	sourceFile: SourceFile,
	config: Config,
	_prismaOptions: PrismaOptions
) => {
	if (model.fields.some((f) => f.type === 'Json')) {
		sourceFile.addStatements((writer) => {
			writer.newLine()
			writeArray(writer, [
				'// Helper schema for JSON fields',
				`type Literal = boolean | number | string${
					config.prismaJsonNullability ? '' : '| null'
				}`,
				'type Json = Literal | { [key: string]: Json } | Json[]',
				`const literalSchema = z.union([z.string(), z.number(), z.boolean()${
					config.prismaJsonNullability ? '' : ', z.null()'
				}])`,
				'const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))',
			])
		})
	}

	if (config.useDecimalJs && model.fields.some((f) => f.type === 'Decimal')) {
		sourceFile.addStatements((writer) => {
			writer.newLine()
			writeArray(writer, [
				'// Helper schema for Decimal fields',
				'z',
				'.instanceof(Decimal)',
				'.or(z.string())',
				'.or(z.number())',
				'.refine((value) => {',
				'  try {',
				'    return new Decimal(value);',
				'  } catch (error) {',
				'    return false;',
				'  }',
				'})',
				'.transform((value) => new Decimal(value));',
			])
		})
	}
}

export const generateSchemaForModel = (
	model: DMMF.Model,
	sourceFile: SourceFile,
	config: Config,
	variant: Variant,
	_prismaOptions: PrismaOptions
) => {
	const { modelName } = useModelNames(config, variant)

	sourceFile.addVariableStatement({
		declarationKind: VariableDeclarationKind.Const,
		isExported: true,
		leadingTrivia: (writer) => writer.blankLineIfLastNot(),
		declarations: [
			{
				name: modelName(model.name),
				initializer(writer) {
					writer
						.write('z.object(')
						.inlineBlock(() => {
							model.fields
								.filter((f) => f.kind !== 'object' && !variant.isIgnored(f))
								.forEach((field) => {
									writeArray(writer, getJSDocs(field.documentation))
									writer
										.write(
											`${field.name}: ${getZodConstructor(field, variant)}`
										)
										.write(',')
										.newLine()
								})
						})
						.write(')')
				},
			},
		],
	})

	if (!variant.exportType) return

	sourceFile.addTypeAlias({
		isExported: true,
		name: variant.name + model.name,
		type: getModelType(modelName(model.name)),
	})
}

export const generateRelatedSchemaForModel = (
	model: DMMF.Model,
	sourceFile: SourceFile,
	config: Config,
	variant: Variant,
	_prismaOptions: PrismaOptions
) => {
	const { modelName, relatedModelName } = useModelNames(config, variant)

	const relationFields = model.fields.filter((f) => f.kind === 'object' && !variant.isIgnored(f))

	sourceFile.addInterface({
		name: `Complete${variant.name + model.name}`,
		isExported: true,
		extends: [getModelType(modelName(model.name))],
		properties: relationFields.map((f) => ({
			hasQuestionToken: !f.isRequired || variant.isOptional(f),
			name: f.name,
			type: `Complete${variant.name + f.type}${f.isList ? '[]' : ''}${
				!f.isRequired ? ' | null' : ''
			}`,
		})),
	})

	sourceFile.addStatements((writer) =>
		writeArray(writer, [
			'',
			'/**',
			` * ${relatedModelName(
				model.name
			)} contains all relations on your model in addition to the scalars`,
			' *',
			' * NOTE: Lazy required in case of potential circular dependencies within schema',
			' */',
		])
	)

	sourceFile.addVariableStatement({
		declarationKind: VariableDeclarationKind.Const,
		isExported: true,
		declarations: [
			{
				name: relatedModelName(model.name),
				type: `z.ZodSchema<Complete${variant.name + model.name}>`,
				initializer(writer) {
					writer
						.write(`z.lazy(() => ${modelName(model.name)}.extend(`)
						.inlineBlock(() => {
							relationFields.forEach((field) => {
								writeArray(writer, getJSDocs(field.documentation))

								writer
									.write(
										`${field.name}: ${getZodConstructor(
											field,
											variant,
											relatedModelName
										)}`
									)
									.write(',')
									.newLine()
							})
						})
						.write('))')
				},
			},
		],
	})
}

export const populateModelFile = (
	model: DMMF.Model,
	sourceFile: SourceFile,
	config: Config,
	variant: Variant,
	prismaOptions: PrismaOptions
) => {
	writeImportsForModel(model, sourceFile, config, variant, prismaOptions)
	writeTypeSpecificSchemas(model, sourceFile, config, prismaOptions)
	generateSchemaForModel(model, sourceFile, config, variant, prismaOptions)
	if (needsRelatedModel(model, config))
		generateRelatedSchemaForModel(model, sourceFile, config, variant, prismaOptions)
}

export const generateBarrelFile = (models: DMMF.Model[], indexFile: SourceFile) => {
	models.forEach((model) =>
		Object.values(Variants).forEach((variant) => {
			indexFile.addExportDeclaration({
				moduleSpecifier: `./${getFilename(variant, model)}`,
			})
		})
	)
}
