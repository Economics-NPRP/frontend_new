import { snakeCase } from 'change-case';
import { omit as _omit } from 'lodash-es';
import {
	InferInput,
	InferOutput,
	array,
	lazy,
	minLength,
	nonEmpty,
	object,
	omit,
	partial,
	picklist,
	pipe,
	regex,
	string,
	transform,
	trim,
	url,
} from 'valibot';

import {
	AgricultureSubsectorList,
	BuildingsSubsectorList,
	EnergySubsectorList,
	IndustrySubsectorList,
	TransportSubsectorList,
	WasteSubsectorList,
} from '@/constants/SubsectorData';
import { TimestampSchema, UuidSchema } from '@/schema/utils';

import { SectorTypeSchema } from './SectorData';

export const imageRegex = new RegExp(
	/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+\-*.~#?&\/=]*)$/,
);

export const BaseSubsectorDataSchema = object({
	sector: lazy(() => SectorTypeSchema),
	name: pipe(string(), trim(), nonEmpty()),
	title: pipe(string(), trim(), nonEmpty()),
	description: pipe(string(), trim(), nonEmpty(), minLength(20)),
	image: pipe(string(), trim(), url(), regex(imageRegex)),
	alt: pipe(string(), trim(), nonEmpty()),
	keywords: array(pipe(string(), trim(), nonEmpty())),
});

export const CreateSubsectorDataSchema = omit(BaseSubsectorDataSchema, ['name']);
export const CreateSubsectorDataSchemaTransformer = pipe(
	CreateSubsectorDataSchema,
	transform((input) => ({
		...input,

		name: snakeCase(input.title),
	})),
);
export const ReadSubsectorDataSchema = object({
	...BaseSubsectorDataSchema.entries,

	id: UuidSchema(),
	createdAt: TimestampSchema(),
	updatedAt: TimestampSchema(),
});
export const UpdateSubsectorDataSchema = CreateSubsectorDataSchema;

//	TODO: remove default alt and keywords once backend has them
//	TODO: remove partial
export const ReadToCreateSubsectorDataTransformer = pipe(
	partial(ReadSubsectorDataSchema, ['id', 'createdAt', 'updatedAt']),
	transform((input) => ({
		..._omit(input, ['id', 'name', 'createdAt', 'updatedAt']),

		alt: DefaultCreateSubsector.alt,
		keywords: DefaultCreateSubsector.keywords,
	})),
);

export const EnergySubsectorTypeSchema = pipe(picklist(EnergySubsectorList), nonEmpty());
export const IndustrySubsectorTypeSchema = pipe(picklist(IndustrySubsectorList), nonEmpty());
export const TransportSubsectorTypeSchema = pipe(picklist(TransportSubsectorList), nonEmpty());
export const BuildingsSubsectorTypeSchema = pipe(picklist(BuildingsSubsectorList), nonEmpty());
export const AgricultureSubsectorTypeSchema = pipe(picklist(AgricultureSubsectorList), nonEmpty());
export const WasteSubsectorTypeSchema = pipe(picklist(WasteSubsectorList), nonEmpty());

export const SubsectorTypeSchema = pipe(
	picklist([
		...EnergySubsectorList,
		...IndustrySubsectorList,
		...TransportSubsectorList,
		...BuildingsSubsectorList,
		...AgricultureSubsectorList,
		...WasteSubsectorList,
	]),
	nonEmpty(),
);

export interface IBaseSubsectorData extends InferOutput<typeof BaseSubsectorDataSchema> {}
export interface ICreateSubsector extends InferInput<typeof CreateSubsectorDataSchema> {}
export interface ICreateSubsectorOutput
	extends InferOutput<typeof CreateSubsectorDataSchemaTransformer> {}
export interface ISubsectorData extends InferOutput<typeof ReadSubsectorDataSchema> {}
export interface IUpdateSubsector extends InferInput<typeof UpdateSubsectorDataSchema> {}

export type EnergySubsectorType = InferOutput<typeof EnergySubsectorTypeSchema>;
export type IndustrySubsectorType = InferOutput<typeof IndustrySubsectorTypeSchema>;
export type TransportSubsectorType = InferOutput<typeof TransportSubsectorTypeSchema>;
export type BuildingsSubsectorType = InferOutput<typeof BuildingsSubsectorTypeSchema>;
export type AgricultureSubsectorType = InferOutput<typeof AgricultureSubsectorTypeSchema>;
export type WasteSubsectorType = InferOutput<typeof WasteSubsectorTypeSchema>;

export type SubsectorType =
	| EnergySubsectorType
	| IndustrySubsectorType
	| TransportSubsectorType
	| BuildingsSubsectorType
	| AgricultureSubsectorType
	| WasteSubsectorType;

export const DefaultSubsectorData: ISubsectorData = {
	id: '',
	name: '',
	sector: 'energy',
	title: '',
	description: '',
	image: '',
	alt: '',
	keywords: [],
	createdAt: '1970-01-01T00:00:00.000Z',
	updatedAt: '1970-01-01T00:00:00.000Z',
};

export const DefaultCreateSubsector: ICreateSubsector = {
	sector: 'energy',
	title: '',
	description: '',
	image: '',
	alt: '',
	keywords: [],
};
