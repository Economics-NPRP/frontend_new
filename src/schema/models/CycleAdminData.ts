import { InferInput, InferOutput, array, nonEmpty, object, pipe } from 'valibot';

import { TimestampSchema, UuidSchema } from '@/schema/utils';

import { BaseAdminDataSchema, DefaultAdminData } from './AdminData';
import { AdminRole, AdminRoleSchema } from './AdminRole';

export const B2FRoleMap: Record<string, AdminRole> = {
	planner: 'manager',
	coordinator: 'auctionOperator',
	permits_allocator: 'permitStrategist',
	permit_distributor: 'permitStrategist',
	payment_collector: 'financeOfficer',
};

export const F2BRoleMap: Record<AdminRole, string> = {
	manager: 'planner',
	auctionOperator: 'coordinator',
	permitStrategist: 'permits_allocator',
	financeOfficer: 'payment_collector',
	permitDistributor: 'permit_distributor',
};

export const BaseCycleAdminDataSchema = object({
	adminId: UuidSchema(),
	admin: BaseAdminDataSchema,
	role: AdminRoleSchema,
});

export const CreateCycleAdminDataSchema = BaseCycleAdminDataSchema;
export const ReadCycleAdminDataSchema = object({
	...BaseCycleAdminDataSchema.entries,

	cycleId: UuidSchema(),
	assignedAt: TimestampSchema(),
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

	assignedAt: '1970-01-01T00:00:00.000Z',
};
