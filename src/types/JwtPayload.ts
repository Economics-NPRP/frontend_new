import { JwtPayload } from 'jwt-decode';

import { UserType } from '@/schema/models';

export interface IAccessToken extends JwtPayload {
	type: 'access';
	role: UserType;
}

export interface IRefreshToken extends JwtPayload {
	type: 'refresh';
	ip: string;
}
