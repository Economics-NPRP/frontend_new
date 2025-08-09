import { InferInput, InferOutput, object } from 'valibot';

import { UuidSchema } from '@/schema/utils';

export const BaseEmissionDataSchema = object({
	id: UuidSchema(),
});

// export const CreateEmissionDataSchema = object({
// 	...omit(BaseEmissionDataSchema, [
// 		'id',

// 		'title',
// 		'image',
// 		'description',

// 		'bidsCount',
// 		'biddersCount',
// 		'views',
// 		'bookmarks',

// 		'isVisible',
// 		'createdAt',
// 		'startDatetime',
// 		'endDatetime',
// 		'hasJoined',
// 	]).entries,

// 	subsector: UuidSchema(),
// 	startDatetime: string(),
// 	endDatetime: string(),
// });
// export const CreateEmissionDataSchemaTransformer = pipe(
// 	CreateEmissionDataSchema,
// 	transform((input) => ({
// 		...input,

// 		startDatetime: DateTime.fromISO(input.startDatetime).toISO(),
// 		endDatetime: DateTime.fromISO(input.endDatetime).toISO(),
// 	})),
// );

export const ReadEmissionDataSchema = object({
	...BaseEmissionDataSchema.entries,
});
export const CreateEmissionDataSchema = BaseEmissionDataSchema;
export const CreateEmissionDataSchemaTransformer = BaseEmissionDataSchema;
export const UpdateEmissionDataSchema = CreateEmissionDataSchema;

export interface IBaseEmissionData extends InferOutput<typeof BaseEmissionDataSchema> {}
export interface ICreateEmission extends InferInput<typeof CreateEmissionDataSchema> {}
export interface ICreateEmissionOutput
	extends InferOutput<typeof CreateEmissionDataSchemaTransformer> {}
export interface IEmissionData extends InferOutput<typeof ReadEmissionDataSchema> {}
export interface IUpdateEmission extends InferInput<typeof UpdateEmissionDataSchema> {}

export const DefaultEmissionData: IEmissionData = {
	id: '',
};

export const DefaultCreateEmission: ICreateEmission = {
	id: '',
};
