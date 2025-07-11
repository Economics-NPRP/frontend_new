import { DateTime } from 'luxon';
import {
	InferInput,
	InferOutput,
	array,
	custom,
	date,
	lazy,
	length,
	minValue,
	nonEmpty,
	object,
	omit,
	pick,
	pipe,
	string,
	transform,
	trim,
} from 'valibot';

import { PositiveNumberSchema, TimestampSchema, UuidSchema } from '@/schema/utils';

import { ReadAdminDataSchema } from './AdminData';
import { AuctionCycleStatusSchema } from './AuctionCycleStatus';
import { BaseCycleAdminListDataSchema } from './CycleAdminListData';
import { SectorListSchema } from './SectorData';

//	TODO: Check why path alias is not working
export const BaseAuctionCycleDataSchema = object({
	id: UuidSchema(),

	title: pipe(string(), trim(), nonEmpty()),
	description: pipe(string(), trim(), nonEmpty()),
	sectors: SectorListSchema,
	status: AuctionCycleStatusSchema,

	admins: lazy(() => BaseCycleAdminListDataSchema),

	startDatetime: TimestampSchema(),
	endDatetime: TimestampSchema(),

	createdAt: TimestampSchema(),
	updatedAt: TimestampSchema(),
});

export const CreateAuctionCycleDataSchema = object({
	...omit(BaseAuctionCycleDataSchema, [
		'id',
		'status',
		'createdAt',
		'updatedAt',
		'startDatetime',
		'endDatetime',
	]).entries,
	dates: pipe(
		array(pipe(date(), minValue(new Date()))),
		length(2),
		custom((value) => {
			const [start, end] = value as [Date, Date];
			if (!start || !end) return false;
			if (DateTime.fromJSDate(start) >= DateTime.fromJSDate(end)) return false;
			return true;
		}),
	),
});
export const CreateAuctionCycleDataSchemaTransformer = pipe(
	CreateAuctionCycleDataSchema,
	transform((input) => {
		const [start, end] = input.dates as [Date, Date];
		return {
			...input,
			startDatetime: DateTime.fromJSDate(start).toISO(),
			endDatetime: DateTime.fromJSDate(end).toISO(),
		};
	}),
);
export const ReadAuctionCycleDataSchema = object({
	...BaseAuctionCycleDataSchema.entries,

	auctionsCount: PositiveNumberSchema(true),
	assignedAdminsCount: PositiveNumberSchema(true),
	emissionsCount: PositiveNumberSchema(true),

	assignedAdmins: array(ReadAdminDataSchema),
	// auctions: array(BaseAuctionDataSchema),
});
export const UpdateAuctionCycleDataSchema = CreateAuctionCycleDataSchema;

export const FirstAuctionCycleDataSchema = pick(CreateAuctionCycleDataSchema, [
	'title',
	'description',
	'dates',
]);
export const SectorAuctionCycleDataSchema = pick(CreateAuctionCycleDataSchema, ['sectors']);
export const SecondAuctionCycleDataSchema = pick(CreateAuctionCycleDataSchema, ['admins']);
//	TODO: uncomment when backend has kpis
// export const ThirdAuctionCycleDataSchema = pick(CreateAuctionCycleDataSchema, []);

export interface IBaseAuctionCycleData extends InferOutput<typeof BaseAuctionCycleDataSchema> {}
export interface ICreateAuctionCycle extends InferInput<typeof CreateAuctionCycleDataSchema> {}
export interface ICreateAuctionCycleOutput
	extends InferOutput<typeof CreateAuctionCycleDataSchemaTransformer> {}
export interface IAuctionCycleData extends InferOutput<typeof ReadAuctionCycleDataSchema> {}
export interface IUpdateAuctionCycle extends InferInput<typeof UpdateAuctionCycleDataSchema> {}

export const DefaultBaseAuctionCycleData: IBaseAuctionCycleData = {
	id: '',
	title: '',
	description: '',
	sectors: [],
	status: 'draft',
	admins: [],
	startDatetime: '1970-01-01T00:00:00.000Z',
	endDatetime: '1970-01-01T00:00:00.000Z',
	createdAt: '1970-01-01T00:00:00.000Z',
	updatedAt: '1970-01-01T00:00:00.000Z',
};

export const DefaultAuctionCycleData: IAuctionCycleData = {
	id: '',
	title: '',
	description: '',
	sectors: [],
	status: 'draft',
	admins: [],
	auctionsCount: 0,
	assignedAdminsCount: 0,
	emissionsCount: 0,
	startDatetime: '1970-01-01T00:00:00.000Z',
	endDatetime: '1970-01-01T00:00:00.000Z',
	createdAt: '1970-01-01T00:00:00.000Z',
	updatedAt: '1970-01-01T00:00:00.000Z',
	assignedAdmins: [],
};

export const DefaultCreateAuctionCycleData: ICreateAuctionCycle = {
	title: '',
	description: '',
	sectors: [],
	admins: [],
	dates: [new Date(), new Date()],
};
