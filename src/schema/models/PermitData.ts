import {
	InferInput,
	InferOutput,
	array,
	lazy,
	maxValue,
	minValue,
	nullish,
	number,
	object,
	pipe,
} from 'valibot';

import { PositiveNumberSchema, TimestampSchema, UuidSchema } from '@/schema/utils';

import { ReadAuctionDataSchema } from './AuctionData';
import { BaseFirmDataSchema, DefaultFirmData } from './FirmData';
import { SectorTypeSchema } from './SectorData';

export const BasePermitDataSchema = object({
	id: UuidSchema(),

	sector: SectorTypeSchema,
	scope: pipe(number(), minValue(1), maxValue(3)),
	capacity: PositiveNumberSchema(true),

	linkedEmissions: array(UuidSchema()),
	previousAuctions: array(UuidSchema()),
	previousOwners: array(UuidSchema()),

	obtainDate: TimestampSchema(),
	expiryDate: TimestampSchema(),
	releaseDate: TimestampSchema(),
});

// export const CreatePermitDataSchema = object({
// 	...omit(BasePermitDataSchema, [
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
// export const CreatePermitDataSchemaTransformer = pipe(
// 	CreatePermitDataSchema,
// 	transform((input) => ({
// 		...input,

// 		startDatetime: DateTime.fromISO(input.startDatetime).toISO(),
// 		endDatetime: DateTime.fromISO(input.endDatetime).toISO(),
// 	})),
// );

export const ReadPermitDataSchema = object({
	...BasePermitDataSchema.entries,

	auctionId: nullish(UuidSchema()),
	ownerId: UuidSchema(),

	usage: PositiveNumberSchema(true),
	cost: PositiveNumberSchema(true),

	auction: lazy(() => nullish(ReadAuctionDataSchema)),
	owner: lazy(() => BaseFirmDataSchema),
});
export const CreatePermitDataSchema = BasePermitDataSchema;
export const CreatePermitDataSchemaTransformer = BasePermitDataSchema;
export const UpdatePermitDataSchema = CreatePermitDataSchema;

export interface IBasePermitData extends InferOutput<typeof BasePermitDataSchema> {}
export interface ICreatePermit extends InferInput<typeof CreatePermitDataSchema> {}
export interface ICreatePermitOutput
	extends InferOutput<typeof CreatePermitDataSchemaTransformer> {}
export interface IPermitData extends InferOutput<typeof ReadPermitDataSchema> {}
export interface IUpdatePermit extends InferInput<typeof UpdatePermitDataSchema> {}

export const DefaultPermitData: IPermitData = {
	id: '',
	auctionId: '',
	ownerId: '',

	sector: 'energy',
	scope: 1,
	capacity: 0,
	usage: 0,
	cost: 0,

	linkedEmissions: [],
	previousAuctions: [],
	previousOwners: [],

	obtainDate: new Date().toISOString(),
	expiryDate: new Date().toISOString(),
	releaseDate: new Date().toISOString(),

	auction: null,
	owner: DefaultFirmData,
};

export const DefaultCreatePermitData: ICreatePermit = {
	id: '',

	sector: 'energy',
	scope: 1,
	capacity: 0,

	linkedEmissions: [],
	previousAuctions: [],
	previousOwners: [],

	obtainDate: new Date().toISOString(),
	expiryDate: new Date().toISOString(),
	releaseDate: new Date().toISOString(),
};
