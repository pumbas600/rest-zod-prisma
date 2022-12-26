// @ts-ignore Importing package.json for automated synchronization of version numbers
import { version } from '../package.json'

import { generatorHandler } from '@prisma/generator-helper'
import { SemicolonPreference } from 'typescript'
import { configSchema, PrismaOptions } from './config'
import { populateModelFile, generateBarrelFile } from './generator'
import { Project } from 'ts-morph'
import { Variants } from './variants'
import { getFileName } from './util'

generatorHandler({
	onManifest() {
		return {
			version,
			prettyName: 'Zod Schemas',
			defaultOutput: 'zod',
		}
	},
	onGenerate(options) {
		const project = new Project()

		const models = options.dmmf.datamodel.models

		const { schemaPath } = options
		const outputPath = options.generator.output!.value
		const clientPath = options.otherGenerators.find(
			(each) => each.provider.value === 'prisma-client-js'
		)!.output!.value!

		const results = configSchema.safeParse(options.generator.config)
		if (!results.success)
			throw new Error(
				'Incorrect config provided. Please check the values you provided and try again.'
			)

		const config = results.data
		const prismaOptions: PrismaOptions = {
			clientPath,
			outputPath,
			schemaPath,
		}

		const indexFile = project.createSourceFile(
			`${outputPath}/index.ts`,
			{},
			{ overwrite: true }
		)

		generateBarrelFile(models, indexFile)

		indexFile.formatText({
			indentSize: 2,
			convertTabsToSpaces: true,
			semicolons: SemicolonPreference.Remove,
		})

		models.forEach((model) => {
			Object.values(Variants).forEach((variant) => {
				const sourceFile = project.createSourceFile(
					`${outputPath}/${getFileName(variant, model)}.ts`,
					{},
					{ overwrite: true }
				)

				populateModelFile(model, sourceFile, config, variant, prismaOptions)

				sourceFile.formatText({
					indentSize: 4,
					convertTabsToSpaces: true,
					semicolons: SemicolonPreference.Insert,
				})
			})
		})

		return project.save()
	},
})
