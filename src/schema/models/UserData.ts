import {
	InferInput,
	InferOutput,
	boolean,
	email,
	length,
	nonEmpty,
	nullish,
	object,
	omit,
	pipe,
	string,
	trim,
	url,
} from 'valibot';

import { IAdminData } from '@/schema/models/AdminData';
import { IFirmData } from '@/schema/models/FirmData';
import { TimestampSchema, UuidSchema } from '@/schema/utils';

import { UserTypeSchema } from './UserType';

export const BaseUserDataSchema = object({
	id: UuidSchema(),
	type: UserTypeSchema,

	name: pipe(string(), trim(), nonEmpty()),
	email: pipe(string(), trim(), nonEmpty(), email()),
	phone: pipe(string(), trim(), nonEmpty(), length(8)),
	image: nullish(pipe(string(), trim(), url())),

	emailVerified: boolean(),
	phoneVerified: boolean(),

	isActive: boolean(),
	createdAt: TimestampSchema(),
});

export const CreateUserDataSchema = omit(BaseUserDataSchema, [
	'id',
	'emailVerified',
	'phoneVerified',
	'isActive',
	'createdAt',
]);

export const ReadUserDataSchema = BaseUserDataSchema;
export const UpdateUserDataSchema = CreateUserDataSchema;

export interface IUserData
	extends InferOutput<typeof BaseUserDataSchema>,
		Partial<Pick<IFirmData, 'sectors' | 'permits'>>,
		Partial<Pick<IAdminData, 'isSuperadmin'>> {}
export interface ICreateUser extends InferInput<typeof CreateUserDataSchema> {}
export interface IReadUser extends InferInput<typeof ReadUserDataSchema> {}
export interface IUpdateUser extends InferInput<typeof UpdateUserDataSchema> {}

export const DefaultUserData: IUserData = {
	id: '',
	type: 'firm',

	name: '',
	email: '',
	phone: '',
	image: null,

	emailVerified: false,
	phoneVerified: false,

	isActive: true,
	createdAt: '1970-01-01T00:00:00.000Z',
};
