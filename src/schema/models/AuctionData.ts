import { DateTime } from 'luxon';
import {
	InferInput,
	InferOutput,
	boolean,
	date,
	forward,
	lazy,
	minValue,
	nonEmpty,
	nullish,
	number,
	object,
	omit,
	partialCheck,
	pick,
	pipe,
	string,
	transform,
	trim,
	url,
} from 'valibot';

import { AllSubsectorVariants } from '@/constants/SubsectorData';
import { PositiveNumberSchema, TimestampSchema, UuidSchema } from '@/schema/utils';

import { BaseAuctionCycleDataSchema } from './AuctionCycleData';
import { AuctionTypeSchema } from './AuctionType';
import { DefaultUserData } from './GeneralUserData';
import { SectorTypeSchema } from './SectorData';
import { SubsectorTypeSchema } from './SubsectorData';
import { BaseUserDataSchema } from './UserData';

export const BaseAuctionDataSchema = object({
	id: UuidSchema(),
	ownerId: UuidSchema(),
	cycleId: UuidSchema(),
	emissionId: number(),
	sector: SectorTypeSchema,
	type: AuctionTypeSchema,
	isPrimaryMarket: boolean(),

	title: pipe(string(), trim(), nonEmpty()),
	image: nullish(pipe(string(), trim(), url())),
	description: nullish(pipe(string(), trim())),
	permits: PositiveNumberSchema(),
	bidsCount: PositiveNumberSchema(true),
	biddersCount: PositiveNumberSchema(true),
	minBid: PositiveNumberSchema(),
	views: PositiveNumberSchema(true),
	bookmarks: PositiveNumberSchema(true),

	isVisible: boolean(),
	createdAt: TimestampSchema(),
	startDatetime: TimestampSchema(),
	endDatetime: TimestampSchema(),
	hasJoined: nullish(boolean()),
});

export const CreateAuctionDataSchema = object({
	...omit(BaseAuctionDataSchema, [
		'id',

		'title',
		'image',
		'description',

		'bidsCount',
		'biddersCount',
		'views',
		'bookmarks',

		'isVisible',
		'createdAt',
		'startDatetime',
		'endDatetime',
		'hasJoined',
	]).entries,

	subsector: SubsectorTypeSchema,
	startDatetime: pipe(date(), minValue(new Date())),
	endDatetime: pipe(date(), minValue(new Date())),
});
export const CreateAuctionDataSchemaTransformer = pipe(
	CreateAuctionDataSchema,
	transform((input) => ({
		...input,
		subsector: undefined,

		startDatetime: DateTime.fromJSDate(input.startDatetime).toISO(),
		endDatetime: DateTime.fromJSDate(input.endDatetime).toISO(),
		image: AllSubsectorVariants[input.subsector]?.image,
		title: AllSubsectorVariants[input.subsector]?.title,
		description: AllSubsectorVariants[input.subsector]?.description,
	})),
);

export const ReadAuctionDataSchema = object({
	...BaseAuctionDataSchema.entries,

	owner: BaseUserDataSchema,
	cycle: lazy(() => nullish(BaseAuctionCycleDataSchema)),
});
export const UpdateAuctionDataSchema = CreateAuctionDataSchema;

export const SectorAuctionDataSchema = pick(CreateAuctionDataSchema, ['sector']);
export const SubsectorAuctionDataSchema = pick(CreateAuctionDataSchema, ['subsector']);
export const DetailsAuctionDataSchema = pipe(
	omit(CreateAuctionDataSchema, [
		'cycleId',
		'isPrimaryMarket',
		'ownerId',
		'emissionId',
		'sector',
		'subsector',
	]),
	forward(
		partialCheck(
			[['startDatetime'], ['endDatetime']],
			(input) => input.startDatetime <= input.endDatetime,
			'The start date must be before the end date.',
		),
		['startDatetime'],
	),
);

export interface IBaseAuctionData extends InferOutput<typeof BaseAuctionDataSchema> {}
export interface ICreateAuction extends InferInput<typeof CreateAuctionDataSchema> {}
export interface ICreateAuctionOutput
	extends InferOutput<typeof CreateAuctionDataSchemaTransformer> {}
export interface IAuctionData extends InferOutput<typeof ReadAuctionDataSchema> {}
export interface IUpdateAuction extends InferInput<typeof UpdateAuctionDataSchema> {}

export const DefaultAuctionData: IAuctionData = {
	id: '',
	ownerId: '',
	cycleId: '',
	emissionId: 1,
	sector: 'energy',
	type: 'open',
	isPrimaryMarket: false,
	title: '',
	image: null,
	description: null,
	permits: 0,
	bidsCount: 0,
	biddersCount: 0,
	minBid: 0,
	views: 0,
	bookmarks: 0,
	isVisible: false,
	createdAt: '1970-01-01T00:00:00.000Z',
	startDatetime: '1970-01-01T00:00:00.000Z',
	endDatetime: '1970-01-01T00:00:00.000Z',
	hasJoined: null,
	owner: DefaultUserData,
	cycle: null,
};

export const DefaultCreateAuctionData: ICreateAuction = {
	ownerId: '',
	cycleId: '',
	emissionId: 1,
	sector: 'energy',
	subsector: 'gasTurbine',
	type: 'open',
	isPrimaryMarket: false,
	permits: 0,
	minBid: 0,
	startDatetime: new Date(),
	endDatetime: new Date(),
};
