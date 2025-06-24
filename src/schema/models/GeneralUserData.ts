import { InferOutput } from 'valibot';

import { IAdminData } from './AdminData';
import { IFirmData } from './FirmData';
import { BaseUserDataSchema } from './UserData';

export interface IUserData
	extends InferOutput<typeof BaseUserDataSchema>,
		Partial<Pick<IFirmData, 'sectors' | 'permits'>>,
		Partial<Pick<IAdminData, 'isSuperadmin'>> {}

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
