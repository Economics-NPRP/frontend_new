import { InferInput, InferOutput, array, object, omit, picklist, pipe, string } from 'valibot';

import { AuctionCategoryList } from '@/constants/AuctionCategory';
import { BaseUserDataSchema, DefaultUserData } from '@/schema/models/UserData';

export const BaseFirmDataSchema = object({
	...BaseUserDataSchema.entries,

	sectors: pipe(array(picklist(AuctionCategoryList))),
	permits: array(string()),
});

export const CreateFirmDataSchema = omit(BaseFirmDataSchema, [
	'id',
	'emailVerified',
	'phoneVerified',
	'isActive',
	'createdAt',
	'permits',
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
};
