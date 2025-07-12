import { InferInput, InferOutput, array, object, omit, string } from 'valibot';

import { UuidSchema } from '@/schema/utils';

import { BaseApplicationSchema, DefaultApplication } from './FirmApplicationData';
import { DefaultUserData } from './GeneralUserData';
import { SectorListSchema } from './SectorData';
import { BaseUserDataSchema, DefaultCreateUser } from './UserData';

export const BaseFirmDataSchema = object({
	...BaseUserDataSchema.entries,

	sectors: SectorListSchema,
	permits: array(string()),

	applicationId: UuidSchema(),
	application: BaseApplicationSchema,
});

export const CreateFirmDataSchema = omit(BaseFirmDataSchema, [
	'id',
	'emailVerified',
	'phoneVerified',
	'isActive',
	'createdAt',
	'permits',

	'applicationId',
	'application',
]);

export const ReadFirmDataSchema = BaseFirmDataSchema;
export const UpdateFirmDataSchema = CreateFirmDataSchema;

export interface IFirmData extends InferOutput<typeof BaseFirmDataSchema> {}
export interface ICreateFirm extends InferInput<typeof CreateFirmDataSchema> {}
export interface IReadFirm extends InferInput<typeof ReadFirmDataSchema> {}
export interface IUpdateFirm extends InferInput<typeof UpdateFirmDataSchema> {}

export const DefaultFirmData: IFirmData = {
	...DefaultUserData,

	sectors: [],
	permits: [],

	applicationId: '',
	application: DefaultApplication,
};

export const DefaultCreateFirm: ICreateFirm = {
	...DefaultCreateUser,

	sectors: [],
};
