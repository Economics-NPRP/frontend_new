import { InferInput, InferOutput, object } from 'valibot';

import { TimestampSchema, UuidSchema } from '@/schema/utils';

import { BaseAdminDataSchema, DefaultAdminData } from './AdminData';
import { AdminRoleSchema } from './AdminRole';
import { BaseAuctionCycleDataSchema, DefaultAuctionCycleData } from './AuctionCycleData';

//	TODO: Check why path alias is not working
export const BaseCycleAdminDataSchema = object({
	adminId: UuidSchema(),
	cycleId: UuidSchema(),
	role: AdminRoleSchema,

	admin: BaseAdminDataSchema,
	cycle: BaseAuctionCycleDataSchema,

	assignedAt: TimestampSchema(),
});

export const CreateCycleAdminDataSchema = BaseCycleAdminDataSchema;
export const ReadCycleAdminDataSchema = BaseCycleAdminDataSchema;
export const UpdateCycleAdminDataSchema = CreateCycleAdminDataSchema;

export interface ICycleAdminData extends InferOutput<typeof BaseCycleAdminDataSchema> {}
export interface ICreateCycleAdmin extends InferInput<typeof CreateCycleAdminDataSchema> {}
export interface IReadCycleAdmin extends InferInput<typeof ReadCycleAdminDataSchema> {}
export interface IUpdateCycleAdmin extends InferInput<typeof UpdateCycleAdminDataSchema> {}

export const DefaultCycleAdminData: ICycleAdminData = {
	adminId: '',
	cycleId: '',
	role: 'manager',

	admin: DefaultAdminData,
	cycle: DefaultAuctionCycleData,

	assignedAt: '1970-01-01T00:00:00.000Z',
};
