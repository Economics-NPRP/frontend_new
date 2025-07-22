import {
	InferInput,
	InferOutput,
	array,
	maxLength,
	minLength,
	nonEmpty,
	object,
	picklist,
	pipe,
} from 'valibot';

import { SectorList } from '@/constants/SectorData';

import { ReadSubsectorDataSchema } from './SubsectorData';

export const SectorTypeSchema = pipe(picklist(SectorList), nonEmpty());

export const SectorListSchema = pipe(
	array(picklist(SectorList)),
	nonEmpty(),
	minLength(1),
	maxLength(6),
);

export const BaseSectorDataSchema = object({
	sector: SectorTypeSchema,
	subsectors: array(ReadSubsectorDataSchema),
});

export const CreateSectorDataSchema = BaseSectorDataSchema;
export const ReadSectorDataSchema = BaseSectorDataSchema;
export const UpdateSectorDataSchema = BaseSectorDataSchema;

export interface IBaseSectorData extends InferOutput<typeof BaseSectorDataSchema> {}
export interface ICreateSector extends InferInput<typeof CreateSectorDataSchema> {}
export interface ISectorData extends InferOutput<typeof ReadSectorDataSchema> {}
export interface IUpdateSector extends InferInput<typeof UpdateSectorDataSchema> {}

export type SectorType = InferOutput<typeof SectorTypeSchema>;

export const DefaultSectorData: ISectorData = {
	sector: 'energy',
	subsectors: [],
};
