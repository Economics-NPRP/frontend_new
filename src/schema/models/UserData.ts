import { getTranslations } from 'next-intl/server';
import {
	InferInput,
	InferOutput,
	boolean,
	email,
	length,
	minWords,
	nonEmpty,
	nullish,
	object,
	omit,
	pipe,
	string,
	trim,
	url,
} from 'valibot';

import { getUserLocale } from '@/locales';
import { UserTypeSchema } from '@/schema/models/UserType';
import { TimestampSchema, UuidSchema } from '@/schema/utils';

const MODEL_NAME = 'UserData';

const locale = await getUserLocale();
const t = await getTranslations();

export const BaseUserDataSchema = object({
	id: UuidSchema('id'),
	type: UserTypeSchema,

	name: pipe(
		string(({ received }) => t(`model.${MODEL_NAME}.name.string`, { received })),
		trim(),
		nonEmpty(() => t(`model.${MODEL_NAME}.name.required`)),
		minWords(locale, 1, ({ received }) => t(`model.${MODEL_NAME}.name.words`, { received })),
	),
	email: pipe(
		string(({ received }) => t(`model.${MODEL_NAME}.email.string`, { received })),
		trim(),
		nonEmpty(() => t(`model.${MODEL_NAME}.email.required`)),
		email(({ received }) => t(`model.${MODEL_NAME}.email.email`, { received })),
	),
	phone: pipe(
		string(({ received }) => t(`model.${MODEL_NAME}.phone.string`, { received })),
		trim(),
		nonEmpty(() => t(`model.${MODEL_NAME}.phone.required`)),
		length(8, ({ received }) => t(`model.${MODEL_NAME}.phone.length`, { received })),
	),
	image: nullish(
		pipe(
			string(({ received }) => t(`model.${MODEL_NAME}.image.string`, { received })),
			trim(),
			url(({ received }) => t(`model.${MODEL_NAME}.image.url`, { received })),
		),
	),

	emailVerified: boolean(({ received }) =>
		t(`model.${MODEL_NAME}.emailVerified.boolean`, { received }),
	),
	phoneVerified: boolean(({ received }) =>
		t(`model.${MODEL_NAME}.phoneVerified.boolean`, { received }),
	),

	isActive: boolean(({ received }) => t(`model.${MODEL_NAME}.isActive.boolean`, { received })),
	createdAt: TimestampSchema('createdAt'),
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

export interface IUserData extends InferOutput<typeof BaseUserDataSchema> {}
export interface ICreateUser extends InferInput<typeof CreateUserDataSchema> {}
export interface IReadUser extends InferInput<typeof ReadUserDataSchema> {}
export interface IUpdateUser extends InferInput<typeof UpdateUserDataSchema> {}
