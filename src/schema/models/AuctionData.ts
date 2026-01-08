import { toIsoUtcMicro } from 'helpers/cycleInfoFormat';
import { DateTime } from 'luxon';
import {
	InferInput,
	InferOutput,
	boolean,
	forward,
	lazy,
	nonEmpty,
	nullish,
	number,
	object,
	omit,
	optional,
	partialCheck,
	pick,
	pipe,
	string,
	transform,
	trim,
	url,
} from 'valibot';

import { PositiveNumberSchema, TimestampSchema, UuidSchema } from '@/schema/utils';

import { BaseAuctionCycleDataSchema } from './AuctionCycleData';
import { AuctionTypeSchema } from './AuctionType';
import { DefaultUserData } from './GeneralUserData';
import { SectorTypeSchema } from './SectorData';
import { BaseUserDataSchema } from './UserData';
import { SMApprovalAdminDataSchema } from '@/schema/models/SMApprovalsAdminData';

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
	emissions: nullish(PositiveNumberSchema()),
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

		'image',

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

	subsector: UuidSchema(),
	startDatetime: string(),
	endDatetime: string(),
});
export const CreateAuctionDataSchemaTransformer = pipe(
	CreateAuctionDataSchema,
	transform((input) => ({
		...input,

		startDatetime: toIsoUtcMicro(
			DateTime.fromISO(input.startDatetime).toISO() || input.startDatetime,
		),
		endDatetime: toIsoUtcMicro(
			DateTime.fromISO(input.endDatetime).toISO() || input.endDatetime,
		),
	})),
);
// {
// 	"auctionId": "d8fc4aa7-c541-4dfe-ab32-403313e5ce56",
// 		"status": "approved",
// 			"lockedQty": 1,
// 				"requestedById": "8b5b473c-5860-4bd4-8402-628587b4cd61",
// 					"requestedAt": "2025-12-31T00:14:24.222167Z",
// 						"decidedById": "d97bfe40-4ff9-481d-a091-0b01c63ac61d",
// 							"decidedAt": "2025-12-31T16:58:12.903450Z",
// 								"decisionNotes": "",
// 									"lockedAt": "2025-12-31T00:14:24.234945Z",
// 										"executedById": null,
// 											"executedAt": null,
// 												"executionNotes": null,
// 													"id": 1
// }
const BaseSecondaryApproval = object({
	auctionId: UuidSchema(),
	status: pipe(string(), trim(), nonEmpty()),
	lockedQty: PositiveNumberSchema(),

	requestedById: UuidSchema(),
	requestedAt: nullish(TimestampSchema()),

	decidedById: UuidSchema(),
	decidedAt: nullish(TimestampSchema()),
	decisionNotes: nullish(pipe(string(), trim())),

	lockedAt: nullish(TimestampSchema()),

	executedById: nullish(UuidSchema()),
	executedAt: nullish(TimestampSchema()),
	executionNotes: nullish(pipe(string(), trim())),

	id: PositiveNumberSchema(),
})

export const ReadAuctionDataSchema = object({
	...BaseAuctionDataSchema.entries,

	owner: BaseUserDataSchema,
	cycle: lazy(() => nullish(BaseAuctionCycleDataSchema)),
	secondaryApproval: optional(BaseSecondaryApproval)
	//	TODO: uncomment when backend has subsector data
	// subsector: lazy(() => ReadSubsectorDataSchema),
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
			(input) => input.startDatetime < input.endDatetime,
			'The start date must be before the end date.',
		),
		['startDatetime'],
	),
);

export interface IBaseAuctionData extends InferOutput<typeof BaseAuctionDataSchema> { }
export interface ICreateAuction extends InferInput<typeof CreateAuctionDataSchema> { }
export interface ICreateAuctionOutput
	extends InferOutput<typeof CreateAuctionDataSchemaTransformer> { }
export interface IAuctionData extends InferOutput<typeof ReadAuctionDataSchema> { }
export interface IUpdateAuction extends InferInput<typeof UpdateAuctionDataSchema> { }

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
	title: '',
	description: '',
	emissionId: 1,
	sector: 'energy',
	subsector: 'gasTurbine',
	type: 'open',
	isPrimaryMarket: false,
	permits: 0,
	minBid: 0,
	startDatetime: DateTime.now().plus({ days: 1 }).toISO() || new Date().toISOString(),
	endDatetime: DateTime.now().plus({ days: 1, hours: 1 }).toISO() || new Date().toISOString(),
};
