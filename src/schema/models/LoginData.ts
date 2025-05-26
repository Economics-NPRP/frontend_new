import {
	InferInput,
	InferOutput,
	boolean,
	email,
	forward,
	minLength,
	nonEmpty,
	object,
	partialCheck,
	pipe,
	string,
	trim,
} from 'valibot';

export const LoginDataSchema = object({
	email: pipe(string(), trim(), nonEmpty(), email()),
	password: pipe(string(), trim(), nonEmpty(), minLength(8)),
	remember: boolean(),
});

export const CreateUserPasswordSchema = pipe(
	object({
		password: pipe(string(), trim(), nonEmpty(), minLength(8)),
		confirmPassword: pipe(string(), trim(), nonEmpty(), minLength(8)),
	}),
	forward(
		partialCheck(
			[['password'], ['confirmPassword']],
			(input) => input.password === input.confirmPassword,
			'The two passwords do not match.',
		),
		['confirmPassword'],
	),
);

export interface ILoginData extends InferOutput<typeof LoginDataSchema> {}
export interface ICreateUserPassword extends InferInput<typeof CreateUserPasswordSchema> {}

export const DefaultLoginData: ILoginData = {
	email: '',
	password: '',
	remember: false,
};

export const DefaultCreateUserPassword: ICreateUserPassword = {
	password: '',
	confirmPassword: '',
};
