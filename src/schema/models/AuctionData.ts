import { DateTime } from 'luxon';
import {
	InferInput,
	InferOutput,
	boolean,
	date,
	forward,
	minValue,
	nonEmpty,
	nullish,
	object,
	omit,
	partialCheck,
	pipe,
	string,
	transform,
	trim,
	url,
} from 'valibot';

import { AllSubsectorVariants } from '@/constants/SubsectorData';
import { SubsectorTypeSchema } from '@/schema/models/SubsectorData';
import { PositiveNumberSchema, TimestampSchema, UuidSchema } from '@/schema/utils';

import { AuctionTypeSchema } from './AuctionType';
import { DefaultUserData } from './GeneralUserData';
import { SectorTypeSchema } from './SectorData';
import { BaseUserDataSchema } from './UserData';

//	TODO: Check why path alias is not working

export const BaseAuctionDataSchema = object({
	id: UuidSchema(),
	ownerId: UuidSchema(),
	cycleId: UuidSchema(),
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

	owner: BaseUserDataSchema,
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

		'owner',
	]).entries,

	subsector: SubsectorTypeSchema,
	startDatetime: pipe(date(), minValue(new Date())),
	endDatetime: pipe(date(), minValue(new Date())),
});
export const CreateAuctionDataSchemaTransformer = pipe(
	CreateAuctionDataSchema,
	transform((input) => ({
		...input,
		startDatetime: DateTime.fromJSDate(input.startDatetime).toISO(),
		endDatetime: DateTime.fromJSDate(input.endDatetime).toISO(),
		image: AllSubsectorVariants[input.subsector]?.image,
		title: AllSubsectorVariants[input.subsector]?.title,
		description: AllSubsectorVariants[input.subsector]?.description,
	})),
);

export const ReadAuctionDataSchema = BaseAuctionDataSchema;
export const UpdateAuctionDataSchema = CreateAuctionDataSchema;

export const DetailsAuctionDataSchema = pipe(
	omit(CreateAuctionDataSchema, ['cycleId', 'isPrimaryMarket', 'ownerId', 'sector', 'subsector']),
	forward(
		partialCheck(
			[['startDatetime'], ['endDatetime']],
			(input) => input.startDatetime <= input.endDatetime,
			'The start date must be before the end date.',
		),
		['startDatetime'],
	),
);

export interface IAuctionData extends InferOutput<typeof BaseAuctionDataSchema> {}
export interface ICreateAuction extends InferInput<typeof CreateAuctionDataSchema> {}
export interface ICreateAuctionOutput
	extends InferOutput<typeof CreateAuctionDataSchemaTransformer> {}
export interface IReadAuction extends InferInput<typeof ReadAuctionDataSchema> {}
export interface IUpdateAuction extends InferInput<typeof UpdateAuctionDataSchema> {}

export const DefaultAuctionData: IAuctionData = {
	id: '',
	ownerId: '',
	cycleId: '',
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
};

export const DefaultCreateAuctionData: ICreateAuction = {
	ownerId: '',
	cycleId: '',
	sector: 'energy',
	subsector: 'gasTurbine',
	type: 'open',
	isPrimaryMarket: false,
	permits: 0,
	minBid: 0,
	startDatetime: new Date(),
	endDatetime: new Date(),
};
