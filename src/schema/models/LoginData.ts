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
	regex,
	string,
	trim,
} from 'valibot';

export const PasswordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;
//	TODO: use these regexes when i18n is done for schemas
export const PasswordUppercaseRegex = /[A-Z]/;
export const PasswordLowercaseRegex = /[a-z]/;
export const PasswordNumberRegex = /\d/;
export const PasswordSymbolRegex = /[^A-Za-z\d]/;

export const LoginDataSchema = object({
	email: pipe(string(), trim(), nonEmpty(), email()),
	password: pipe(string(), trim(), nonEmpty(), minLength(8), regex(PasswordComplexityRegex)),
	remember: boolean(),
});

export const CreateUserPasswordSchema = pipe(
	object({
		password: pipe(string(), trim(), nonEmpty(), minLength(8), regex(PasswordComplexityRegex)),
		confirmPassword: pipe(
			string(),
			trim(),
			nonEmpty(),
			minLength(8),
			regex(PasswordComplexityRegex),
		),
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

export const OTPDataSchema = object({
	otp: pipe(string(), trim(), nonEmpty(), minLength(6)),
});

export interface ILoginData extends InferOutput<typeof LoginDataSchema> {}
export interface ICreateUserPassword extends InferInput<typeof CreateUserPasswordSchema> {}
export interface IOTPData extends InferInput<typeof OTPDataSchema> {}

export const DefaultLoginData: ILoginData = {
	email: '',
	password: '',
	remember: false,
};

export const DefaultCreateUserPassword: ICreateUserPassword = {
	password: '',
	confirmPassword: '',
};

export const DefaultOTPData: IOTPData = {
	otp: '',
};
