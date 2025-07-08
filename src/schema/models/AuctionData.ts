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
	pick,
	pipe,
	string,
	transform,
	trim,
	url,
} from 'valibot';

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

const CreateAuctionDataSchemaObject = object({
	...omit(BaseAuctionDataSchema, [
		'id',

		'bidsCount',
		'biddersCount',
		'views',
		'bookmarks',

		'isVisible',
		'createdAt',
		'hasJoined',
		'startDatetime',
		'endDatetime',

		'owner',
	]).entries,

	startDatetime: pipe(date(), minValue(new Date())),
	endDatetime: pipe(date(), minValue(new Date())),
});
export const CreateAuctionDataSchema = pipe(
	CreateAuctionDataSchemaObject,
	transform((input) => ({
		...input,
		startDatetime: DateTime.fromJSDate(input.startDatetime).toISO(),
		endDatetime: DateTime.fromJSDate(input.endDatetime).toISO(),
	})),
);

export const ReadAuctionDataSchema = BaseAuctionDataSchema;
export const UpdateAuctionDataSchema = CreateAuctionDataSchemaObject;

export const DetailsAuctionDataSchema = pipe(
	pick(CreateAuctionDataSchemaObject, ['startDatetime', 'endDatetime']),
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
export interface ICreateAuction extends InferInput<typeof CreateAuctionDataSchemaObject> {}
export interface ICreateAuctionOutput extends InferOutput<typeof CreateAuctionDataSchemaObject> {}
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
	type: 'open',
	isPrimaryMarket: false,
	title: '',
	image: null,
	description: null,
	permits: 0,
	minBid: 0,
	startDatetime: new Date(),
	endDatetime: new Date(),
};
