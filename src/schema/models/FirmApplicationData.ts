import {
	InferInput,
	InferOutput,
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
	omit,
	optional,
	pick,
	picklist,
	pipe,
	string,
	transform,
	trim,
	url,
} from 'valibot';

import { SectorList } from '@/constants/SectorData';
import { TimestampSchema, UuidSchema } from '@/schema/utils';

import { FirmApplicationStatusSchema } from './FirmApplicationStatus';

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
	websites: pipe(
		string(),
		trim(),
		nonEmpty(),
		url(),
		transform((value) => [value] as string[]),
	),
	sectors: pipe(array(picklist(SectorList)), minLength(1), maxLength(6)),
	message: optional(pipe(string(), trim())),

	id: UuidSchema(),
	status: FirmApplicationStatusSchema,
	createdAt: TimestampSchema(),
});

export const CreateFirmApplicationDataSchema = omit(BaseFirmApplicationDataSchema, [
	'id',
	'status',
	'createdAt',
]);
export const ReadFirmApplicationDataSchema = BaseFirmApplicationDataSchema;
export const UpdateFirmApplicationDataSchema = CreateFirmApplicationDataSchema;

export const FirstFirmApplicationDataSchema = pick(CreateFirmApplicationDataSchema, [
	'companyName',
	'crn',
	'iban',
	'crnCertUrl',
	'ibanCertUrl',
]);
export const SecondFirmApplicationDataSchema = pick(CreateFirmApplicationDataSchema, ['sectors']);
export const ThirdFirmApplicationDataSchema = pick(CreateFirmApplicationDataSchema, [
	'repName',
	'repPosition',
	'repEmail',
	'repPhone',
	'address',
	'websites',
]);
export const FourthFirmApplicationDataSchema = pick(CreateFirmApplicationDataSchema, ['message']);

export interface IFirmApplication extends InferOutput<typeof BaseFirmApplicationDataSchema> {}
export interface ICreateFirmApplication
	extends InferInput<typeof CreateFirmApplicationDataSchema> {}
export interface IReadFirmApplication extends InferInput<typeof ReadFirmApplicationDataSchema> {}
export interface IUpdateFirmApplication
	extends InferInput<typeof UpdateFirmApplicationDataSchema> {}

export const DefaultFirmApplication: IFirmApplication = {
	companyName: '',
	crn: 0,
	repEmail: '',
	repPhone: '',
	iban: '',
	crnCertUrl: '',
	ibanCertUrl: '',
	repName: '',
	repPosition: '',
	address: '',
	websites: [],
	sectors: [],
	message: '',
	id: '',
	status: 'pending',
	createdAt: new Date().toISOString(),
};

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
