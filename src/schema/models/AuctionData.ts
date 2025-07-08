import {
	InferInput,
	InferOutput,
	boolean,
	nonEmpty,
	nullish,
	object,
	omit,
	pipe,
	string,
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

export const CreateAuctionDataSchema = omit(BaseAuctionDataSchema, [
	'id',

	'bidsCount',
	'biddersCount',
	'views',
	'bookmarks',

	'isVisible',
	'createdAt',
	'hasJoined',

	'owner',
]);

export const ReadAuctionDataSchema = BaseAuctionDataSchema;
export const UpdateAuctionDataSchema = CreateAuctionDataSchema;

export interface IAuctionData extends InferOutput<typeof BaseAuctionDataSchema> {}
export interface ICreateAuction extends InferInput<typeof CreateAuctionDataSchema> {}
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
	startDatetime: '1970-01-01T00:00:00.000Z',
	endDatetime: '1970-01-01T00:00:00.000Z',
};
