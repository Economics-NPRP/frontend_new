import { InferInput, InferOutput, nonEmpty, object, pipe, string, trim } from 'valibot';

import { PositiveNumberSchema, TimestampSchema, UuidSchema } from '@/schema/utils';

import { AuctionCycleStatusSchema } from './AuctionCycleStatus';

//	TODO: Check why path alias is not working
export const BaseAuctionCycleDataSchema = object({
	id: UuidSchema(),

	title: pipe(string(), trim(), nonEmpty()),
	description: pipe(string(), trim(), nonEmpty()),

	status: AuctionCycleStatusSchema,
	auctionsCount: PositiveNumberSchema(true),
	assignedAdminsCount: PositiveNumberSchema(true),
	emissionsCount: PositiveNumberSchema(true),

	startDatetime: TimestampSchema(),
	endDatetime: TimestampSchema(),

	createdAt: TimestampSchema(),
	updatedAt: TimestampSchema(),
});

export const CreateAuctionCycleDataSchema = BaseAuctionCycleDataSchema;
export const ReadAuctionCycleDataSchema = BaseAuctionCycleDataSchema;
export const UpdateAuctionCycleDataSchema = CreateAuctionCycleDataSchema;

export interface IAuctionCycleData extends InferOutput<typeof BaseAuctionCycleDataSchema> {}
export interface ICreateAuctionCycle extends InferInput<typeof CreateAuctionCycleDataSchema> {}
export interface IReadAuctionCycle extends InferInput<typeof ReadAuctionCycleDataSchema> {}
export interface IUpdateAuctionCycle extends InferInput<typeof UpdateAuctionCycleDataSchema> {}

export const DefaultAuctionCycleData: IAuctionCycleData = {
	id: '',
	title: '',
	description: '',
	status: 'draft',
	auctionsCount: 0,
	assignedAdminsCount: 0,
	emissionsCount: 0,
	startDatetime: '1970-01-01T00:00:00.000Z',
	endDatetime: '1970-01-01T00:00:00.000Z',
	createdAt: '1970-01-01T00:00:00.000Z',
	updatedAt: '1970-01-01T00:00:00.000Z',
};
