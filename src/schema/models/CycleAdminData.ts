import { InferInput, InferOutput, array, lazy, nonEmpty, object, omit, pipe } from 'valibot';

import { TimestampSchema, UuidSchema } from '@/schema/utils';

import { BaseAdminDataSchema, DefaultAdminData } from './AdminData';
import { AdminRoleSchema } from './AdminRole';
import { ReadAuctionCycleDataSchema } from './AuctionCycleData';

//	TODO: Check why path alias is not working
export const BaseCycleAdminDataSchema = object({
	adminId: UuidSchema(),
	cycleId: UuidSchema(),
	role: AdminRoleSchema,

	assignedAt: TimestampSchema(),
});

export const CreateCycleAdminDataSchema = omit(BaseCycleAdminDataSchema, ['assignedAt']);
export const ReadCycleAdminDataSchema = object({
	...BaseCycleAdminDataSchema.entries,

	admin: BaseAdminDataSchema,
	cycle: lazy(() => ReadAuctionCycleDataSchema),
});
export const UpdateCycleAdminDataSchema = CreateCycleAdminDataSchema;

export const BaseCycleAdminListSchema = pipe(array(BaseCycleAdminDataSchema), nonEmpty());
export const CreateCycleAdminListSchema = pipe(array(CreateCycleAdminDataSchema), nonEmpty());

export interface IBaseCycleAdminData extends InferOutput<typeof BaseCycleAdminDataSchema> {}
export interface ICreateCycleAdmin extends InferInput<typeof CreateCycleAdminDataSchema> {}
export interface ICycleAdminData extends InferOutput<typeof ReadCycleAdminDataSchema> {}
export interface IUpdateCycleAdmin extends InferInput<typeof UpdateCycleAdminDataSchema> {}

export const DefaultCycleAdminData: ICycleAdminData = {
	adminId: '',
	cycleId: '',
	role: 'manager',

	admin: DefaultAdminData,
	cycle: {
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
	},

	assignedAt: '1970-01-01T00:00:00.000Z',
};
