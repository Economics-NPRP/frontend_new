import {
	InferInput,
	array,
	email,
	integer,
	maxLength,
	minLength,
	minValue,
	nonEmpty,
	nullish,
	number,
	object,
	optional,
	pick,
	picklist,
	pipe,
	string,
	transform,
	trim,
	url,
} from 'valibot';

import { AuctionCategoryList } from '@/constants/AuctionCategory';

export const BaseFirmApplicationDataSchema = object({
	companyName: pipe(string(), trim(), nonEmpty()),
	crn: pipe(
		string(),
		trim(),
		nonEmpty(),
		transform((value) => parseInt(value, 10)),
		number(),
		minValue(1),
		integer(),
	),
	repEmail: pipe(string(), trim(), nonEmpty(), email()),
	repPhone: pipe(string(), trim(), nonEmpty()),
	iban: pipe(string(), trim(), nonEmpty()),
	crnCertUrl: nullish(pipe(string(), trim(), url())),
	ibanCertUrl: nullish(pipe(string(), trim(), url())),
	repName: pipe(string(), trim(), nonEmpty()),
	repPosition: optional(pipe(string(), trim())),
	address: optional(pipe(string(), trim())),
	//	TODO: change to list when list input is implemented
	// websites: pipe(array(pipe(string(), trim(), nonEmpty(), url())), minLength(1)),
	websites: pipe(string(), trim(), nonEmpty(), url()),
	sectors: pipe(array(picklist(AuctionCategoryList)), minLength(1), maxLength(6)),
	message: optional(pipe(string(), trim())),
});

export const FirstFirmApplicationDataSchema = pick(BaseFirmApplicationDataSchema, [
	'companyName',
	'crn',
	'iban',
	'crnCertUrl',
	'ibanCertUrl',
]);
export const SecondFirmApplicationDataSchema = pick(BaseFirmApplicationDataSchema, ['sectors']);
export const ThirdFirmApplicationDataSchema = pick(BaseFirmApplicationDataSchema, [
	'repName',
	'repPosition',
	'repEmail',
	'repPhone',
	'address',
	'websites',
]);
export const FourthFirmApplicationDataSchema = pick(BaseFirmApplicationDataSchema, ['message']);

export const CreateFirmApplicationDataSchema = BaseFirmApplicationDataSchema;
export const ReadFirmApplicationDataSchema = BaseFirmApplicationDataSchema;
export const UpdateFirmApplicationDataSchema = CreateFirmApplicationDataSchema;

export interface ICreateFirmApplication
	extends InferInput<typeof CreateFirmApplicationDataSchema> {}
export interface IReadFirmApplication extends InferInput<typeof ReadFirmApplicationDataSchema> {}
export interface IUpdateFirmApplication
	extends InferInput<typeof UpdateFirmApplicationDataSchema> {}

export const DefaultCreateFirmApplication: ICreateFirmApplication = {
	companyName: '',
	crn: '',
	repEmail: '',
	repPhone: '',
	iban: '',
	//	TODO: remove these once the upload is implemented
	crnCertUrl: 'https://example.com',
	ibanCertUrl: 'https://example.com',
	repName: '',
	repPosition: '',
	address: '',
	websites: '',
	sectors: [],
	message: '',
};
