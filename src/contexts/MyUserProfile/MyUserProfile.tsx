'use client';

import { usePathname } from 'next/navigation';
import { createContext } from 'react';

import { ProtectedRoutes } from '@/constants/ProtectedRoutes';
import { QueryProvider } from '@/contexts';
import { throwError } from '@/helpers';
import { getMyUserProfile } from '@/lib/users';
import { DefaultUserData, IUserData } from '@/schema/models';
import { CoreProviderProps, ServerContextState, getDefaultContextState } from '@/types';

export interface IMyUserProfileContext extends ServerContextState<IUserData> {}
const DefaultData: ServerContextState<IUserData> = getDefaultContextState(DefaultUserData);
const Context = createContext<IMyUserProfileContext>(DefaultData);

export const MyUserProfileProvider = ({ id = 'myUserProfile', ...props }: CoreProviderProps) => {
	const pathname = usePathname();

	return (
		<QueryProvider
			context={Context}
			defaultData={DefaultData}
			queryKey={['users', 'mine']}
			queryFn={() => () => throwError(getMyUserProfile(), 'getMyUserProfile')}
			id={id}
			disabled={!ProtectedRoutes.some((route) => pathname.startsWith(route))}
			{...props}
		/>
	);
};

export { DefaultData as DefaultMyUserProfileContextData, Context as MyUserProfileContext };
