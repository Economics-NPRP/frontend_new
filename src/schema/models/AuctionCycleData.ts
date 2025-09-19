import { omit as _omit } from 'lodash-es';
import { DateTime } from 'luxon';
import { toIsoUtcMicro } from '@/helpers';
import {
	InferInput,
	InferOutput,
	array,
	forward,
	lazy,
	nonEmpty,
	object,
	omit,
	partialCheck,
	pick,
	pipe,
	string,
	transform,
	trim,
} from 'valibot';

import { DATE_PICKER_FORMAT_STRING } from '@/pages/create/_components/DateTimePicker';
import { PositiveNumberSchema, TimestampSchema, UuidSchema } from '@/schema/utils';

import { IAdminData, ReadAdminDataSchema } from './AdminData';
import { AdminRole } from './AdminRole';
import { AuctionCycleStatusSchema } from './AuctionCycleStatus';
import { BaseAuctionDataSchema } from './AuctionData';
import { ICreateCycleAdmin, ReadCycleAdminDataSchema } from './CycleAdminData';
import { SectorListSchema } from './SectorData';

export const BaseAuctionCycleDataSchema = object({
	id: UuidSchema(),

	title: pipe(string(), trim(), nonEmpty()),
	description: pipe(string(), trim(), nonEmpty()),
	sectors: SectorListSchema,
	status: AuctionCycleStatusSchema,

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

	adminAssignments: object({
		manager: array(ReadAdminDataSchema),
		auctionOperator: array(ReadAdminDataSchema),
		permitStrategist: array(ReadAdminDataSchema),
		financeOfficer: array(ReadAdminDataSchema),
		permitDistributor: array(ReadAdminDataSchema),
	}),

	startDatetime: string(),
	endDatetime: string(),
});
export const CreateAuctionCycleDataSchemaTransformer = pipe(
	CreateAuctionCycleDataSchema,
	transform((input) => {
		return {
			...input,

			adminAssignments: Object.entries(input.adminAssignments).reduce(
				(acc, [role, admins]) => {
					const list = admins.map(
						(admin) =>
							({
								adminId: admin.id,
								role: role as AdminRole,
							}) as ICreateCycleAdmin,
					);
					acc.push(...list);
					return acc;
				},
				[] as Array<ICreateCycleAdmin>,
			),

			startDatetime: toIsoUtcMicro(DateTime.fromISO(input.startDatetime).toISO() || input.startDatetime),
			endDatetime: toIsoUtcMicro(DateTime.fromISO(input.endDatetime).toISO() || input.endDatetime),
		};
	}),
);
export const ReadAuctionCycleDataSchema = object({
	...BaseAuctionCycleDataSchema.entries,

	adminAssignments: array(ReadCycleAdminDataSchema),

	auctionsCount: PositiveNumberSchema(true),
	assignedAdminsCount: PositiveNumberSchema(true),
	emissionsCount: PositiveNumberSchema(true),

	auctions: array(lazy(() => BaseAuctionDataSchema)),
});
export const UpdateAuctionCycleDataSchema = CreateAuctionCycleDataSchema;

export const FirstAuctionCycleDataSchema = pipe(
	pick(CreateAuctionCycleDataSchema, ['title', 'description', 'startDatetime', 'endDatetime']),
	forward(
		partialCheck(
			[['startDatetime'], ['endDatetime']],
			(input) => input.startDatetime < input.endDatetime,
			'The start date must be before the end date.',
		),
		['startDatetime'],
	),
);
export const SectorAuctionCycleDataSchema = pick(CreateAuctionCycleDataSchema, ['sectors']);
export const SecondAuctionCycleDataSchema = pick(CreateAuctionCycleDataSchema, [
	'adminAssignments',
]);
//	TODO: uncomment when backend has kpis
// export const ThirdAuctionCycleDataSchema = pick(CreateAuctionCycleDataSchema, []);

export const ReadToCreateAuctionCycleDataTransformer = pipe(
	ReadAuctionCycleDataSchema,
	transform((input) => ({
		..._omit(input, [
			'auctionsCount',
			'adminAssignments',
			'assignedAdminsCount',
			'emissionsCount',
			'auctions',
			'id',
			'status',
			'createdAt',
			'updatedAt',
		]),

		adminAssignments: input.adminAssignments.reduce(
			(acc, admin) => {
				const list = [...(acc[admin.role] || [])];
				list.push(admin.admin);
				acc[admin.role] = [...list];
				return acc;
			},
			{ ...DefaultCreateAuctionCycleData.adminAssignments } as Record<
				AdminRole,
				Array<IAdminData>
			>,
		),

		startDatetime: DateTime.fromISO(input.startDatetime).toFormat(DATE_PICKER_FORMAT_STRING),
		endDatetime: DateTime.fromISO(input.endDatetime).toFormat(DATE_PICKER_FORMAT_STRING),
	})),
);

export interface IBaseAuctionCycleData extends InferOutput<typeof BaseAuctionCycleDataSchema> { }
export interface ICreateAuctionCycle extends InferInput<typeof CreateAuctionCycleDataSchema> { }
export interface ICreateAuctionCycleOutput
	extends InferOutput<typeof CreateAuctionCycleDataSchemaTransformer> { }
export interface IAuctionCycleData extends InferOutput<typeof ReadAuctionCycleDataSchema> { }
export interface IUpdateAuctionCycle extends InferInput<typeof UpdateAuctionCycleDataSchema> { }

export const DefaultBaseAuctionCycleData: IBaseAuctionCycleData = {
	id: '',
	title: '',
	description: '',
	sectors: [],
	status: 'draft',
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
	auctionsCount: 0,
	assignedAdminsCount: 0,
	emissionsCount: 0,
	startDatetime: '1970-01-01T00:00:00.000Z',
	endDatetime: '1970-01-01T00:00:00.000Z',
	createdAt: '1970-01-01T00:00:00.000Z',
	updatedAt: '1970-01-01T00:00:00.000Z',
	adminAssignments: [],
	auctions: [],
};

export const DefaultCreateAuctionCycleData: ICreateAuctionCycle = {
	title: '',
	description: '',
	sectors: [],
	adminAssignments: {
		manager: [],
		auctionOperator: [],
		permitStrategist: [],
		financeOfficer: [],
		permitDistributor: [],
	},
	startDatetime: new Date().toISOString(),
	endDatetime: new Date().toISOString(),
};
