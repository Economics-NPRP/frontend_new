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
	nullish,
	object,
	omit,
	pick,
	pipe,
	string,
	transform,
	trim,
} from 'valibot';

import { PositiveNumberSchema, TimestampSchema, UuidSchema } from '@/schema/utils';

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

const CreateAuctionCycleDataSchemaObject = object({
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
export const CreateAuctionCycleDataSchema = pipe(
	CreateAuctionCycleDataSchemaObject,
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
});
export const UpdateAuctionCycleDataSchema = CreateAuctionCycleDataSchemaObject;

export const FirstAuctionCycleDataSchema = pick(CreateAuctionCycleDataSchemaObject, [
	'title',
	'description',
	'dates',
]);
export const SectorAuctionCycleDataSchema = pick(CreateAuctionCycleDataSchemaObject, ['sectors']);
export const SecondAuctionCycleDataSchema = pick(CreateAuctionCycleDataSchemaObject, ['admins']);
//	TODO: uncomment when backend has kpis
// export const ThirdAuctionCycleDataSchema = pick(CreateAuctionCycleDataSchema, []);

export interface IBaseAuctionCycleData extends InferOutput<typeof BaseAuctionCycleDataSchema> {}
export interface ICreateAuctionCycle
	extends InferInput<typeof CreateAuctionCycleDataSchemaObject> {}
export interface ICreateAuctionCycleOutput
	extends InferOutput<typeof CreateAuctionCycleDataSchemaObject> {}
export interface IAuctionCycleData extends InferOutput<typeof ReadAuctionCycleDataSchema> {}
export interface IUpdateAuctionCycle extends InferInput<typeof UpdateAuctionCycleDataSchema> {}

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
};

export const DefaultCreateAuctionCycleData: ICreateAuctionCycle = {
	title: '',
	description: null,
	sectors: [],
	admins: [],
	dates: [new Date(), new Date()],
};
