import {
	InferOutput,
	boolean,
	email,
	minLength,
	nonEmpty,
	object,
	pipe,
	string,
	trim,
} from 'valibot';

export const LoginDataSchema = object({
	email: pipe(string(), trim(), nonEmpty(), email()),
	password: pipe(string(), trim(), nonEmpty(), minLength(8)),
	remember: boolean(),
});

export interface ILoginData extends InferOutput<typeof LoginDataSchema> {}

export const DefaultLoginData: ILoginData = {
	email: '',
	password: '',
	remember: false,
};
