import { InferInput, InferOutput, object, omit } from 'valibot';

import { PositiveNumberSchema, TimestampSchema, UuidSchema } from '@/schema/utils';

import { BaseUserDataSchema, DefaultUserData } from './UserData';

export const BaseBidDataSchema = object({
	id: UuidSchema(),
	auctionId: UuidSchema(),
	bidderId: UuidSchema(),
	timestamp: TimestampSchema(),
	amount: PositiveNumberSchema(),
	permits: PositiveNumberSchema(),

	bidder: BaseUserDataSchema,
});

export const CreateBidDataSchema = omit(BaseBidDataSchema, [
	'id',
	'auctionId',
	'bidderId',
	'timestamp',
	'bidder',
]);

export const ReadBidDataSchema = BaseBidDataSchema;
export const UpdateBidDataSchema = CreateBidDataSchema;

export interface IBidData extends InferOutput<typeof BaseBidDataSchema> {}
export interface ICreateBid extends InferInput<typeof CreateBidDataSchema> {}
export interface IReadBid extends InferInput<typeof ReadBidDataSchema> {}
export interface IUpdateBid extends InferInput<typeof UpdateBidDataSchema> {}

export const DefaultBidData: IBidData = {
	id: '',
	auctionId: '',
	bidderId: '',
	timestamp: '1970-01-01T00:00:00.000Z',
	amount: 0,
	permits: 0,

	bidder: DefaultUserData,
};
