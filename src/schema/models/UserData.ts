import {
	InferInput,
	boolean,
	email,
	nonEmpty,
	nullish,
	object,
	omit,
	pipe,
	string,
	trim,
	url,
} from 'valibot';

import { TimestampSchema, UuidSchema } from '@/schema/utils';

import { UserTypeSchema } from './UserType';

export const BaseUserDataSchema = object({
	id: UuidSchema(),
	type: UserTypeSchema,

	name: pipe(string(), trim(), nonEmpty()),
	email: pipe(string(), trim(), nonEmpty(), email()),
	phone: pipe(string(), trim(), nonEmpty()),
	image: nullish(pipe(string(), trim(), url())),

	emailVerified: boolean(),
	phoneVerified: boolean(),

	isActive: boolean(),
	createdAt: TimestampSchema(),
});

export const CreateUserDataSchema = omit(
	object({
		...BaseUserDataSchema.entries,
	}),
	['id', 'emailVerified', 'phoneVerified', 'isActive', 'createdAt'],
);

export const ReadUserDataSchema = BaseUserDataSchema;
export const UpdateUserDataSchema = CreateUserDataSchema;

export interface ICreateUser extends InferInput<typeof CreateUserDataSchema> {}
export interface IReadUser extends InferInput<typeof ReadUserDataSchema> {}
export interface IUpdateUser extends InferInput<typeof UpdateUserDataSchema> {}

export const DefaultCreateUser: ICreateUser = {
	type: 'firm',
	name: '',
	email: '',
	phone: '',
	image: null,
};
