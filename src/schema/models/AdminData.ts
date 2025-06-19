import { InferInput, InferOutput, boolean, object, omit } from 'valibot';

import { BaseUserDataSchema, DefaultUserData } from '@/schema/models/UserData';

export const BaseAdminDataSchema = object({
	...BaseUserDataSchema.entries,

	isSuperadmin: boolean(),
});

export const CreateAdminDataSchema = omit(BaseAdminDataSchema, [
	'id',
	'emailVerified',
	'phoneVerified',
	'isActive',
	'createdAt',
]);

export const ReadAdminDataSchema = BaseAdminDataSchema;
export const UpdateAdminDataSchema = CreateAdminDataSchema;

export interface IAdminData extends InferOutput<typeof BaseAdminDataSchema> {}
export interface ICreateAdmin extends InferInput<typeof CreateAdminDataSchema> {}
export interface IReadAdmin extends InferInput<typeof ReadAdminDataSchema> {}
export interface IUpdateAdmin extends InferInput<typeof UpdateAdminDataSchema> {}

export const DefaultAdminData: IAdminData = {
	...DefaultUserData,

	isSuperadmin: false,
};
