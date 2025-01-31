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

import { AuctionTypeSchema, BaseUserDataSchema } from '@/schema/models';
import { PositiveNumberSchema, TimestampSchema, UuidSchema } from '@/schema/utils';

export const BaseAuctionDataSchema = object({
	id: UuidSchema(),
	ownerId: UuidSchema(),
	//	TODO: Uncomment when sectors are added
	// sectorId: UuidSchema('sectorId'),
	type: AuctionTypeSchema,
	isPrimaryMarket: boolean(),

	title: pipe(string(), trim(), nonEmpty()),
	image: nullish(pipe(string(), trim(), url())),
	description: nullish(pipe(string(), trim())),
	permits: PositiveNumberSchema(),
	bids: PositiveNumberSchema(true),
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

	'bids',
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
